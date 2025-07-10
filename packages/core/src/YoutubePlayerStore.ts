import type {
  PlaybackQuality,
  PlayerState,
  PlayerEvents,
  PlayerInfo,
  ProgressData,
  YouTubeError,
  YoutubeEventType,
  YoutubePlayerEvents,
} from './types';
import YoutubePlayerCore from './YoutubePlayerCore';

class YoutubePlayerStore {
  private core: YoutubePlayerCore;
  private listeners = new Map<YoutubeEventType, Set<() => void>>();
  private eventStates = new Map<YoutubeEventType, YoutubePlayerEvents[YoutubeEventType]>();
  private registeredCoreEvents = new Set<keyof PlayerEvents>();

  constructor() {
    this.core = new YoutubePlayerCore({});
  }

  private emit<T extends YoutubeEventType>(event: T, data: YoutubePlayerEvents[T]) {
    this.eventStates.set(event, data);

    // 해당 이벤트를 구독하는 모든 리스너에게 알림
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      for (const listener of eventListeners) {
        listener();
      }
    }
  }

  private createOnReadyCallback = () => (data: PlayerInfo) => {
    this.emit('ready', data);
  };

  private createOnStateChangeCallback = () => (state: PlayerState) => {
    this.emit('statechange', state);
  };

  private createOnProgressCallback = () => (progress: ProgressData) => {
    this.emit('progress', progress);
  };

  private createOnErrorCallback = () => (error: YouTubeError) => {
    this.emit('error', error);
  };

  private createOnPlaybackRateChangeCallback = () => (playbackRate: number) => {
    this.emit('playbackRateChange', playbackRate);
  };

  private createOnPlaybackQualityChangeCallback = () => (playbackQuality: PlaybackQuality) => {
    this.emit('playbackQualityChange', playbackQuality);
  };

  private createOnAutoplayBlockedCallback = () => () => {
    this.emit('autoplayBlocked', undefined);
  };

  private getRequiredCoreEvents(event: YoutubeEventType): keyof PlayerEvents {
    const requiredCoreEvents: Record<YoutubeEventType, keyof PlayerEvents> = {
      ready: 'onReady',
      statechange: 'onStateChange',
      progress: 'onProgress',
      error: 'onError',
      playbackRateChange: 'onPlaybackRateChange',
      playbackQualityChange: 'onPlaybackQualityChange',
      autoplayBlocked: 'onAutoplayBlocked',
    };

    return requiredCoreEvents[event];
  }

  private shouldEnableCoreEvent(coreEvent: keyof PlayerEvents): boolean {
    for (const [event, listeners] of this.listeners.entries()) {
      if (listeners.size > 0) {
        const requiredCoreEvent = this.getRequiredCoreEvents(event);
        if (requiredCoreEvent === coreEvent) {
          return true;
        }
      }
    }
    return false;
  }

  private updateCoreEvents() {
    const coreEventCallbacks: PlayerEvents = {
      onReady: this.createOnReadyCallback(),
      onStateChange: this.createOnStateChangeCallback(),
      onProgress: this.createOnProgressCallback(),
      onError: this.createOnErrorCallback(),
      onPlaybackRateChange: this.createOnPlaybackRateChangeCallback(),
      onPlaybackQualityChange: this.createOnPlaybackQualityChangeCallback(),
      onAutoplayBlocked: this.createOnAutoplayBlockedCallback(),
    };

    const newCallbacks: Partial<PlayerEvents> = {};

    for (const coreEvent of Object.keys(coreEventCallbacks) as (keyof PlayerEvents)[]) {
      const shouldEnable = this.shouldEnableCoreEvent(coreEvent);

      if (shouldEnable && !this.registeredCoreEvents.has(coreEvent)) {
        newCallbacks[coreEvent] = coreEventCallbacks[coreEvent] as any;
        this.registeredCoreEvents.add(coreEvent);
      } else if (!shouldEnable && this.registeredCoreEvents.has(coreEvent)) {
        newCallbacks[coreEvent] = undefined;
        this.registeredCoreEvents.delete(coreEvent);
      }
    }

    if (Object.keys(newCallbacks).length > 0) {
      this.core.updateCallbacks(newCallbacks);
    }
  }

  subscribe(event: YoutubeEventType, listener: () => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)?.add(listener);

    this.updateCoreEvents();

    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(listener);

        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }

      this.updateCoreEvents();
    };
  }

  getSnapshot<T extends YoutubeEventType>(event: T): YoutubePlayerEvents[T] | undefined {
    return this.eventStates.get(event) as YoutubePlayerEvents[T] | undefined;
  }

  play() {
    return this.core.play();
  }
  pause() {
    return this.core.pause();
  }
  seekTo(seconds: number) {
    return this.core.seekTo(seconds);
  }
  setProgressInterval(interval: number) {
    return this.core.setProgressInterval(interval);
  }
}

export default YoutubePlayerStore;
