import type { PlayerEvents, YouTubeSource, YoutubePlayer, YoutubePlayerVars } from '@react-native-youtube-bridge/core';
import type { CSSProperties } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { WebViewProps } from 'react-native-webview';
import type { WebViewSourceUri } from 'react-native-webview/lib/WebViewTypes';

export type YoutubePlayerProps = {
  /**
   * @description The source of the video to play.
   * @example
   * ```ts
   * source: 'https://www.youtube.com/watch?v=AbZH7XWDW_k'
   * source: { videoId: 'AbZH7XWDW_k' }
   * source: { url: 'https://www.youtube.com/watch?v=AbZH7XWDW_k' }
   * ```
   */
  source: YouTubeSource;
  /**
   * @description The width of the player.
   */
  width?: number | 'auto' | `${number}%`;
  /**
   * @description The height of the player.
   */
  height?: number | 'auto' | `${number}%`;
  /**
   * @description The interval (in milliseconds) at which `onProgress` callback is called.
   */
  progressInterval?: number;
  /**
   * @description If set to true, the player will use inline HTML.
   * When false, the player will use a webview with the default URI (https://react-native-youtube-bridge.pages.dev).
   * To use a custom webview, set `webViewUrl` to your own URL.
   * @default true
   * @platform ios, android
   */
  useInlineHtml?: boolean;
  /**
   * @description The URL for the WebView source.
   * When `useInlineHtml` is `true`, this value is set as the `baseUrl` for HTML content.
   * When `useInlineHtml` is `false`, this value overrides the default URI for the WebView source (https://react-native-youtube-bridge.pages.dev).
   * @platform ios, android
   */
  webViewUrl?: string;
  style?: StyleProp<ViewStyle>;
  /**
   * @description The style of the WebView.
   * @platform ios, android
   */
  webViewStyle?: StyleProp<ViewStyle>;
  /**
   * @description The props of the WebView.
   * @platform ios, android
   */
  webViewProps?: Omit<WebViewProps, 'ref' | 'source' | 'style' | 'onMessage' | 'javaScriptEnabled' | 'onError'> & {
    source?: Omit<WebViewSourceUri, 'uri'>;
  };
  /**
   * @description The style of the iframe wrapper.
   * @platform web
   */
  iframeStyle?: CSSProperties;
  /**
   * @description YouTube Embedded Players and Player Parameters
   * @see https://developers.google.com/youtube/player_parameters
   */
  playerVars?: YoutubePlayerVars;
} & PlayerEvents;

export type YoutubeViewProps = {
  player: YoutubePlayer;
  width?: number | 'auto' | `${number}%`;
  height?: number | 'auto' | `${number}%`;
  style?: StyleProp<ViewStyle>;
  iframeStyle?: CSSProperties;
  useInlineHtml?: boolean;
  webViewUrl?: string;
  webViewStyle?: StyleProp<ViewStyle>;
  webViewProps?: Omit<WebViewProps, 'ref' | 'source' | 'style' | 'onMessage' | 'javaScriptEnabled' | 'onError'> & {
    source?: Omit<WebViewSourceUri, 'uri'>;
  };
};
