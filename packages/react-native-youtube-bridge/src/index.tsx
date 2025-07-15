import type { YoutubeViewProps } from './types/youtube';

export {
  ERROR_CODES,
  PlayerState,
  type YoutubePlayerVars,
  type ProgressData,
  type PlaybackQuality,
  type YouTubeError,
  type PlayerInfo,
  type PlayerEvents,
  type PlayerControls,
} from '@react-native-youtube-bridge/core';
export type { default as YoutubePlayer } from './modules/YoutubePlayer';
export { useYoutubeOEmbed } from '@react-native-youtube-bridge/react';

export { default as useYouTubeEvent } from './hooks/useYouTubeEvent';
export { default as useYouTubePlayer } from './hooks/useYouTubePlayer';
export { default as YoutubeView } from './YoutubeView';

export type { YoutubeViewProps };
