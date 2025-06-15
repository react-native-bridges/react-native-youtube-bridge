import type { ERROR_CODES, PlaybackQuality, PlayerState, YouTubeError } from './youtube';

declare global {
  interface Window {
    YT: IframeApiType;
    onYouTubeIframeAPIReady: () => void;
    _ytApiPromise: Promise<void>;
  }
}

export type EventType =
  | 'onReady'
  | 'onStateChange'
  | 'onPlaybackQualityChange'
  | 'onPlaybackRateChange'
  | 'onError'
  | 'onApiChange'
  | 'onAutoplayBlocked';

export interface Options {
  width?: number | string | undefined;
  height?: number | string | undefined;
  videoId?: string | undefined;
  host?: string | undefined;
  playerVars?:
    | {
        autoplay?: 0 | 1 | undefined;
        cc_lang_pref?: string | undefined;
        cc_load_policy?: 1 | undefined;
        color?: 'red' | 'white' | undefined;
        controls?: 0 | 1 | undefined;
        disablekb?: 0 | 1 | undefined;
        enablejsapi?: 0 | 1 | undefined;
        end?: number | undefined;
        fs?: 0 | 1 | undefined;
        hl?: string | undefined;
        iv_load_policy?: 1 | 3 | undefined;
        list?: string | undefined;
        listType?: 'playlist' | 'search' | undefined;
        loop?: 0 | 1 | undefined;
        origin?: string | undefined;
        playlist?: string | undefined;
        playsinline?: 0 | 1 | undefined;
        rel?: 0 | 1 | undefined;
        start?: number | undefined;
        widget_referrer?: string | undefined;
      }
    | undefined;
  events?:
    | {
        onReady?: (event: CustomEvent) => void;
        onStateChange?: (event: { data: PlayerState }) => void;
        onPlaybackQualityChange?: (event: { data: PlaybackQuality }) => void;
        onPlaybackRateChange?: (event: { data: number }) => void;
        onError?: (event: { data: keyof typeof ERROR_CODES }) => void;
        onAutoplayBlocked?: (event: CustomEvent) => void;
      }
    | undefined;
}

/**
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
export interface YouTubePlayer {
  addEventListener(event: string, listener: (event: CustomEvent) => void): Promise<void>;
  destroy(): Promise<void>;
  getAvailablePlaybackRates(): Promise<number[]>;
  getCurrentTime(): Promise<number>;
  getDuration(): Promise<number>;
  getIframe(): Promise<HTMLIFrameElement>;
  getOption(module: string, option: string): Promise<unknown>;
  getOptions(): Promise<string[]>;
  getOptions(module: string): Promise<object>;
  setOption(module: string, option: string, value: unknown): Promise<void>;
  setOptions(): Promise<void>;
  cuePlaylist(
    playlist: string | readonly string[],
    index?: number,
    startSeconds?: number,
    suggestedQuality?: string,
  ): Promise<void>;
  cuePlaylist(playlist: {
    listType: string;
    list?: string | undefined;
    index?: number | undefined;
    startSeconds?: number | undefined;
    suggestedQuality?: string | undefined;
  }): Promise<void>;
  loadPlaylist(
    playlist: string | readonly string[],
    index?: number,
    startSeconds?: number,
    suggestedQuality?: string,
  ): Promise<void>;
  loadPlaylist(playlist: {
    listType: string;
    list?: string | undefined;
    index?: number | undefined;
    startSeconds?: number | undefined;
    suggestedQuality?: string | undefined;
  }): Promise<void>;
  getPlaylist(): Promise<readonly string[]>;
  getPlaylistIndex(): Promise<number>;
  getPlaybackRate(): Promise<number>;
  getPlayerState(): Promise<PlayerState>;
  getVideoEmbedCode(): Promise<string>;
  getVideoLoadedFraction(): Promise<number>;
  getVideoUrl(): Promise<string>;
  getVolume(): Promise<number>;
  cueVideoById(videoId: string, startSeconds?: number, endSeconds?: number): Promise<void>;
  cueVideoById(video: {
    videoId: string;
    startSeconds?: number | undefined;
    endSeconds?: number | undefined;
    suggestedQuality?: string | undefined;
  }): Promise<void>;
  cueVideoByUrl(mediaContentUrl: string, startSeconds?: number, suggestedQuality?: string): Promise<void>;
  cueVideoByUrl(video: {
    mediaContentUrl: string;
    startSeconds?: number | undefined;
    endSeconds?: number | undefined;
    suggestedQuality?: string | undefined;
  }): Promise<void>;
  loadVideoByUrl(mediaContentUrl: string, startSeconds?: number, suggestedQuality?: string): Promise<void>;
  loadVideoByUrl(video: {
    mediaContentUrl: string;
    startSeconds?: number | undefined;
    endSeconds?: number | undefined;
    suggestedQuality?: string | undefined;
  }): Promise<void>;
  loadVideoById(videoId: string, startSeconds?: number, endSeconds?: number): Promise<void>;
  loadVideoById(video: {
    videoId: string;
    startSeconds?: number | undefined;
    endSeconds?: number | undefined;
    suggestedQuality?: string | undefined;
  }): Promise<void>;
  isMuted(): Promise<boolean>;
  mute(): Promise<void>;
  nextVideo(): Promise<void>;
  pauseVideo(): Promise<void>;
  playVideo(): Promise<void>;
  playVideoAt(index: number): Promise<void>;
  previousVideo(): Promise<void>;
  removeEventListener(event: string, listener: (event: CustomEvent) => void): Promise<void>;
  seekTo(seconds: number, allowSeekAhead: boolean): Promise<void>;
  setLoop(loopPlaylists: boolean): Promise<void>;
  setPlaybackRate(suggestedRate: number): Promise<void>;
  setShuffle(shufflePlaylist: boolean): Promise<void>;
  setSize(width: number, height: number): Promise<{ width: number; height: number }>;
  setVolume(volume: number): Promise<void>;
  stopVideo(): Promise<void>;
  unMute(): Promise<void>;
  on(eventType: 'stateChange', listener: (event: CustomEvent & { data: number }) => void): void;
  on(eventType: EventType, listener: (event: CustomEvent) => void): void;
}

export interface IframeApiType {
  Player: { new (elementId: string, options: Options): YouTubePlayer };
}
