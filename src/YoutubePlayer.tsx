import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import YoutubePlayerWrapper from './YoutubePlayerWrapper';
import useCreateLocalPlayerHtml from './hooks/useCreateLocalPlayerHtml';
import type { MessageData } from './types/message';
import type { PlayerControls, YoutubePlayerProps } from './types/youtube';

const { width: screenWidth } = Dimensions.get('window');

const YoutubePlayer = forwardRef<PlayerControls, YoutubePlayerProps>(
  (
    {
      videoId,
      width = screenWidth,
      height = 200,
      onReady,
      onStateChange,
      onError,
      onProgress,
      onPlaybackRateChange,
      onPlaybackQualityChange,
      onAutoplayBlocked,
      style,
      playerVars = {
        startTime: 0,
        autoplay: false,
        controls: true,
        loop: false,
        muted: false,
        playsinline: true,
        rel: false,
      },
    },
    ref,
  ) => {
    const { startTime = 0, endTime } = playerVars;

    const webViewRef = useRef<WebView>(null);
    const [isReady, setIsReady] = useState(false);
    const commandIdRef = useRef(0);
    const pendingCommandsRef = useRef<Map<string, (result: unknown) => void>>(new Map());

    const createPlayerHTML = useCreateLocalPlayerHtml({ videoId, ...playerVars });

    const handleMessage = useCallback(
      (event: WebViewMessageEvent) => {
        try {
          const data = JSON.parse(event.nativeEvent.data) as MessageData;

          console.log('handleMessage', data);

          if (data.type === 'ready') {
            setIsReady(true);
            onReady?.();
            return;
          }

          if (data.type === 'stateChange') {
            const state = data.state;
            onStateChange?.(state);
            return;
          }

          if (data.type === 'error') {
            onError?.(data.error);
            return;
          }

          if (data.type === 'progress') {
            onProgress?.(data);
            return;
          }

          if (data.type === 'playbackRateChange') {
            onPlaybackRateChange?.(data.playbackRate);
            return;
          }

          if (data.type === 'playbackQualityChange') {
            onPlaybackQualityChange?.(data.quality);
            return;
          }

          if (data.type === 'autoplayBlocked') {
            onAutoplayBlocked?.();
            return;
          }

          if (data.type === 'commandResult') {
            const resolver = pendingCommandsRef.current.get(data.id);
            if (resolver) {
              resolver(data.result);
              pendingCommandsRef.current.delete(data.id);
            }
            return;
          }
        } catch (error) {
          console.error('Error parsing WebView message:', error);
          onError?.({ code: -1, message: 'Failed to parse WebView message' });
        }
      },
      [onReady, onStateChange, onError, onProgress, onPlaybackRateChange, onPlaybackQualityChange, onAutoplayBlocked],
    );

    const sendCommand = useCallback(
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      (command: string, args: (string | number | boolean | undefined)[] = [], needsResult = false): Promise<any> => {
        return new Promise((resolve) => {
          if (!webViewRef.current || !isReady) {
            resolve(null);
            return;
          }

          const messageId = needsResult ? (++commandIdRef.current).toString() : undefined;

          if (needsResult && messageId) {
            const timeout = setTimeout(() => {
              pendingCommandsRef.current.delete(messageId);
              resolve(null);
            }, 5000);

            pendingCommandsRef.current.set(messageId, (result) => {
              clearTimeout(timeout);
              resolve(result);
            });
          }

          const message = JSON.stringify({
            command,
            args,
            id: messageId,
          });

          console.log('sendCommand', message);

          webViewRef.current?.postMessage(message);

          if (!needsResult) {
            resolve(null);
          }
        });
      },
      [isReady],
    );

    useEffect(() => {
      if (isReady) {
        sendCommand('loadVideoById', [videoId, startTime, endTime]);
      }
    }, [videoId, startTime, endTime, isReady, sendCommand]);

    useImperativeHandle(
      ref,
      (): PlayerControls => ({
        play: () => sendCommand('play'),
        pause: () => sendCommand('pause'),
        stop: () => sendCommand('stop'),
        seekTo: (seconds: number, allowSeekAhead = true) => sendCommand('seekTo', [seconds, allowSeekAhead]),

        setVolume: (volume: number) => sendCommand('setVolume', [volume]),
        getVolume: () => sendCommand('getVolume', [], true),
        mute: () => sendCommand('mute'),
        unMute: () => sendCommand('unMute'),
        isMuted: () => sendCommand('isMuted', [], true),

        getCurrentTime: () => sendCommand('getCurrentTime', [], true),
        getDuration: () => sendCommand('getDuration', [], true),
        getVideoUrl: () => sendCommand('getVideoUrl', [], true),
        getVideoEmbedCode: () => sendCommand('getVideoEmbedCode', [], true),

        getPlaybackRate: () => sendCommand('getPlaybackRate', [], true),
        setPlaybackRate: (rate: number) => {
          sendCommand('setPlaybackRate', [rate]);
        },
        getAvailablePlaybackRates: () => sendCommand('getAvailablePlaybackRates', [], true),

        getPlayerState: () => sendCommand('getPlayerState', [], true),
        getVideoLoadedFraction: () => sendCommand('getVideoLoadedFraction', [], true),

        loadVideoById: (videoId: string, startSeconds?: number, endSeconds?: number) =>
          sendCommand('loadVideoById', [videoId, startSeconds, endSeconds]),
        cueVideoById: (videoId: string, startSeconds?: number, endSeconds?: number) =>
          sendCommand('cueVideoById', [videoId, startSeconds, endSeconds]),

        setSize: (width: number, height: number) => sendCommand('setSize', [width, height]),
      }),
      [sendCommand],
    );

    useEffect(() => {
      return () => {
        // 모든 pending commands 정리
        pendingCommandsRef.current.clear();

        // WebView 내부 cleanup 호출
        if (webViewRef.current && isReady) {
          sendCommand('cleanup');
        }
      };
    }, [isReady, sendCommand]);

    return (
      <YoutubePlayerWrapper width={width} height={height} style={style}>
        <WebView
          ref={webViewRef}
          source={{ html: createPlayerHTML() }}
          style={styles.webView}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          originWhitelist={['*']}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={true}
          scrollEnabled={false}
          bounces={false}
          onError={(error) => {
            console.error('WebView error:', error);
            onError?.({ code: -1, message: 'WebView loading error' });
          }}
          // iOS specific props
          allowsLinkPreview={false}
          dataDetectorTypes="none"
          // Android specific props
          mixedContentMode="compatibility"
          thirdPartyCookiesEnabled={false}
        />
      </YoutubePlayerWrapper>
    );
  },
);

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

YoutubePlayer.displayName = 'YoutubePlayer';

export default YoutubePlayer;
