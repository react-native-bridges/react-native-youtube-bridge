import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import YouTubePlayerCore from '../modules/YouTubePlayerCore';
import { ERROR_CODES, type PlayerControls, PlayerState, type YoutubePlayerConfig } from '../types/youtube';

const useYouTubePlayer = (config: YoutubePlayerConfig) => {
  const coreRef = useRef<YouTubePlayerCore | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  const {
    videoId,
    progressInterval = 0,
    playerVars = {},
    onReady,
    onStateChange,
    onError,
    onProgress,
    onPlaybackRateChange,
    onPlaybackQualityChange,
    onAutoplayBlocked,
  } = config;

  const { startTime, endTime, autoplay, controls, loop, muted, playsinline, rel, origin } = playerVars;

  const cleanup = useCallback(() => {
    coreRef.current?.destroy();
    coreRef.current = null;
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!coreRef.current) {
      coreRef.current = new YouTubePlayerCore({
        onReady: (playerInfo) => {
          setIsReady(true);
          onReady?.(playerInfo);
        },
        onStateChange,
        onError,
        onProgress,
        onPlaybackRateChange,
        onPlaybackQualityChange,
        onAutoplayBlocked,
      });
    }
    return cleanup;
  }, []);

  useEffect(() => {
    const initialize = async () => {
      if (!containerRef.current) {
        return;
      }

      try {
        await YouTubePlayerCore.loadAPI();
        const containerId = `youtube-player-${videoId}`;
        containerRef.current.id = containerId;

        coreRef.current?.createPlayer(containerId, {
          videoId,
          playerVars: {
            autoplay,
            controls,
            loop,
            muted,
            playsinline,
            rel,
            startTime,
            endTime,
            origin,
          },
        });
      } catch (error) {
        console.error('Failed to create YouTube player:', error);
        onError?.({
          code: 1003,
          message: ERROR_CODES[1003],
        });
      }
    };

    initialize();
  }, [videoId, startTime, endTime, autoplay, controls, loop, muted, playsinline, rel, origin, onError]);

  useEffect(() => {
    if (isReady && videoId && coreRef.current) {
      try {
        coreRef.current.loadVideoById(videoId, startTime, endTime);
      } catch (error) {
        console.warn('Error loading new video:', error);
      }
    }
  }, [videoId, isReady, startTime, endTime]);

  useEffect(() => {
    if (coreRef.current) {
      coreRef.current.setProgressInterval(progressInterval);
    }
  }, [progressInterval]);

  useEffect(() => {
    coreRef.current?.updateCallbacks({
      onReady: (playerInfo) => {
        setIsReady(true);
        onReady?.(playerInfo);
      },
      onStateChange,
      onError,
      onProgress,
      onPlaybackRateChange,
      onPlaybackQualityChange,
      onAutoplayBlocked,
    });
  }, [onReady, onStateChange, onError, onProgress, onPlaybackRateChange, onPlaybackQualityChange, onAutoplayBlocked]);

  const playerControls = useMemo(
    (): PlayerControls => ({
      play: () => coreRef.current?.play(),
      pause: () => coreRef.current?.pause(),
      stop: () => coreRef.current?.stop(),
      seekTo: (seconds: number, allowSeekAhead?: boolean) =>
        coreRef.current?.seekTo(seconds, allowSeekAhead) ?? Promise.resolve(),
      getCurrentTime: () => coreRef.current?.getCurrentTime() ?? Promise.resolve(0),
      getDuration: () => coreRef.current?.getDuration() ?? Promise.resolve(0),
      setVolume: (volume: number) => coreRef.current?.setVolume(volume),
      getVolume: () => coreRef.current?.getVolume() ?? Promise.resolve(0),
      mute: () => coreRef.current?.mute(),
      unMute: () => coreRef.current?.unMute(),
      isMuted: () => coreRef.current?.isMuted() ?? Promise.resolve(false),
      getVideoUrl: () => coreRef.current?.getVideoUrl() ?? Promise.resolve(''),
      getVideoEmbedCode: () => coreRef.current?.getVideoEmbedCode() ?? Promise.resolve(''),
      getPlaybackRate: () => coreRef.current?.getPlaybackRate() ?? Promise.resolve(1),
      setPlaybackRate: (rate: number) => coreRef.current?.setPlaybackRate(rate),
      getAvailablePlaybackRates: () => coreRef.current?.getAvailablePlaybackRates() ?? Promise.resolve([1]),
      getPlayerState: () => coreRef.current?.getPlayerState() ?? Promise.resolve(PlayerState.UNSTARTED),
      getVideoLoadedFraction: () => coreRef.current?.getVideoLoadedFraction() ?? Promise.resolve(0),
      loadVideoById: (videoId: string, startSeconds?: number, endSeconds?: number) =>
        coreRef.current?.loadVideoById(videoId, startSeconds, endSeconds),
      cueVideoById: (videoId: string, startSeconds?: number, endSeconds?: number) =>
        coreRef.current?.cueVideoById(videoId, startSeconds, endSeconds),
      setSize: (width: number, height: number) => coreRef.current?.setSize(width, height),
    }),
    [],
  );

  return {
    containerRef,
    controls: playerControls,
    isReady,
    cleanup,
  };
};

export default useYouTubePlayer;
