import type { PlaybackQuality, PlayerInfo, PlayerState, ProgressData, YouTubeError } from '.';

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
