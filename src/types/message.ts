import type { PlaybackQuality, PlayerInfo, PlayerState, ProgressData, YouTubeError } from './youtube';

export type MessageType =
  | 'ready'
  | 'stateChange'
  | 'error'
  | 'progress'
  | 'playbackRateChange'
  | 'playbackQualityChange'
  | 'autoplayBlocked'
  | 'commandResult';

export type CommandType =
  | 'play'
  | 'pause'
  | 'stop'
  | 'seekTo'
  | 'setVolume'
  | 'getVolume'
  | 'mute'
  | 'unMute'
  | 'isMuted'
  | 'getCurrentTime'
  | 'getDuration'
  | 'getVideoUrl'
  | 'getVideoEmbedCode'
  | 'getPlaybackRate'
  | 'setPlaybackRate'
  | 'getAvailablePlaybackRates'
  | 'getPlayerState'
  | 'getVideoLoadedFraction'
  | 'loadVideoById'
  | 'cueVideoById'
  | 'setSize'
  | 'cleanup'
  | 'updateProgressInterval';

interface ReadyMessageData {
  type: 'ready';
  playerInfo: PlayerInfo;
}

interface StateChangeMessageData {
  type: 'stateChange';
  state: PlayerState;
}

interface ErrorMessageData {
  type: 'error';
  error: YouTubeError;
}

interface ProgressMessageData extends ProgressData {
  type: 'progress';
}

interface PlaybackRateChangeMessageData {
  type: 'playbackRateChange';
  playbackRate: number;
}

interface PlaybackQualityChangeMessageData {
  type: 'playbackQualityChange';
  quality: PlaybackQuality;
}

interface AutoplayBlockedMessageData {
  type: 'autoplayBlocked';
}

interface CommandResultMessageData {
  type: 'commandResult';
  id: string;
  result: unknown;
}

export type MessageData =
  | ReadyMessageData
  | StateChangeMessageData
  | ErrorMessageData
  | ProgressMessageData
  | PlaybackRateChangeMessageData
  | PlaybackQualityChangeMessageData
  | AutoplayBlockedMessageData
  | CommandResultMessageData;
