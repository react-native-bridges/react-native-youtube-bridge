import { useEffect, useState } from 'react';
import useYouTubePlayer from '../../src/hooks/useYoutubePlayer';
import useYouTubeVideoId from '../../src/hooks/useYoutubeVideoId';
import './App.css';
import { useWebView } from './hooks/useWebView';

function App() {
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

  const [progressInterval, setProgressInterval] = useState<number>(0);

  const youtubeVideoId = useYouTubeVideoId(videoId);

  const { sendMessage, onMessage } = useWebView();

  const {
    containerRef,
    controls: playerControls,
    cleanup,
  } = useYouTubePlayer({
    videoId: youtubeVideoId,
    progressInterval,
    playerVars: {
      controls,
      autoplay,
      muted,
      playsinline,
      loop,
      rel,
      startTime: Number.isNaN(Number(startTime)) ? 0 : Number(startTime),
      endTime: Number.isNaN(Number(endTime)) ? undefined : Number(endTime),
    },
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
        currentTime: progress.currentTime,
        duration: progress.duration,
        percentage: progress.percentage,
        loadedFraction: progress.loadedFraction,
      });
    },
  });

  useEffect(() => {
    onMessage((message) => {
      console.log('message', message);

      if (message.command === 'updateProgressInterval') {
        const args = message.args || [];

        const interval = Number(args[0]) > 0 ? Number(args[0]) : 0;

        setProgressInterval(interval);
        return;
      }

      if (message.command === 'cleanup') {
        cleanup();
        return;
      }

      if (message.command in playerControls) {
        const command = playerControls[message.command];
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

          playerControls.setVolume(volume);
          return;
        }

        const result = (command as (...args: unknown[]) => unknown)(...args);

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
  }, [onMessage, playerControls, cleanup]);

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

export default App;
