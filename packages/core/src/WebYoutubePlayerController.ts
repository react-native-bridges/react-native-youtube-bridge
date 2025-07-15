import { ERROR_CODES } from './constants';
import { type PlayerEvents, PlayerState, type YoutubePlayerConfig } from './types';
import type { YouTubePlayer } from './types/iframe';
import { validateVideoId } from './utils';

type PlayerConfig = Omit<YoutubePlayerConfig, 'source'> & {
  videoId: string;
};

class WebYoutubePlayerController {
  private player: YouTubePlayer | null = null;
  private progressInterval: NodeJS.Timeout | null = null;
  private callbacks: PlayerEvents = {};
  private progressIntervalMs = 1000;
  private seekTimeout: NodeJS.Timeout | null = null;

  static createInstance(): WebYoutubePlayerController {
    return new WebYoutubePlayerController();
  }

  static async initialize(): Promise<void> {
    if (typeof window === 'undefined' || window.YT?.Player) {
      return Promise.resolve();
    }

    if (window._ytApiPromise) {
      return window._ytApiPromise;
    }

    window._ytApiPromise = new Promise<void>((resolve) => {
      if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        let attempts = 0;
        const maxAttempts = 100;

        const checkAPI = () => {
          if (window.YT?.Player) {
            resolve();
            return;
          }
          if (attempts >= maxAttempts) {
            console.error('YouTube API failed to load after timeout');
            resolve();
            return;
          }
          attempts++;
          setTimeout(checkAPI, 100);
        };
        checkAPI();
        return;
      }

      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    });

    return window._ytApiPromise;
  }

  createPlayer(containerId: string, config: PlayerConfig): void {
    if (typeof window === 'undefined' || !window.YT?.Player) {
      return;
    }

    const container = document.getElementById(containerId);

    if (!container) {
      return;
    }

    if (!validateVideoId(config.videoId)) {
      this.callbacks.onError?.({
        code: 1002,
        message: ERROR_CODES[1002],
      });
      return;
    }

    if (this.player) {
      try {
        this.player.destroy();
      } catch (error) {
        console.warn('Error destroying YouTube player:', error);
      }
    }

    this.player = new window.YT.Player(containerId, {
      width: '100%',
      height: '100%',
      videoId: config.videoId,
      playerVars: {
        autoplay: config.playerVars?.autoplay ? 1 : 0,
        controls: config.playerVars?.controls ? 1 : 0,
        loop: config.playerVars?.loop ? 1 : 0,
        start: config.playerVars?.startTime,
        end: config.playerVars?.endTime,
        playsinline: config.playerVars?.playsinline ? 1 : 0,
        rel: config.playerVars?.rel ? 1 : 0,
        origin: config.playerVars?.origin,
        enablejsapi: 1,
      },
      events: {
        onReady: (event) => {
          const { playerInfo } = event.target;

          this.callbacks.onReady?.({
            availablePlaybackRates: playerInfo.availablePlaybackRates,
            availableQualityLevels: playerInfo.availableQualityLevels,
            currentTime: playerInfo.currentTime,
            duration: playerInfo.duration,
            muted: playerInfo.muted,
            playbackQuality: playerInfo.playbackQuality,
            playbackRate: playerInfo.playbackRate,
            playerState: playerInfo.playerState,
            size: playerInfo.size,
            volume: playerInfo.volume,
          });

          this.startProgressTracking();
        },
        onStateChange: (event) => {
          const state = event.data;
          this.callbacks.onStateChange?.(state);

          this.handleStateChange(state);
        },
        onError: (event) => {
          console.error('YouTube player error:', event.data);
          const errorCode = event.data;

          if (ERROR_CODES[errorCode]) {
            this.callbacks.onError?.({
              code: errorCode,
              message: ERROR_CODES[errorCode],
            });
            return;
          }

          this.callbacks.onError?.({
            code: 1004,
            message: 'UNKNOWN_ERROR',
          });
        },
        onPlaybackQualityChange: (event) => {
          this.callbacks.onPlaybackQualityChange?.(event.data);
        },
        onPlaybackRateChange: (event) => {
          this.callbacks.onPlaybackRateChange?.(event.data);
        },
        onAutoplayBlocked: this.callbacks.onAutoplayBlocked,
      },
    });
  }

  private handleStateChange(state: number): void {
    if (state === PlayerState.ENDED) {
      this.stopProgressTracking();
      this.sendProgress();
      return;
    }

    if (state === PlayerState.PLAYING) {
      this.startProgressTracking();
      return;
    }

    if (state === PlayerState.PAUSED) {
      this.stopProgressTracking();
      this.sendProgress();
      return;
    }

    if (state === PlayerState.BUFFERING) {
      this.startProgressTracking();
      return;
    }

    if (state === PlayerState.CUED) {
      this.stopProgressTracking();
      this.sendProgress();
      return;
    }

    this.stopProgressTracking();
  }

  startProgressTracking(): void {
    if (!this.progressIntervalMs || this.progressInterval) {
      return;
    }

    this.progressInterval = setInterval(async () => {
      if (!this.player || !this.player.getCurrentTime) {
        this.stopProgressTracking();
        return;
      }

      try {
        await this.sendProgress();
      } catch (error) {
        console.error('Progress tracking error:', error);
        this.stopProgressTracking();
      }
    }, this.progressIntervalMs);
  }

  stopProgressTracking(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private async sendProgress(): Promise<void> {
    if (!this.player || !this.player.getCurrentTime) {
      return;
    }

    const currentTime = await this.player.getCurrentTime();
    const duration = await this.player.getDuration();
    const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
    const loadedFraction = await this.player.getVideoLoadedFraction();

    this.callbacks.onProgress?.({
      currentTime,
      duration,
      percentage,
      loadedFraction,
    });
  }

  getPlayer(): YouTubePlayer | null {
    return this.player;
  }

  play(): void {
    this.player?.playVideo();
  }
  pause(): void {
    this.player?.pauseVideo();
  }

  stop(): void {
    this.player?.stopVideo();
  }

  async seekTo(seconds: number, allowSeekAhead = true): Promise<void> {
    this.player?.seekTo(seconds, allowSeekAhead);

    if (this.seekTimeout) {
      clearTimeout(this.seekTimeout);
    }

    this.seekTimeout = setTimeout(() => {
      this.sendProgress();
    }, 200);
  }

  setVolume(volume: number): void {
    this.player?.setVolume(volume);
  }

  async getVolume(): Promise<number> {
    const volume = await this.player?.getVolume();
    return volume ?? 0;
  }

  mute(): void {
    this.player?.mute();
  }

  unMute(): void {
    this.player?.unMute();
  }

  async isMuted(): Promise<boolean> {
    const isMuted = await this.player?.isMuted();
    return isMuted ?? false;
  }

  async getCurrentTime(): Promise<number> {
    const currentTime = await this.player?.getCurrentTime();
    return currentTime ?? 0;
  }

  async getDuration(): Promise<number> {
    const duration = await this.player?.getDuration();
    return duration ?? 0;
  }

  async getVideoUrl(): Promise<string> {
    const videoUrl = await this.player?.getVideoUrl();
    return videoUrl ?? '';
  }

  async getVideoEmbedCode(): Promise<string> {
    const videoEmbedCode = await this.player?.getVideoEmbedCode();
    return videoEmbedCode ?? '';
  }

  async getPlaybackRate(): Promise<number> {
    const playbackRate = await this.player?.getPlaybackRate();
    return playbackRate ?? 1;
  }

  async getAvailablePlaybackRates(): Promise<number[]> {
    const availablePlaybackRates = await this.player?.getAvailablePlaybackRates();
    return availablePlaybackRates ?? [1];
  }

  async getPlayerState(): Promise<number> {
    const playerState = await this.player?.getPlayerState();
    return playerState ?? PlayerState.UNSTARTED;
  }

  async setPlaybackRate(suggestedRate: number): Promise<void> {
    await this.player?.setPlaybackRate(suggestedRate);
  }

  async getVideoLoadedFraction(): Promise<number> {
    const videoLoadedFraction = await this.player?.getVideoLoadedFraction();
    return videoLoadedFraction ?? 0;
  }

  loadVideoById(videoId: string, startSeconds?: number, endSeconds?: number): void {
    this.player?.loadVideoById(videoId, startSeconds, endSeconds);
  }

  cueVideoById(videoId: string, startSeconds?: number, endSeconds?: number): void {
    this.player?.cueVideoById(videoId, startSeconds, endSeconds);
  }

  setSize(width: number, height: number): void {
    this.player?.setSize(width, height);
  }

  updateProgressInterval(intervalMs: number): void {
    this.progressIntervalMs = intervalMs;
    if (this.progressInterval) {
      this.stopProgressTracking();
    }

    if (intervalMs) {
      this.startProgressTracking();
      return;
    }

    this.stopProgressTracking();
  }

  updateCallbacks(newCallbacks: Partial<PlayerEvents>): void {
    this.callbacks = { ...this.callbacks, ...newCallbacks };
  }

  destroy(): void {
    this.stopProgressTracking();

    if (this.seekTimeout) {
      clearTimeout(this.seekTimeout);
      this.seekTimeout = null;
    }

    if (this.player) {
      try {
        this.player.destroy();
      } catch (error) {
        console.warn('Error destroying YouTube player:', error);
      }
      this.player = null;
    }
  }
}

export default WebYoutubePlayerController;
