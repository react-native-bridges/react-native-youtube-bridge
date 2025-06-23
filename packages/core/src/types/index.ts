import type { ERROR_CODES } from '../constants';

type YouTubeErrorCode = keyof typeof ERROR_CODES;
type YouTubeErrorMessage = (typeof ERROR_CODES)[YouTubeErrorCode];

export type YouTubeSource = string | { videoId: string } | { url: string };

export type ProgressData = {
  currentTime: number;
  duration: number;
  percentage: number;
  /**
   * @description The fraction of the video that has been loaded.
   */
  loadedFraction: number;
};

export type YouTubeError = {
  /**
   * @description `2, 5, 100, 101, 150` YouTube error code.
   * @see https://developers.google.com/youtube/iframe_api_reference#Events
   */
  code: YouTubeErrorCode;
  message: YouTubeErrorMessage;
};

export enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}
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

export type YoutubePlayerConfig = {
  videoId: string;
  progressInterval?: number;
  playerVars?: YoutubePlayerVars;
} & PlayerEvents;

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
