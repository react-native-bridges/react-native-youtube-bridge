import { useEffect, useRef, useState } from 'react';

import { useYouTubeVideoId } from '@react-native-youtube-bridge/react';
import { WebYoutubePlayerController } from '@react-native-youtube-bridge/core';

import { useWebView } from './hooks/useWebView';

import './YoutubePlayer.css';

function YoutubePlayer() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('videoId') ?? '';
  const startTime = urlParams.get('startTime') ?? '0';
  const endTime = urlParams.get('endTime') ?? '';
  const autoplay = urlParams.get('autoplay') === 'true';
  const controls = urlParams.get('controls') === 'true';
  const loop = urlParams.get('loop') === 'true';
  const muted = urlParams.get('muted') === 'true';
  const playsinline = urlParams.get('playsinline') === 'true';
  const rel = urlParams.get('rel') === 'true';
  const origin = urlParams.get('origin') ?? '';

  const [isInitialized, setIsInitialized] = useState(false);

  const { sendMessage, onMessage } = useWebView();

  const youtubeVideoId = useYouTubeVideoId(videoId);

  const startTimeNumber = Number.isNaN(Number(startTime)) ? 0 : Number(startTime);
  const endTimeNumber = Number.isNaN(Number(endTime)) ? undefined : Number(endTime);

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<WebYoutubePlayerController | null>(null);

  useEffect(() => {
    WebYoutubePlayerController.initialize().then(() => {
      setIsInitialized(true);

      const controller = WebYoutubePlayerController.getInstance();
      playerRef.current = controller;
    });
  }, []);

  useEffect(() => {
    if (!isInitialized || !containerRef.current) {
      return;
    }

    const containerId = 'youtube-player-container';
    containerRef.current.id = containerId;

    playerRef.current?.updateCallbacks({
      onReady: (playerInfo) => {
        sendMessage({
          type: 'ready',
          playerInfo,
        });
      },
      onStateChange: (state) => {
        sendMessage({
          type: 'stateChange',
          state,
        });
      },
      onError: (error) => {
        sendMessage({
          type: 'error',
          error,
        });
      },
      onPlaybackRateChange: (playbackRate) => {
        sendMessage({
          type: 'playbackRateChange',
          playbackRate,
        });
      },
      onPlaybackQualityChange: (playbackQuality) => {
        sendMessage({
          type: 'playbackQualityChange',
          quality: playbackQuality,
        });
      },
      onAutoplayBlocked: () => {
        sendMessage({
          type: 'autoplayBlocked',
        });
      },
      onProgress: (progress) => {
        sendMessage({
          type: 'progress',
          progress,
        });
      },
    });

    playerRef.current?.createPlayer(containerId, {
      videoId: youtubeVideoId,
      playerVars: {
        origin,
        controls,
        autoplay,
        muted,
        playsinline,
        loop,
        rel,
        startTime: startTimeNumber,
        endTime: endTimeNumber,
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current?.destroy();
        playerRef.current = null;
      }
    };
  }, [
    sendMessage,
    isInitialized,
    youtubeVideoId,
    origin,
    controls,
    autoplay,
    muted,
    playsinline,
    loop,
    rel,
    startTimeNumber,
    endTimeNumber,
  ]);

  useEffect(() => {
    onMessage((message) => {
      if (message.command === 'updateProgressInterval') {
        const args = message.args || [];

        const interval = Number(args[0]) > 0 ? Number(args[0]) : 0;

        playerRef.current?.updateProgressInterval(interval);
        return;
      }

      if (!playerRef.current) {
        return;
      }

      if (message.command === 'cleanup') {
        playerRef.current?.destroy();
        playerRef.current = null;
        return;
      }

      if (message.command in playerRef.current) {
        const command = playerRef.current[message.command];
        const args = message.args || [];

        if (typeof command !== 'function') {
          if (message.id && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: 'error',
                id: message.id,
                error: { code: -4, message: `Command not found: ${message.command}` },
              }),
            );
          }
          return;
        }

        if (message.command === 'setVolume') {
          const volume = Number(args[0]);

          if (Number.isNaN(volume)) {
            return;
          }

          playerRef.current?.setVolume(volume);
          return;
        }

        const result = (command as (...args: unknown[]) => unknown).apply(playerRef.current, args);

        if (result instanceof Promise) {
          result
            .then((r) => {
              if (message.id && window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'commandResult',
                    id: message.id,
                    result: r,
                  }),
                );
              }
            })
            .catch((err) => {
              if (message.id && window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'error',
                    id: message.id,
                    error: { code: -5, message: err?.message || String(err) },
                  }),
                );
              }
            });
          return;
        }

        if (message.id && window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'commandResult',
              id: message.id,
              result,
            }),
          );
        }
      }
    });
  }, [onMessage]);

  return (
    <div id="player-container">
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}

export default YoutubePlayer;
