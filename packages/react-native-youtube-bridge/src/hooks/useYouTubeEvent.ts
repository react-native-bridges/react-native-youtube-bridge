import type { EventCallback, YoutubePlayerEvents } from '@react-native-youtube-bridge/core';
import { useEffect, useRef, useState } from 'react';

import type YoutubePlayer from '../modules/YoutubePlayer';
import { INTERNAL_SET_PROGRESS_INTERVAL } from '../modules/YoutubePlayer';

const DEFAULT_PROGRESS_INTERVAL = 1000;

/**
 * @param player - The Youtube player instance.
 * @param eventType - The type of event to subscribe to. `progress` event is not supported.
 * @param defaultValue - The default value to return if the event is not triggered.
 * @returns The event data.
 * @example
 * ```ts
 * const player = useYouTubePlayer('AbZH7XWDW_k');
 * const playbackRate = useYouTubeEvent(player, 'playbackRateChange', 1);
 * ```
 */
function useYouTubeEvent<T extends Exclude<keyof YoutubePlayerEvents, 'progress'>>(
  player: YoutubePlayer,
  eventType: T,
  defaultValue?: YoutubePlayerEvents[T],
): YoutubePlayerEvents[T] | null;

/**
 * @param player - The Youtube player instance.
 * @param eventType - The type of event to subscribe to.
 * @param callback - The callback to call when the event is triggered.
 * @param deps - The dependencies to watch for changes.
 * @returns void
 * @example
 * ```ts
 * const player = useYouTubePlayer('AbZH7XWDW_k');
 * useYouTubeEvent(player, 'ready', (playerInfo) => {
 *   console.log('Player is ready!');
 *   console.log('rates', playerInfo.availablePlaybackRates);
 *   console.log('vol', playerInfo.volume);
 *   console.log('muted', playerInfo.muted);
 * });
 * ```
 */
function useYouTubeEvent<T extends keyof YoutubePlayerEvents>(
  player: YoutubePlayer,
  eventType: T,
  callback: EventCallback<YoutubePlayerEvents[T]>,
  deps?: React.DependencyList,
): void;

/**
 * @param player - The Youtube player instance.
 * @param eventType - `progress` event only.
 * @param throttleMs - The throttle time in milliseconds (default 1000ms).
 * @returns The event data.
 * @example
 * ```ts
 * const player = useYouTubePlayer('AbZH7XWDW_k');
 * const progress = useYouTubeEvent(player, 'progress', 1000);
 * ```
 */
function useYouTubeEvent(
  player: YoutubePlayer,
  eventType: 'progress',
  throttleMs?: number,
): YoutubePlayerEvents['progress'] | null;

/**
 * @param player - The Youtube player instance.
 * @param eventType - The type of event to subscribe to.
 * @param callbackOrThrottleOrDefaultValue - The callback to call when the event is triggered. If it is a number, it will be used as the throttle time in milliseconds for `progress` event.
 * @param deps - The dependencies to watch for changes.
 * @returns The event data. If it is a callback, it will return void.
 */
function useYouTubeEvent<T extends keyof YoutubePlayerEvents>(
  player: YoutubePlayer,
  eventType: T,
  callbackOrThrottleOrDefaultValue?:
    | EventCallback<YoutubePlayerEvents[T]>
    | YoutubePlayerEvents[T]
    | null,
  deps?: React.DependencyList,
): YoutubePlayerEvents[T] | null | undefined {
  const isProgress = eventType === 'progress';
  const isCallback = typeof callbackOrThrottleOrDefaultValue === 'function';

  const getThrottleMs = (): number | undefined => {
    if (!isProgress) {
      return undefined;
    }

    return typeof callbackOrThrottleOrDefaultValue === 'number'
      ? callbackOrThrottleOrDefaultValue
      : DEFAULT_PROGRESS_INTERVAL;
  };

  const getDefaultValue = () => {
    if (isCallback || isProgress) {
      return null;
    }

    return callbackOrThrottleOrDefaultValue ?? null;
  };

  const throttleMs = getThrottleMs();
  const defaultValue = getDefaultValue();

  const callbackRef = useRef<EventCallback<YoutubePlayerEvents[T]> | null>(
    isCallback ? callbackOrThrottleOrDefaultValue : null,
  );

  const [data, setData] = useState<YoutubePlayerEvents[T] | null>(defaultValue);

  useEffect(() => {
    if (isCallback) {
      callbackRef.current = callbackOrThrottleOrDefaultValue;
    }
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  }, [callbackOrThrottleOrDefaultValue, isCallback, ...(deps ?? [])]);

  useEffect(() => {
    if (typeof throttleMs === 'number' && player) {
      player[INTERNAL_SET_PROGRESS_INTERVAL](throttleMs);
    }
  }, [throttleMs, player]);

  useEffect(() => {
    if (!player) {
      return;
    }

    const unsubscribe = player.subscribe(eventType, (eventData) => {
      if (isCallback && callbackRef.current) {
        callbackRef.current(eventData);
        return;
      }

      if (!isCallback) {
        setData(eventData);
      }
    });

    return () => {
      setData(defaultValue ?? null);
      unsubscribe();
    };
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  }, [player, eventType, isCallback]);

  return isCallback ? undefined : data;
}

export default useYouTubeEvent;
