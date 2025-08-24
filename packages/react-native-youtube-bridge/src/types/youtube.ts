import type { CSSProperties } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { WebViewProps } from 'react-native-webview';
import type { WebViewSourceUri } from 'react-native-webview/lib/WebViewTypes';
import type YoutubePlayer from '../modules/YoutubePlayer';

/**
 * The props for the YoutubeView component.
 * @example
 * ```tsx
 * const player = useYouTubePlayer('AbZH7XWDW_k');
 *
 * <YoutubeView player={player} />
 * ```
 */
export type YoutubeViewProps = {
  /**
   * The player instance.
   * @example
   * ```tsx
   * const player = useYouTubePlayer('AbZH7XWDW_k');
   *
   * <YoutubeView player={player} />
   * ```
   */
  player: YoutubePlayer;
  /**
   * The width of the player.
   */
  width?: number | 'auto' | `${number}%`;
  /**
   * The height of the player.
   */
  height?: number | 'auto' | `${number}%`;
  /**
   * The style of the player.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * The style of the iframe wrapper.
   * @platform web
   */
  iframeStyle?: CSSProperties;
  /**
   * If set to true, the player will use inline HTML.
   * @remark
   * When false, the player will use a webview with the default URI (https://react-native-youtube-bridge.pages.dev).
   * To use a custom webview, set `webViewUrl` to your own URL.
   * @defaultValue true
   * @platform ios, android
   */
  useInlineHtml?: boolean;
  /**
   * The URL for the WebView source.
   * @remark
   * When `useInlineHtml` is `true`, this value is set as the `baseUrl` for HTML content.
   * In this case, the origin of `webViewUrl` MUST match the YouTube IFrame API `origin`
   * (e.g. baseUrl `https://localhost/` ⇄ origin `https://localhost`).
   *
   * When `useInlineHtml` is `false`, this value overrides the default URI for the WebView source (https://react-native-youtube-bridge.pages.dev).
   * @platform ios, android
   */
  webViewUrl?: string;
  /**
   * The style of the WebView.
   * @platform ios, android
   */
  webViewStyle?: StyleProp<ViewStyle>;
  /**
   * The props of the WebView.
   * @platform ios, android
   */
  webViewProps?: Omit<WebViewProps, 'ref' | 'source' | 'style' | 'onMessage' | 'javaScriptEnabled' | 'onError'> & {
    source?: Omit<WebViewSourceUri, 'uri'>;
  };
};
