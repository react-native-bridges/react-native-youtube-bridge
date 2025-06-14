import type { StyleProp, ViewStyle } from 'react-native';

export type YoutubePlayerVars = {
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  startTime?: number;
  endTime?: number;
  playsinline?: boolean;
  rel?: boolean; // 관련 동영상 표시
  modestbranding?: boolean; // YouTube 로고 숨김
  origin?: string; // 보안을 위한 origin 설정
};

// YouTube IFrame API official documentation based
export type YoutubePlayerProps = {
  videoId: string;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  style?: StyleProp<ViewStyle>;
  // Events
  onReady?: () => void;
  onStateChange?: (state: PlayerState) => void;
  onError?: (error: YouTubeError) => void;
  onProgress?: (progress: ProgressData) => void;
  onPlaybackRateChange?: (playbackRate: number) => void;
  onPlaybackQualityChange?: (quality: string) => void;
  onAutoplayBlocked?: () => void;
  playerVars?: YoutubePlayerVars;
};

export enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

export type YouTubeError = {
  code: number;
  message: string;
};

export const ERROR_CODES = {
  2: 'INVALID_PARAMETER_VALUE',
  5: 'HTML5_PLAYER_ERROR',
  100: 'VIDEO_NOT_FOUND_OR_PRIVATE',
  101: 'EMBEDDED_PLAYBACK_NOT_ALLOWED',
  150: 'EMBEDDED_PLAYBACK_NOT_ALLOWED_SAME_AS_101',
} as const;

export type PlaybackQuality = 'small' | 'medium' | 'large' | 'hd720' | 'hd1080' | 'highres';

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
