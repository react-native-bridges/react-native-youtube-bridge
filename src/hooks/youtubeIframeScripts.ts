const startProgressTracking = /* js */ `
  function startProgressTracking() {
    if (isDestroyed || typeof window.currentInterval !== 'number' || window.currentInterval <= 0) {
      return;
    }
    
    if (progressInterval) {
      clearInterval(progressInterval);
    }

    progressInterval = setInterval(() => {
      if (isDestroyed || !player || !player.getCurrentTime) {
        stopProgressTracking();
        return;
      }
      
      try {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
        const loadedFraction = player.getVideoLoadedFraction();
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'progress',
          currentTime,
          duration,
          percentage,
          loadedFraction,
        }));
      } catch (error) {
        console.error('Progress tracking error:', error);
        stopProgressTracking();
      }
    }, window.currentInterval);
  }
`;

const stopProgressTracking = /* js */ `
  function stopProgressTracking() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }
`;

const onPlayerReady = /* js */ `
  function onPlayerReady(event) {
    if (isDestroyed) {
      return;
    }
    
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'ready',
        playerInfo: event.target.playerInfo
      }));
      startProgressTracking();
    } catch (error) {
      console.error('onPlayerReady error:', error);
    }
  }
`;

const onPlayerStateChange = /* js */ `
  function onPlayerStateChange(event) {
    if (isDestroyed) {
      return;
    }
    
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'stateChange',
        state: event.data
      }));

      if (event.data === YT.PlayerState.PLAYING) {
        startProgressTracking();
      } else {
        stopProgressTracking();
      }
    } catch (error) {
      console.error('onPlayerStateChange error:', error);
    }
  }
`;

const onPlayerError = /* js */ `
  function onPlayerError(event) {
    if (isDestroyed) {
      return;
    }
    
    var errorMessages = {
      2: 'INVALID_PARAMETER_VALUE',
      5: 'HTML5_PLAYER_ERROR',
      100: 'VIDEO_NOT_FOUND_OR_PRIVATE',
      101: 'EMBEDDED_PLAYBACK_NOT_ALLOWED',
      150: 'EMBEDDED_PLAYBACK_NOT_ALLOWED_SAME_AS_101'
    };
    
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'error',
        error: {
          code: event.data,
          message: errorMessages[event.data] || 'Unknown error: ' + event.data
        }
      }));
    } catch (error) {
      console.error('onPlayerError error:', error);
    }
  }
`;

const onPlaybackRateChange = /* js */ `
  function onPlaybackRateChange(event) {
    if (isDestroyed) {
      return;
    }
    
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'playbackRateChange',
        playbackRate: event.data
      }));
    } catch (error) {
      console.error('onPlaybackRateChange error:', error);
    }
  }
`;

const onPlaybackQualityChange = /* js */ `
  function onPlaybackQualityChange(event) {
    if (isDestroyed) {
      return;
    }
    
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'playbackQualityChange',
        quality: event.data
      }));
    } catch (error) {
      console.error('onPlaybackQualityChange error:', error);
    }
  }
`;

const onAutoplayBlocked = /* js */ `
  function onAutoplayBlocked(event) {
    if (isDestroyed) {
      return;
    }
    
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'autoplayBlocked'
      }));
    } catch (error) {
      console.error('onAutoplayBlocked error:', error);
    }
  }
`;

const receiveMessage = /* js */ `
  window.__execCommand = function(commandData) {
    if (isDestroyed) {
      return;
    }

    try {
      const { command, args = [], id } = commandData;
      
      if (window.playerCommands && typeof window.playerCommands[command] === 'function') {
        const result = window.playerCommands[command](...args);
        
        if (result instanceof Promise) {
          return result
            .then(r =>
              id &&
              window.ReactNativeWebView?.postMessage(
                JSON.stringify({ type: 'commandResult', id, result: r })
              )
            )
            .catch(err =>
              id &&
              window.ReactNativeWebView?.postMessage(
                JSON.stringify({
                  type: 'error',
                  id,
                  error: { code: -5, message: err?.message || String(err) }
                })
              )
            );
        }

        if (id && window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'commandResult',
            id: id,
            result: result
          }));
        }
        
        return result;
      } else {
        if (id && window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            id: id,
            error: { code: -4, message: 'Command not found: ' + command }
          }));
        }
      }
    } catch (error) {
      if (commandData.id && window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'error',
          id: commandData.id,
          error: { code: -5, message: 'Execution failed: ' + error.message }
        }));
      }
    }
  };
`;

export const youtubeIframeScripts = {
  startProgressTracking,
  stopProgressTracking,
  receiveMessage,
  onPlayerReady,
  onPlayerStateChange,
  onPlayerError,
  onPlaybackRateChange,
  onPlaybackQualityChange,
  onAutoplayBlocked,
};
