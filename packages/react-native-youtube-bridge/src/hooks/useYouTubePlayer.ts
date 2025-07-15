import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { YouTubeError, YoutubePlayerVars, YouTubeSource } from '@react-native-youtube-bridge/core';
import { useYouTubeVideoId } from '@react-native-youtube-bridge/react';

import YoutubePlayer from '../modules/YoutubePlayer';

/**
 * @param source - The source of the Youtube video.
 * @param config - The config for the Youtube player.
 * @returns The Youtube player instance.
 */
const useYouTubePlayer = (source: YouTubeSource, config?: YoutubePlayerVars): YoutubePlayer => {
  const playerRef = useRef<YoutubePlayer | null>(null);
  const previousVideoId = useRef<string | null | undefined>(undefined);
  const isFastRefresh = useRef(false);

  const onError = useCallback((error: YouTubeError) => {
    console.error('Invalid YouTube source: ', error);
    playerRef.current?.emit('error', error);
  }, []);

  const videoId = useYouTubeVideoId(source, onError);

  if (playerRef.current == null) {
    playerRef.current = new YoutubePlayer(videoId, config);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: videoId changes trigger re-creation
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
