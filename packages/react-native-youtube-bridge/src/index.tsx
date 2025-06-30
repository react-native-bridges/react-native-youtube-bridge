import type { PlayerControls } from '@react-native-youtube-bridge/core';
import type { YoutubePlayerProps } from './types/youtube';
import YoutubePlayerComponent from './YoutubePlayer';

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
export { useYoutubeOEmbed } from '@react-native-youtube-bridge/react';

export const YoutubePlayer: React.ForwardRefExoticComponent<YoutubePlayerProps & React.RefAttributes<PlayerControls>> =
  YoutubePlayerComponent;

export type { YoutubePlayerProps };
