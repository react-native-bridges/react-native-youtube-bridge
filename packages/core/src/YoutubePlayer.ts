import type { YoutubeEventType, YoutubePlayerEvents, YoutubePlayerVars, EventCallback } from './types';
import type WebviewYoutubePlayerController from './WebviewYoutubePlayerController';
import type WebYoutubePlayerController from './WebYoutubePlayerController';

export const INTERNAL_SET_CONTROLLER_INSTANCE = Symbol('setControllerInstance');
export const INTERNAL_UPDATE_PROGRESS_INTERVAL = Symbol('updateProgressInterval');
export const INTERNAL_SET_PROGRESS_INTERVAL = Symbol('setProgressInterval');

class YoutubePlayer {
  private listeners = new Map<YoutubeEventType, Set<EventCallback>>();
  // private eventStates = new Map<YoutubeEventType, YoutubePlayerEvents[YoutubeEventType]>();
  private controller: WebviewYoutubePlayerController | WebYoutubePlayerController | null = null;

  private progressInterval: number | null = null;

  private videoId: string;
  private options: YoutubePlayerVars;

  constructor(videoId: string, options?: YoutubePlayerVars) {
    this.videoId = videoId;
    this.options = options ?? {};
  }

  getVideoId(): string {
    return this.videoId;
  }

  getOptions(): YoutubePlayerVars | undefined {
    return this.options;
  }

  emit<T extends YoutubeEventType>(event: T, data: YoutubePlayerEvents[T]) {
    const eventListeners = this.listeners.get(event);

    if (eventListeners && eventListeners.size > 0) {
      for (const listener of eventListeners) {
        listener(data);
      }
    }
  }

  [INTERNAL_SET_CONTROLLER_INSTANCE](
    controller: WebviewYoutubePlayerController | WebYoutubePlayerController | null,
  ): void {
    this.controller = controller;
  }

  [INTERNAL_SET_PROGRESS_INTERVAL](interval: number): void {
    if (this.progressInterval !== interval) {
      this.progressInterval = interval;
      this.controller?.updateProgressInterval(interval);
    }
  }

  [INTERNAL_UPDATE_PROGRESS_INTERVAL](): void {
    if (this.progressInterval) {
      this.controller?.updateProgressInterval(this.progressInterval);
    }
  }

  subscribe<T extends YoutubeEventType>(event: T, callback: EventCallback<YoutubePlayerEvents[T]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)?.add(callback);

    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);

        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  // getSnapshot<T extends YoutubeEventType>(event: T) {
  //   return this.eventStates.get(event);
  // }

  play() {
    return this.controller?.play();
  }
  pause() {
    return this.controller?.pause();
  }
  stop() {
    return this.controller?.stop();
  }
  seekTo(seconds: number, allowSeekAhead?: boolean) {
    return this.controller?.seekTo(seconds, allowSeekAhead);
  }
  setVolume(volume: number) {
    return this.controller?.setVolume(volume);
  }
  getVolume() {
    return this.controller?.getVolume();
  }
  mute() {
    return this.controller?.mute();
  }
  unMute() {
    return this.controller?.unMute();
  }
  isMuted() {
    return this.controller?.isMuted();
  }
  getCurrentTime() {
    return this.controller?.getCurrentTime();
  }
  getDuration() {
    return this.controller?.getDuration();
  }
  getVideoUrl() {
    return this.controller?.getVideoUrl();
  }
  getVideoEmbedCode() {
    return this.controller?.getVideoEmbedCode();
  }
  getPlaybackRate() {
    return this.controller?.getPlaybackRate();
  }
  setPlaybackRate(suggestedRate: number) {
    return this.controller?.setPlaybackRate(suggestedRate);
  }
  getAvailablePlaybackRates() {
    return this.controller?.getAvailablePlaybackRates();
  }
  getPlayerState() {
    return this.controller?.getPlayerState();
  }
  getVideoLoadedFraction() {
    return this.controller?.getVideoLoadedFraction();
  }
  loadVideoById(videoId: string, startSeconds?: number, endSeconds?: number) {
    return this.controller?.loadVideoById(videoId, startSeconds, endSeconds);
  }
  cueVideoById(videoId: string, startSeconds?: number, endSeconds?: number) {
    return this.controller?.cueVideoById(videoId, startSeconds, endSeconds);
  }
  setSize(width: number, height: number) {
    return this.controller?.setSize(width, height);
  }
  destroy() {
    this.controller?.destroy();
    this.progressInterval = null;
    this.listeners.clear();
    this.controller = null;
  }
}

export default YoutubePlayer;
