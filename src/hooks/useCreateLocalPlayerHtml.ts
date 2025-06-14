import { useCallback } from 'react';
import type { YoutubePlayerVars } from '@/types/youtube';
import { escapeHtml, safeNumber, validateVideoId } from '@/utils/validate';
import { youtubeIframeScripts } from '@/hooks/youtubeIframeScripts';

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
  modestbranding,
}: YoutubePlayerVars & { videoId: string }) => {
  const createPlayerHTML = useCallback(() => {
    if (!validateVideoId(videoId)) {
      console.error('Invalid YouTube video ID:', videoId);
      return '<html><body><div>Invalid video ID</div></body></html>';
    }

    const safeVideoId = escapeHtml(videoId);
    const safeOrigin = escapeHtml(origin);
    const safeStartTime = safeNumber(startTime);
    const safeEndTime = endTime ? safeNumber(endTime) : undefined;

    return `
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
              if (isDestroyed) return;
              
              try {
                player = new YT.Player('player', {
                  width: '100%',
                  height: '100%',
                  videoId: '${safeVideoId}',
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
                    modestbranding: ${modestbranding ? 1 : 0},
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

            ${youtubeIframeScripts.startProgressTracking}
            ${youtubeIframeScripts.stopProgressTracking}

            window.playerCommands = {
              play: () => player && player.playVideo(),
              pause: () => player && player.pauseVideo(),
              stop: () => player && player.stopVideo(),
              seekTo: (seconds, allowSeekAhead) => player && player.seekTo(seconds, allowSeekAhead !== false),
              
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
              
              cleanup: cleanup
            };

            window.addEventListener('message', function(event) {
              if (isDestroyed) return;
              
              try {
                const message = JSON.parse(event.data);
                if (window.playerCommands[message.command]) {
                  const result = window.playerCommands[message.command](...(message.args || []));
                  if (message.id && window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'commandResult',
                      id: message.id,
                      result: result
                    }));
                  }
                }
              } catch (error) {
                console.error('Error processing message:', error);
              }
            });
          })();
        </script>
      </body>
    </html>
  `;
  }, [videoId, origin, startTime, endTime, autoplay, controls, loop, muted, playsinline, rel, modestbranding]);

  return createPlayerHTML;
};

export default useCreateLocalPlayerHtml;
