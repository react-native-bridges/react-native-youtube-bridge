import type { ERROR_CODES } from '../constants';

type YouTubeErrorCode = keyof typeof ERROR_CODES;
type YouTubeErrorMessage = (typeof ERROR_CODES)[YouTubeErrorCode];

export type YouTubeSource = string | { videoId: string | undefined } | { url: string | undefined } | undefined;

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

/**
 * @description This parameter specifies the player events.
 * @see https://developers.google.com/youtube/iframe_api_reference#Events
 */
export type PlayerEvents = {
  /**
   * @description Callback function called when the player is ready.
   * @param {PlayerInfo} playerInfo - The player information.
   */
  onReady?: (playerInfo: PlayerInfo) => void;
  /**
   * @description This event fires whenever the player's state changes. The data property of the event object that the API passes to your event listener function will specify an integer that corresponds to the new player state.
   * @param {PlayerState} state - The new player state.
   */
  onStateChange?: (state: PlayerState) => void;
  /**
   * @description This event fires if an error occurs in the player. The API will pass an event object to the event listener function.
   * @param {YouTubeError} error - The error object.
   */
  onError?: (error: YouTubeError) => void;
  /**
   * @description Callback function called at the specified `progressInterval`
   * or when `seekTo` is invoked. Only triggered when `progressInterval` is
   * provided as a positive number.
   * @param {ProgressData} progress - The progress data.
   */
  onProgress?: (progress: ProgressData) => void;
  /**
   * @description This event fires whenever the video playback rate changes. For example, if you call the `setPlaybackRate(suggestedRate)` function, this event will fire if the playback rate actually changes.
   * @param {number} playbackRate - The new playback rate.
   */
  onPlaybackRateChange?: (playbackRate: number) => void;
  /**
   * @description This event fires whenever the video playback quality changes. It might signal a change in the viewer's playback environment.
   * @param {PlaybackQuality} quality - The new playback quality.
   */
  onPlaybackQualityChange?: (quality: PlaybackQuality) => void;
  /**
   * @description This event fires any time the browser blocks autoplay or scripted video playback features, collectively referred to as "autoplay".
   */
  onAutoplayBlocked?: () => void;
};

/**
 * @description This parameter specifies the player parameters.
 * @see https://developers.google.com/youtube/player_parameters
 */
export type YoutubePlayerVars = {
  /**
   * @description This parameter specifies whether the initial video will automatically start to play when the player loads.
   * - If the `muted` is not set to true when activating the `autoplay`,
   * - it may not work properly depending on browser policy. (https://developer.chrome.com/blog/autoplay)
   */
  autoplay?: boolean;
  /**
   * @description This parameter indicates whether the video player controls are displayed.
   * - `controls: false` - Player controls do not display in the player.
   * - `controls: true` (default) - Player controls display in the player.
   * @default true
   */
  controls?: boolean;
  /**
   * @description In the case of a single video player, a setting of 1 causes the player to play the initial video again and again. In the case of a playlist player (or custom player), the player plays the entire playlist and then starts again at the first video.
   * @default false
   */
  loop?: boolean;
  /**
   * @description If the `muted` is set to true, the player will be muted.
   */
  muted?: boolean;
  /**
   * @description This parameter causes the player to begin playing the video at the given number of seconds from the start of the video. The parameter value is a positive integer. Note that similar to the seekTo function, the player will look for the closest keyframe to the time you specify. This means that sometimes the play head may seek to just before the requested time, usually no more than around two seconds.
   */
  startTime?: number;
  /**
   * @description This parameter specifies the time, measured in seconds from the start of the video, when the player should stop playing the video. The parameter value is a positive integer.
   */
  endTime?: number;
  /**
   * @description This parameter controls whether videos play inline or fullscreen on iOS. Valid values are:
   * - `playsinline: false` - Results in fullscreen playback. This is currently the default value, though the default is subject to change.
   * - `playsinline: true` - Results in inline playback for mobile browsers and for WebViews created with the `allowsInlineMediaPlayback` property set to `YES`.
   */
  playsinline?: boolean;
  /**
   * @description Prior to the change, this parameter indicates whether the player should show related videos when playback of the initial video ends.
   * After the change, you will not be able to disable related videos. Instead, if the `rel` parameter is set to `false, related videos will come from the same channel as the video that was just played.
   */
  rel?: boolean;
  /**
   * @description This parameter provides an extra security measure for the IFrame API and is only supported for IFrame embeds.
   */
  origin?: string;
};

export type YoutubePlayerConfig = {
  videoId: string;
  progressInterval?: number;
  playerVars?: YoutubePlayerVars;
} & PlayerEvents;

/**
 * @description The player controls.
 * @see https://developers.google.com/youtube/iframe_api_reference#Functions
 */
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

export type YoutubePlayerEvents = {
  ready: PlayerInfo;
  stateChange: PlayerState;
  error: YouTubeError;
  progress: ProgressData;
  playbackRateChange: number;
  playbackQualityChange: PlaybackQuality;
  autoplayBlocked: undefined;
};

export type EventCallback<Data = any> = (data: Data) => any;
