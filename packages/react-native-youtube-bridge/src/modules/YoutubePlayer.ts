import type {
  YoutubePlayerEvents,
  YoutubePlayerVars,
  EventCallback,
  WebYoutubePlayerController,
} from '@react-native-youtube-bridge/core';

import type WebviewYoutubePlayerController from './WebviewYoutubePlayerController';

export const INTERNAL_SET_CONTROLLER_INSTANCE = Symbol('setControllerInstance');
export const INTERNAL_UPDATE_PROGRESS_INTERVAL = Symbol('updateProgressInterval');
export const INTERNAL_SET_PROGRESS_INTERVAL = Symbol('setProgressInterval');

type YoutubeEventType = keyof YoutubePlayerEvents;

class YoutubePlayer {
  private listeners = new Map<YoutubeEventType, Set<EventCallback>>();
  // private eventStates = new Map<YoutubeEventType, YoutubePlayerEvents[YoutubeEventType]>();
  private controller: WebviewYoutubePlayerController | WebYoutubePlayerController | null = null;

  private progressInterval: number | null = null;

  private videoId: string | null | undefined;
  private options: YoutubePlayerVars;

  constructor(videoId: string | null | undefined, options?: YoutubePlayerVars) {
    this.videoId = videoId;
    this.options = options ?? {};
  }

  getVideoId(): string | null | undefined {
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

  subscribe<T extends YoutubeEventType>(
    event: T,
    callback: EventCallback<YoutubePlayerEvents[T]>,
  ): () => void {
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

  /**
   * Play the video.
   * @example
   * ```ts
   * player.play();
   * ```
   */
  play() {
    return this.controller?.play();
  }

  /**
   * Pause the video.
   * @example
   * ```ts
   * player.pause();
   * ```
   */
  pause() {
    return this.controller?.pause();
  }

  /**
   * Stop the video.
   * @example
   * ```ts
   * player.stop();
   * ```
   */
  stop() {
    return this.controller?.stop();
  }

  /**
   * Seek to a specific time in the video.
   * @param seconds - The time in seconds to seek to.
   * @param allowSeekAhead - Whether to allow seeking ahead.
   * @example
   * ```ts
   * player.seekTo(10, true);
   * ```
   */
  seekTo(seconds: number, allowSeekAhead?: boolean) {
    return this.controller?.seekTo(seconds, allowSeekAhead);
  }

  /**
   * Set the volume of the video.
   * @param volume - The volume to set.
   * @example
   * ```ts
   * player.setVolume(50);
   * ```
   */
  setVolume(volume: number) {
    return this.controller?.setVolume(volume);
  }

  /**
   * Get the volume of the video.
   * @example
   * ```ts
   * player.getVolume();
   * ```
   */
  getVolume() {
    return this.controller?.getVolume();
  }

  /**
   * Mute the video.
   * @example
   * ```ts
   * player.mute();
   * ```
   */
  mute() {
    return this.controller?.mute();
  }

  /**
   * Unmute the video.
   * @example
   * ```ts
   * player.unMute();
   * ```
   */
  unMute() {
    return this.controller?.unMute();
  }

  /**
   * Check if the video is muted.
   * @example
   * ```ts
   * player.isMuted();
   * ```
   */
  isMuted() {
    return this.controller?.isMuted();
  }

  /**
   * Get the current time of the video.
   * @example
   * ```ts
   * player.getCurrentTime();
   * ```
   */
  getCurrentTime() {
    return this.controller?.getCurrentTime();
  }

  /**
   * Get the duration of the video.
   * @example
   * ```ts
   * player.getDuration();
   * ```
   */
  getDuration() {
    return this.controller?.getDuration();
  }

  /**
   * Get the URL of the video.
   * @example
   * ```ts
   * player.getVideoUrl();
   * ```
   */
  getVideoUrl() {
    return this.controller?.getVideoUrl();
  }

  /**
   * Get the embed code of the video.
   * @example
   * ```ts
   * player.getVideoEmbedCode();
   * ```
   */
  getVideoEmbedCode() {
    return this.controller?.getVideoEmbedCode();
  }

  /**
   * Get the playback rate of the video.
   * @example
   * ```ts
   * player.getPlaybackRate();
   * ```
   */
  getPlaybackRate() {
    return this.controller?.getPlaybackRate();
  }

  /**
   * Set the playback rate of the video.
   * @param suggestedRate - The playback rate to set.
   * @example
   * ```ts
   * player.setPlaybackRate(1.5);
   * ```
   */
  setPlaybackRate(suggestedRate: number) {
    return this.controller?.setPlaybackRate(suggestedRate);
  }

  /**
   * Get the available playback rates of the video.
   * @example
   * ```ts
   * player.getAvailablePlaybackRates();
   * ```
   */
  getAvailablePlaybackRates() {
    return this.controller?.getAvailablePlaybackRates();
  }

  /**
   * Get the state of the player.
   * @example
   * ```ts
   * player.getPlayerState();
   * ```
   */
  getPlayerState() {
    return this.controller?.getPlayerState();
  }

  /**
   * Get the loaded fraction of the video.
   * @example
   * ```ts
   * player.getVideoLoadedFraction();
   * ```
   */
  getVideoLoadedFraction() {
    return this.controller?.getVideoLoadedFraction();
  }

  /**
   * Load a video by ID.
   * @param videoId - The ID of the video to load.
   * @param startSeconds - The time in seconds to start the video.
   * @param endSeconds - The time in seconds to end the video.
   * @example
   * ```ts
   * player.loadVideoById('AbZH7XWDW_k');
   * ```
   */
  loadVideoById(videoId: string, startSeconds?: number, endSeconds?: number) {
    return this.controller?.loadVideoById(videoId, startSeconds, endSeconds);
  }

  /**
   * Cue a video by ID.
   * @param videoId - The ID of the video to cue.
   * @param startSeconds - The time in seconds to start the video.
   * @param endSeconds - The time in seconds to end the video.
   * @example
   * ```ts
   * player.cueVideoById('AbZH7XWDW_k');
   * ```
   */
  cueVideoById(videoId: string, startSeconds?: number, endSeconds?: number) {
    return this.controller?.cueVideoById(videoId, startSeconds, endSeconds);
  }

  /**
   * Set the size of the player.
   * @param width - The width of the player.
   * @param height - The height of the player.
   * @example
   * ```ts
   * player.setSize(100, 100);
   * ```
   */
  setSize(width: number, height: number) {
    return this.controller?.setSize(width, height);
  }
  destroy() {
    this.listeners.clear();
    this.controller?.destroy();
    this.controller = null;
    this.progressInterval = null;
  }
}

export default YoutubePlayer;
