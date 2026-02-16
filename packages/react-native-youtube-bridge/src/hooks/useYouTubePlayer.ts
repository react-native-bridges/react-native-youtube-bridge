import type {
  YoutubeError,
  YoutubePlayerVars,
  YoutubeSource,
} from '@react-native-youtube-bridge/core';
import { useYouTubeVideoId } from '@react-native-youtube-bridge/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import YoutubePlayer from '../modules/YoutubePlayer';

/**
 * @param source - The source of the Youtube video.
 * @example
 * ```ts
 * const player = useYouTubePlayer('AbZH7XWDW_k');
 * const player = useYouTubePlayer({ videoId: 'AbZH7XWDW_k' });
 * const player = useYouTubePlayer({ url: 'https://www.youtube.com/watch?v=AbZH7XWDW_k' });
 * ```
 * @param config - The config for the Youtube player.
 * @returns The Youtube player instance.
 * @example
 * ```ts
 * const player = useYouTubePlayer('AbZH7XWDW_k', {
 *   autoplay: true,
 *   controls: true,
 *   playsinline: true,
 *   rel: false,
 *   muted: true,
 * });
 *
 * player.play();
 * player.pause();
 * player.seekTo(10);
 * player.setVolume(50);
 * player.mute();
 * player.unMute();
 * player.getVolume();
 * player.getPlayerState();
 * ```
 */
const useYouTubePlayer = (source: YoutubeSource, config?: YoutubePlayerVars): YoutubePlayer => {
  const playerRef = useRef<YoutubePlayer | null>(null);
  const previousVideoId = useRef<string | null | undefined>(undefined);
  const isFastRefresh = useRef(false);

  const onError = useCallback((error: YoutubeError) => {
    if (__DEV__) {
      console.error('Invalid YouTube source: ', error);
    }
    playerRef.current?.emit('error', error);
  }, []);

  const videoId = useYouTubeVideoId(source, onError);

  if (playerRef.current == null) {
    playerRef.current = new YoutubePlayer(videoId, config);
  }

  const player = useMemo(() => {
    let newPlayer = playerRef.current;

    if (!newPlayer || previousVideoId.current !== videoId) {
      playerRef.current?.destroy();
      newPlayer = new YoutubePlayer(videoId, config);
      playerRef.current = newPlayer;
      previousVideoId.current = videoId;
      return newPlayer;
    }

    isFastRefresh.current = true;

    return newPlayer;
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  }, [videoId]);

  useEffect(() => {
    isFastRefresh.current = false;

    return () => {
      if (playerRef.current && !isFastRefresh.current) {
        playerRef.current?.destroy();
      }
    };
  }, []);

  return player;
};

export default useYouTubePlayer;
