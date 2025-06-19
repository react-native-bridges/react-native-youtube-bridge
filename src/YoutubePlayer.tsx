import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { type DataDetectorTypes, Dimensions, StyleSheet } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import YoutubePlayerWrapper from './YoutubePlayerWrapper';
import useCreateLocalPlayerHtml from './hooks/useCreateLocalPlayerHtml';
import useYouTubeVideoId from './hooks/useYoutubeVideoId';
import type { CommandType, MessageData } from './types/message';
import type { PlayerControls, YoutubePlayerProps } from './types/youtube';
import { safeNumber, validateVideoId } from './utils/validate';

const { width: screenWidth } = Dimensions.get('window');

const YoutubePlayer = forwardRef<PlayerControls, YoutubePlayerProps>(
  (
    {
      source,
      width = screenWidth,
      height = 200,
      progressInterval,
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
      webViewStyle,
      webViewProps,
    },
    ref,
  ) => {
    const { startTime = 0, endTime } = playerVars;

    const videoId = useYouTubeVideoId(source);

    const webViewRef = useRef<WebView>(null);
    const [isReady, setIsReady] = useState(false);
    const commandIdRef = useRef(0);
    const pendingCommandsRef = useRef<Map<string, (result: unknown) => void>>(new Map());

    const dataDetectorTypes = useMemo(() => ['none'] as DataDetectorTypes[], []);

    const createPlayerHTML = useCreateLocalPlayerHtml({ videoId, ...playerVars });

    const handleMessage = useCallback(
      (event: WebViewMessageEvent) => {
        try {
          const data = JSON.parse(event.nativeEvent.data) as MessageData;

          if (data.type === 'ready') {
            const { playerInfo } = data;

            setIsReady(true);
            onReady?.({
              availablePlaybackRates: playerInfo.availablePlaybackRates,
              availableQualityLevels: playerInfo.availableQualityLevels,
              currentTime: playerInfo.currentTime,
              duration: playerInfo.duration,
              muted: playerInfo.muted,
              playbackQuality: playerInfo.playbackQuality,
              playbackRate: playerInfo.playbackRate,
              playerState: playerInfo.playerState,
              size: playerInfo.size,
              volume: playerInfo.volume,
            });
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
          onError?.({ code: 1000, message: 'FAILED_TO_PARSE_WEBVIEW_MESSAGE' });
        }
      },
      [onReady, onStateChange, onError, onProgress, onPlaybackRateChange, onPlaybackQualityChange, onAutoplayBlocked],
    );

    const sendCommand = useCallback(
      (
        command: CommandType,
        args: (string | number | boolean | undefined)[] = [],
        needsResult = false,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      ): Promise<any> => {
        return new Promise((resolve) => {
          if (!webViewRef.current || !isReady) {
            resolve(null);
            return;
          }

          const messageId = needsResult ? (++commandIdRef.current).toString() : undefined;

          if (needsResult && messageId) {
            const timeout = setTimeout(() => {
              pendingCommandsRef.current.delete(messageId);
              console.warn('Command timeout:', command, messageId);
              resolve(null);
            }, 5000);

            pendingCommandsRef.current.set(messageId, (result) => {
              clearTimeout(timeout);
              resolve(result);
            });
          }

          const commandData = {
            command,
            args,
            ...(messageId && { id: messageId }),
          };

          const injectedJS = /*js*/ `
            window.__execCommand && window.__execCommand(${JSON.stringify(commandData)}); true;
          `;

          webViewRef.current?.injectJavaScript(injectedJS);

          if (!needsResult) {
            resolve(null);
          }
        });
      },
      [isReady],
    );

    useEffect(() => {
      if (!isReady) {
        return;
      }

      if (!validateVideoId(videoId)) {
        onError?.({ code: 1002, message: 'INVALID_YOUTUBE_VIDEO_ID' });
        return;
      }

      sendCommand('loadVideoById', [videoId, startTime, endTime]);
    }, [videoId, startTime, endTime, isReady, sendCommand, onError]);

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
        pendingCommandsRef.current.clear();

        if (webViewRef.current && isReady) {
          sendCommand('cleanup');
        }
      };
    }, [isReady, sendCommand]);

    useEffect(() => {
      if (isReady) {
        const safeInterval = safeNumber(progressInterval);

        sendCommand('updateProgressInterval', [safeInterval]);
      }
    }, [progressInterval, isReady, sendCommand]);

    return (
      <YoutubePlayerWrapper width={width} height={height} style={style}>
        <WebView
          ref={webViewRef}
          source={{ html: createPlayerHTML() }}
          style={[styles.webView, webViewStyle]}
          onMessage={handleMessage}
          {...webViewProps}
          javaScriptEnabled
          domStorageEnabled
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          bounces={false}
          scrollEnabled={false}
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={['*']}
          onError={(error) => {
            console.error('WebView error:', error);
            onError?.({ code: 1001, message: 'WEBVIEW_LOADING_ERROR' });
          }}
          // iOS specific props
          allowsLinkPreview={false}
          dataDetectorTypes={dataDetectorTypes}
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
