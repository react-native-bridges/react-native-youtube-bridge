import { useCallback } from 'react';
import { type YoutubePlayerVars, escapeHtml, safeNumber, validateVideoId } from '@react-native-youtube-bridge/core';

import { youtubeIframeScripts } from './youtubeIframeScripts';

const useCreateLocalPlayerHtml = ({
  videoId,
  origin,
  startTime,
  endTime,
  autoplay,
  controls,
  loop,
  muted,
  playsinline,
  rel,
  useInlineHtml,
}: YoutubePlayerVars & { videoId: string | null | undefined; useInlineHtml: boolean }) => {
  const createPlayerHTML = useCallback(() => {
    if (!useInlineHtml || videoId === undefined) {
      return '';
    }

    if (!validateVideoId(videoId)) {
      return '<html><body><div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: #fff;">Invalid YouTube ID</div></body></html>';
    }

    const safeOrigin = escapeHtml(origin);
    const safeStartTime = safeNumber(startTime);
    const safeEndTime = endTime ? safeNumber(endTime) : undefined;

    // NOTE - https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html
    return /* html */ `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            background-color: #000;
            overflow: hidden;
          }
          #player {
            width: 100%;
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <div id="player"></div>
        
        <script>
          (function() {
            'use strict';
            
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            tag.onerror = function() {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'error',
                  error: { code: -2, message: 'Failed to load YouTube API' }
                }));
              }
            };
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            var player;
            var progressInterval;
            var isDestroyed = false;

            function cleanup() {
              isDestroyed = true;
              if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
              }
            }

            // 페이지 언로드 시 cleanup
            window.addEventListener('beforeunload', cleanup);

            window.onYouTubeIframeAPIReady = function() {
              if (isDestroyed) {
                return;
              }
              
              try {
                player = new YT.Player('player', {
                  width: '100%',
                  height: '100%',
                  videoId: '${videoId}',
                  playerVars: {
                    autoplay: ${autoplay ? 1 : 0},
                    controls: ${controls ? 1 : 0},
                    loop: ${loop ? 1 : 0},
                    mute: ${muted ? 1 : 0},
                    start: ${safeStartTime},
                    ${safeEndTime ? `end: ${safeEndTime},` : ''}
                    playsinline: ${playsinline ? 1 : 0},
                    rel: ${rel ? 1 : 0},
                    ${safeOrigin ? `origin: '${safeOrigin}',` : ''}
                    enablejsapi: 1
                  },
                  events: {
                    'onReady': ${youtubeIframeScripts.onPlayerReady},
                    'onStateChange': ${youtubeIframeScripts.onPlayerStateChange},
                    'onError': ${youtubeIframeScripts.onPlayerError},
                    'onPlaybackRateChange': ${youtubeIframeScripts.onPlaybackRateChange},
                    'onPlaybackQualityChange': ${youtubeIframeScripts.onPlaybackQualityChange},
                    'onAutoplayBlocked': ${youtubeIframeScripts.onAutoplayBlocked}
                  }
                });
              } catch (error) {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'error',
                    error: { code: -3, message: 'Failed to create player: ' + error.message }
                  }));
                }
              }
            };

            ${youtubeIframeScripts.receiveMessage}
            ${youtubeIframeScripts.sendProgress}

            ${youtubeIframeScripts.startProgressTracking}
            ${youtubeIframeScripts.stopProgressTracking}

            window.playerCommands = {
              play: () => player && player.playVideo(),
              pause: () => player && player.pauseVideo(),
              stop: () => player && player.stopVideo(),
              seekTo: (seconds, allowSeekAhead) => {
                if (!player) {
                  return;
                }

                player.seekTo(seconds, allowSeekAhead !== false);
                
                setTimeout(() => {
                  sendProgress();
                }, 200);
              },
              
              setVolume: (volume) => player && player.setVolume(volume),
              getVolume: () => player ? player.getVolume() : 0,
              mute: () => player && player.mute(),
              unMute: () => player && player.unMute(),
              isMuted: () => player ? player.isMuted() : false,
              
              getCurrentTime: () => player ? player.getCurrentTime() : 0,
              getDuration: () => player ? player.getDuration() : 0,
              getVideoUrl: () => player ? player.getVideoUrl() : '',
              getVideoEmbedCode: () => player ? player.getVideoEmbedCode() : '',
              
              getPlaybackRate: () => player ? player.getPlaybackRate() : 1,
              setPlaybackRate: (rate) => player && player.setPlaybackRate(rate),
              getAvailablePlaybackRates: () => player ? player.getAvailablePlaybackRates() : [1],
              
              getPlayerState: () => player ? player.getPlayerState() : -1,
              getVideoLoadedFraction: () => player ? player.getVideoLoadedFraction() : 0,
              
              loadVideoById: (videoId, startSeconds, endSeconds) => {
                if (player) {
                  const options = { videoId };
                  if (startSeconds !== undefined) options.startSeconds = startSeconds;
                  if (endSeconds !== undefined) options.endSeconds = endSeconds;
                  player.loadVideoById(options);
                }
              },
              cueVideoById: (videoId, startSeconds, endSeconds) => {
                if (player) {
                  const options = { videoId };
                  if (startSeconds !== undefined) options.startSeconds = startSeconds;
                  if (endSeconds !== undefined) options.endSeconds = endSeconds;
                  player.cueVideoById(options);
                }
              },
              
              setSize: (width, height) => player && player.setSize(width, height),
              updateProgressInterval: (newInterval) => {
                const interval = Number(newInterval) > 0 ? Number(newInterval) : null;

                window.currentInterval = interval;
                
                if (progressInterval) {
                  clearInterval(progressInterval);
                  progressInterval = null;
                }
                
                if (interval && player && player.getPlayerState() === YT.PlayerState.PLAYING) {
                  startProgressTracking();
                }
              },
              cleanup: cleanup,
            };
          })();
        </script>
      </body>
    </html>
  `;
  }, [videoId, origin, startTime, endTime, autoplay, controls, loop, muted, playsinline, rel, useInlineHtml]);

  return createPlayerHTML;
};

export default useCreateLocalPlayerHtml;
