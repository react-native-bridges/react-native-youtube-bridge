import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import YoutubePlayerWrapper from './YoutubePlayerWrapper';
import type { YouTubePlayer } from './types/iframe';
import { ERROR_CODES, type PlayerControls, PlayerState, type YoutubePlayerProps } from './types/youtube';

const YoutubePlayer = forwardRef<PlayerControls, YoutubePlayerProps>(
  (
    {
      videoId,
      width,
      height = 200,
      onReady,
      onStateChange,
      onError,
      onProgress,
      onPlaybackRateChange,
      onPlaybackQualityChange,
      onAutoplayBlocked,
      style,
      playerVars = {
        startTime: 0,
        autoplay: false,
        controls: true,
        loop: false,
        muted: false,
        playsinline: true,
        rel: false,
      },
    },
    ref,
  ) => {
    const { startTime = 0, endTime, autoplay, controls, loop, playsinline, rel } = playerVars;

    const { width: screenWidth } = useWindowDimensions();

    const playerRef = useRef<YouTubePlayer>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const createPlayerRef = useRef<() => void>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    const stopProgressTracking = useCallback(() => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }, []);

    const startProgressTracking = useCallback(() => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }

      progressInterval.current = setInterval(async () => {
        if (!playerRef.current || !playerRef.current.getCurrentTime) {
          stopProgressTracking();
          return;
        }

        try {
          const currentTime = await playerRef.current.getCurrentTime();
          const duration = await playerRef.current.getDuration();
          const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
          const loadedFraction = await playerRef.current.getVideoLoadedFraction();

          onProgress?.({
            currentTime,
            duration,
            percentage,
            loadedFraction,
          });
        } catch (error) {
          console.error('Progress tracking error:', error);
          stopProgressTracking();
        }
      }, 1000);
    }, [onProgress, stopProgressTracking]);

    const loadYouTubeAPI = useCallback(() => {
      if (window.YT?.Player) {
        return Promise.resolve();
      }

      if (window._ytApiPromise) {
        return window._ytApiPromise;
      }

      window._ytApiPromise = new Promise<void>((resolve) => {
        if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
          const checkAPI = () => {
            if (window.YT?.Player) {
              resolve();
              return;
            }

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
    }, []);

    createPlayerRef.current = () => {
      if (!containerRef.current || !window.YT?.Player || !videoId) {
        return;
      }

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying YouTube player:', error);
        }
      }

      const playerId = `youtube-player-${videoId}`;
      containerRef.current.id = playerId;

      playerRef.current = new window.YT.Player(playerId, {
        width: '100%',
        height: '100%',
        videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: controls ? 1 : 0,
          loop: loop ? 1 : 0,
          start: startTime,
          end: endTime,
          playsinline: playsinline ? 1 : 0,
          rel: rel ? 1 : 0,
          enablejsapi: 1,
        },
        events: {
          onReady: () => {
            onReady?.();
            startProgressTracking();
          },
          onStateChange: (event) => {
            const state = event.data;
            console.log('YouTube player state changed:', state);
            onStateChange?.(state);
            if (state === PlayerState.PLAYING) {
              startProgressTracking();
              return;
            }
            stopProgressTracking();
          },
          onError: (event) => {
            console.error('YouTube player error:', event.data);
            const errorCode = event.data;
            onError?.({
              code: errorCode,
              message: ERROR_CODES[errorCode],
            });
          },
          onPlaybackQualityChange: (event) => {
            onPlaybackQualityChange?.(event.data);
          },
          onPlaybackRateChange: (event) => {
            onPlaybackRateChange?.(event.data);
          },
          onAutoplayBlocked,
        },
      });
    };

    const createPlayer = useCallback(async () => {
      try {
        await loadYouTubeAPI();
        createPlayerRef.current?.();
      } catch (error) {
        console.error('Failed to create YouTube player:', error);
        onError?.({
          code: -1,
          message: 'Failed to load YouTube API',
        });
      }
    }, [loadYouTubeAPI, onError]);

    useEffect(() => {
      createPlayer();

      return () => {
        stopProgressTracking();
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (error) {
            console.warn('Error destroying YouTube player on unmount:', error);
          }
        }
      };
    }, [createPlayer, stopProgressTracking]);

    useEffect(() => {
      if (playerRef.current && videoId) {
        try {
          playerRef.current.loadVideoById(videoId);
        } catch (error) {
          console.warn('Error loading new video:', error);
          createPlayer();
        }
      }
    }, [videoId, createPlayer]);

    const play = useCallback(() => {
      playerRef.current?.playVideo();
    }, []);

    const pause = useCallback(() => {
      playerRef.current?.pauseVideo();
    }, []);

    const stop = useCallback(() => {
      playerRef.current?.stopVideo();
    }, []);

    const seekTo = useCallback((seconds: number, allowSeekAhead = true) => {
      playerRef.current?.seekTo(seconds, allowSeekAhead);
    }, []);

    const setVolume = useCallback((volume: number) => {
      playerRef.current?.setVolume(volume);
    }, []);

    const getVolume = useCallback(async (): Promise<number> => {
      const volume = await playerRef.current?.getVolume();

      return volume ?? 0;
    }, []);

    const mute = useCallback(() => {
      playerRef.current?.mute();
    }, []);

    const unMute = useCallback(() => {
      playerRef.current?.unMute();
    }, []);

    const isMuted = useCallback(async (): Promise<boolean> => {
      const isMuted = await playerRef.current?.isMuted();

      return isMuted ?? false;
    }, []);

    const getCurrentTime = useCallback(async (): Promise<number> => {
      const currentTime = await playerRef.current?.getCurrentTime();

      return currentTime ?? 0;
    }, []);

    const getDuration = useCallback(async (): Promise<number> => {
      const duration = await playerRef.current?.getDuration();

      return duration ?? 0;
    }, []);

    const getVideoUrl = useCallback(async (): Promise<string> => {
      const videoUrl = await playerRef.current?.getVideoUrl();

      return videoUrl ?? '';
    }, []);

    const getVideoEmbedCode = useCallback(async (): Promise<string> => {
      const videoEmbedCode = await playerRef.current?.getVideoEmbedCode();

      return videoEmbedCode ?? '';
    }, []);

    const getPlaybackRate = useCallback(async (): Promise<number> => {
      const playbackRate = await playerRef.current?.getPlaybackRate();

      return playbackRate ?? 1;
    }, []);

    const getAvailablePlaybackRates = useCallback(async (): Promise<number[]> => {
      const availablePlaybackRates = await playerRef.current?.getAvailablePlaybackRates();

      return availablePlaybackRates ?? [1];
    }, []);

    const getPlayerState = useCallback(async (): Promise<PlayerState> => {
      const playerState = await playerRef.current?.getPlayerState();

      return playerState ?? PlayerState.UNSTARTED;
    }, []);

    const setPlaybackRate = useCallback((suggestedRate: number) => {
      playerRef.current?.setPlaybackRate(suggestedRate);
    }, []);

    const getVideoLoadedFraction = useCallback(async (): Promise<number> => {
      const videoLoadedFraction = await playerRef.current?.getVideoLoadedFraction();

      return videoLoadedFraction ?? 0;
    }, []);

    const loadVideoById = useCallback((videoId: string, startSeconds?: number, endSeconds?: number) => {
      playerRef.current?.loadVideoById(videoId, startSeconds, endSeconds);
    }, []);

    const cueVideoById = useCallback((videoId: string, startSeconds?: number, endSeconds?: number) => {
      playerRef.current?.cueVideoById(videoId, startSeconds, endSeconds);
    }, []);

    const setSize = useCallback((width: number, height: number) => {
      playerRef.current?.setSize(width, height);
    }, []);

    useImperativeHandle(
      ref,
      (): PlayerControls => ({
        play,
        pause,
        stop,
        getCurrentTime,
        getDuration,
        seekTo,
        setVolume,
        getVolume,
        mute,
        unMute,
        isMuted,
        getVideoUrl,
        getVideoEmbedCode,
        getPlaybackRate,
        setPlaybackRate,
        getAvailablePlaybackRates,
        getPlayerState,
        getVideoLoadedFraction,
        loadVideoById,
        cueVideoById,
        setSize,
      }),
      [
        play,
        pause,
        stop,
        getCurrentTime,
        getDuration,
        seekTo,
        setVolume,
        getVolume,
        mute,
        unMute,
        isMuted,
        getVideoUrl,
        getVideoEmbedCode,
        getPlaybackRate,
        setPlaybackRate,
        getAvailablePlaybackRates,
        getPlayerState,
        getVideoLoadedFraction,
        loadVideoById,
        cueVideoById,
        setSize,
      ],
    );

    return (
      <YoutubePlayerWrapper width={width ?? screenWidth} height={height} style={style}>
        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </YoutubePlayerWrapper>
    );
  },
);

export default YoutubePlayer;
