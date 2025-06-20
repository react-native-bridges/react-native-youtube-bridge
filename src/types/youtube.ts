import type { CSSProperties } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import type { WebViewProps } from 'react-native-webview';

export type YoutubePlayerVars = {
  /**
   * @description If the `muted` is not set to true when activating the `autoplay`,
   * it may not work properly depending on browser policy. (https://developer.chrome.com/blog/autoplay)
   */
  autoplay?: boolean;
  /**
   * @description If the `controls` is set to true, the player will display the controls.
   */
  controls?: boolean;
  /**
   * @description If the `loop` is set to true, the player will loop the video.
   */
  loop?: boolean;
  /**
   * @description If the `muted` is set to true, the player will be muted.
   */
  muted?: boolean;
  startTime?: number;
  endTime?: number;
  playsinline?: boolean;
  /**
   * @description If the `rel` is set to true, the related videos will be displayed.
   */
  rel?: boolean;
  /**
   * @description The origin of the player.
   */
  origin?: string;
};

export type PlayerEvents = {
  /**
   * @description Callback function called when the player is ready.
   */
  onReady?: (playerInfo: PlayerInfo) => void;
  onStateChange?: (state: PlayerState) => void;
  onError?: (error: YouTubeError) => void;
  /**
   * @description Callback function called at the specified `progressInterval`
   * or when `seekTo` is invoked. Only triggered when `progressInterval` is
   * provided as a positive number.
   */
  onProgress?: (progress: ProgressData) => void;
  onPlaybackRateChange?: (playbackRate: number) => void;
  onPlaybackQualityChange?: (quality: PlaybackQuality) => void;
  onAutoplayBlocked?: () => void;
};

export type YouTubeSource = string | { videoId: string } | { url: string };

export type YoutubePlayerProps = {
  source: YouTubeSource;
  width?: DimensionValue;
  height?: DimensionValue;
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
   * @platform ios, android
   */
  webViewStyle?: StyleProp<ViewStyle>;
  /**
   * @platform ios, android
   */
  webViewProps?: Omit<WebViewProps, 'ref' | 'source' | 'style' | 'onMessage' | 'javaScriptEnabled' | 'onError'>;
  /**
   * @platform web
   */
  iframeStyle?: CSSProperties;
  /**
   * @description YouTube Embedded Players and Player Parameters
   * @see https://developers.google.com/youtube/player_parameters
   */
  playerVars?: YoutubePlayerVars;
} & PlayerEvents;

export type YoutubePlayerConfig = {
  videoId: string;
  progressInterval?: number;
  playerVars?: YoutubePlayerVars;
} & PlayerEvents;

export enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

type YouTubeErrorCode = keyof typeof ERROR_CODES;
type YouTubeErrorMessage = (typeof ERROR_CODES)[YouTubeErrorCode];

export type YouTubeError = {
  /**
   * @description `2, 5, 100, 101, 150` YouTube error code.
   * @see https://developers.google.com/youtube/iframe_api_reference#Events
   */
  code: YouTubeErrorCode;
  message: YouTubeErrorMessage;
};

export const ERROR_CODES = {
  2: 'INVALID_PARAMETER_VALUE',
  5: 'HTML5_PLAYER_ERROR',
  100: 'VIDEO_NOT_FOUND_OR_PRIVATE',
  101: 'EMBEDDED_PLAYBACK_NOT_ALLOWED',
  150: 'EMBEDDED_RESTRICTED',
  1000: 'FAILED_TO_PARSE_WEBVIEW_MESSAGE',
  1001: 'WEBVIEW_LOADING_ERROR',
  1002: 'INVALID_YOUTUBE_VIDEO_ID',
  1003: 'FAILED_TO_LOAD_YOUTUBE_API',
  1004: 'UNKNOWN_ERROR',
} as const;

export type PlaybackQuality = 'small' | 'medium' | 'large' | 'hd720' | 'hd1080' | 'highres';

export type PlayerInfo = {
  availablePlaybackRates?: number[];
  availableQualityLevels?: PlaybackQuality[];
  currentTime?: number;
  duration?: number;
  muted?: boolean;
  playbackQuality?: PlaybackQuality;
  playbackRate?: number;
  playerState?: PlayerState;
  size?: {
    width: number;
    height: number;
  };
  volume?: number;
};

export type ProgressData = {
  currentTime: number;
  duration: number;
  percentage: number;
  loadedFraction: number; // 버퍼링된 비율
};

export type PlayerControls = {
  // Playback controls
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;

  // Volume controls
  setVolume: (volume: number) => void;
  getVolume: () => Promise<number>;
  mute: () => void;
  unMute: () => void;
  isMuted: () => Promise<boolean>;

  // Video information
  getCurrentTime: () => Promise<number>;
  getDuration: () => Promise<number>;
  getVideoUrl: () => Promise<string>;
  getVideoEmbedCode: () => Promise<string>;

  // Playback rate
  getPlaybackRate: () => Promise<number>;
  setPlaybackRate: (rate: number) => void;
  getAvailablePlaybackRates: () => Promise<number[]>;

  // Player state
  getPlayerState: () => Promise<PlayerState>;
  getVideoLoadedFraction: () => Promise<number>;

  // Playlist controls (video queuing)
  loadVideoById: (videoId: string, startSeconds?: number, endSeconds?: number) => void;
  cueVideoById: (videoId: string, startSeconds?: number, endSeconds?: number) => void;

  // Player size
  setSize: (width: number, height: number) => void;
};
