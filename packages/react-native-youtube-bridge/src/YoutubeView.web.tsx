import { useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { WebYoutubePlayerController } from '@react-native-youtube-bridge/core';

import { INTERNAL_SET_CONTROLLER_INSTANCE, INTERNAL_UPDATE_PROGRESS_INTERVAL } from './modules/YoutubePlayer';
import YoutubeViewWrapper from './YoutubeViewWrapper';
import type { YoutubeViewProps } from './types/youtube';

function YoutubeView({ player, height, width, style, iframeStyle }: YoutubeViewProps) {
  const { width: screenWidth } = useWindowDimensions();

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<WebYoutubePlayerController | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    WebYoutubePlayerController.initialize().then(() => {
      setIsInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (!isInitialized || !containerRef.current || !player) {
      return;
    }

    const videoId = player.getVideoId();

    if (!videoId) {
      return;
    }

    const containerId = `youtube-player-${videoId}`;
    containerRef.current.id = containerId;
    const options = player.getOptions();
    const controller = WebYoutubePlayerController.createInstance();
    playerRef.current = controller;

    player[INTERNAL_SET_CONTROLLER_INSTANCE](playerRef.current);
    player[INTERNAL_UPDATE_PROGRESS_INTERVAL]();

    playerRef.current?.updateCallbacks({
      onReady: (playerInfo) => {
        player.emit('ready', playerInfo);
      },
      onStateChange: (state) => {
        player.emit('stateChange', state);
      },
      onError: (error) => {
        player.emit('error', error);
      },
      onPlaybackRateChange: (playbackRate) => {
        player.emit('playbackRateChange', playbackRate);
      },
      onPlaybackQualityChange: (playbackQuality) => {
        player.emit('playbackQualityChange', playbackQuality);
      },
      onAutoplayBlocked: () => {
        player.emit('autoplayBlocked', undefined);
      },
      onProgress: (progress) => {
        player.emit('progress', progress);
      },
    });

    playerRef.current?.createPlayer(containerId, {
      videoId,
      ...options,
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isInitialized, player]);

  return (
    <YoutubeViewWrapper width={width ?? screenWidth} height={height ?? 200} style={style}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          ...iframeStyle,
        }}
      />
    </YoutubeViewWrapper>
  );
}

export default YoutubeView;
