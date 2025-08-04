import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type DataDetectorTypes, Dimensions, StyleSheet, Linking } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import { type MessageData, MATCH_URL_YOUTUBE } from '@react-native-youtube-bridge/core';

import YoutubeViewWrapper from './YoutubeViewWrapper';
import useCreateLocalPlayerHtml from './hooks/useCreateLocalPlayerHtml';
import type { YoutubeViewProps } from './types/youtube';
import { getYoutubeWebViewUrl } from './utils/youtube';
import WebviewYoutubePlayerController from './modules/WebviewYoutubePlayerController';
import { INTERNAL_SET_CONTROLLER_INSTANCE, INTERNAL_UPDATE_PROGRESS_INTERVAL } from './modules/YoutubePlayer';

const { width: screenWidth } = Dimensions.get('window');

function YoutubeView({
  player,
  webViewUrl: webViewBaseUrl,
  width = screenWidth,
  height = 200,
  useInlineHtml = true,
  style,
  webViewStyle,
  webViewProps,
}: YoutubeViewProps) {
  const webViewRef = useRef<WebView>(null);
  const playerRef = useRef<WebviewYoutubePlayerController>(null);

  const [isReady, setIsReady] = useState(false);

  const dataDetectorTypes = useMemo(() => ['none'] as DataDetectorTypes[], []);

  const { videoId, playerVars } = useMemo(() => {
    return { videoId: player.getVideoId(), playerVars: player.getOptions() || {} };
  }, [player]);

  const createPlayerHTML = useCreateLocalPlayerHtml({ videoId, useInlineHtml, ...playerVars });
  const webViewUrl = getYoutubeWebViewUrl(videoId, useInlineHtml, playerVars, webViewBaseUrl);

  // biome-ignore lint/correctness/useExhaustiveDependencies: webViewProps.source is intentionally excluded to prevent unnecessary re-renders
  const webViewSource = useMemo(() => {
    if (useInlineHtml) {
      return { html: createPlayerHTML(), ...(webViewBaseUrl ? { baseUrl: webViewBaseUrl } : {}) };
    }

    if (webViewUrl) {
      return { ...(webViewProps?.source ?? {}), uri: webViewUrl };
    }

    return undefined;
  }, [useInlineHtml, createPlayerHTML, webViewBaseUrl, webViewUrl]);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data) as MessageData | undefined | null;

        if (!data) {
          return;
        }

        if (data.type === 'commandResult') {
          const pendingCommands = playerRef.current?.getPendingCommands();

          const resolver = pendingCommands?.get(data.id);

          if (resolver) {
            resolver(data.result);
            pendingCommands?.delete(data.id);
          }
          return;
        }

        if (data.type === 'ready') {
          setIsReady(true);
          player.emit(data.type, data.playerInfo);
          return;
        }

        if (data.type === 'stateChange') {
          player.emit(data.type, data.state);
          return;
        }

        if (data.type === 'error') {
          player.emit(data.type, data.error);
          return;
        }

        if (data.type === 'progress') {
          player.emit(data.type, data.progress);
          return;
        }

        if (data.type === 'playbackRateChange') {
          player.emit(data.type, data.playbackRate);
          return;
        }

        if (data.type === 'playbackQualityChange') {
          player.emit(data.type, data.quality);
          return;
        }

        if (data.type === 'autoplayBlocked') {
          player.emit(data.type, undefined);
          return;
        }
      } catch (error) {
        console.error('Error parsing WebView message:', error);
        player.emit('error', { code: 1000, message: 'FAILED_TO_PARSE_WEBVIEW_MESSAGE' });
      }
    },
    [player],
  );

  const handleShouldStartLoadWithRequest = useCallback((request: ShouldStartLoadRequest) => {
    if (MATCH_URL_YOUTUBE.test(request.url) && !request.url.includes('/embed/')) {
      Linking.openURL(request.url);
      return false;
    }

    return true;
  }, []);

  useEffect(() => {
    if (isReady && webViewRef.current) {
      const controller = WebviewYoutubePlayerController.createInstance(webViewRef);

      playerRef.current = controller;

      player[INTERNAL_SET_CONTROLLER_INSTANCE](controller);
      player[INTERNAL_UPDATE_PROGRESS_INTERVAL]();
    }

    return () => {
      if (isReady) {
        setIsReady(false);
      }
    };
  }, [isReady, player]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <YoutubeViewWrapper width={width} height={height} style={style}>
      <WebView
        domStorageEnabled
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        bounces={false}
        scrollEnabled={false}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        style={[styles.webView, webViewStyle]}
        // iOS specific props
        allowsLinkPreview={false}
        dataDetectorTypes={dataDetectorTypes}
        // Android specific props
        mixedContentMode="compatibility"
        thirdPartyCookiesEnabled={false}
        webviewDebuggingEnabled={__DEV__}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        {...webViewProps}
        ref={webViewRef}
        javaScriptEnabled
        source={webViewSource}
        onMessage={handleMessage}
        onError={(error) => {
          console.error('WebView error:', error);
          player.emit('error', { code: 1001, message: 'WEBVIEW_LOADING_ERROR' });
        }}
      />
    </YoutubeViewWrapper>
  );
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default YoutubeView;
