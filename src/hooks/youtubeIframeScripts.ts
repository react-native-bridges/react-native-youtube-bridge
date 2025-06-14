const startProgressTracking = `
  function startProgressTracking() {
    if (isDestroyed) return;
    
    if (progressInterval) clearInterval(progressInterval);
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
          currentTime: currentTime,
          duration: duration,
          percentage: percentage,
          loadedFraction: loadedFraction
        }));
      } catch (error) {
        console.error('Progress tracking error:', error);
        stopProgressTracking();
      }
    }, 1000);
  }
`;

const stopProgressTracking = `
  function stopProgressTracking() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }
`;

const onPlayerReady = `
  function onPlayerReady(event) {
    if (isDestroyed) return;
    
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'ready',
        duration: player.getDuration(),
        availablePlaybackRates: player.getAvailablePlaybackRates()
      }));
      startProgressTracking();
    } catch (error) {
      console.error('onPlayerReady error:', error);
    }
  }
`;

const onPlayerStateChange = `
  function onPlayerStateChange(event) {
    if (isDestroyed) return;
    
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

const onPlayerError = `
  function onPlayerError(event) {
    if (isDestroyed) return;
    
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

const onPlaybackRateChange = `
  function onPlaybackRateChange(event) {
    if (isDestroyed) return;
    
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

const onPlaybackQualityChange = `
  function onPlaybackQualityChange(event) {
    if (isDestroyed) return;
    
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

const onAutoplayBlocked = `
  function onAutoplayBlocked(event) {
    if (isDestroyed) return;
    
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'autoplayBlocked'
      }));
    } catch (error) {
      console.error('onAutoplayBlocked error:', error);
    }
  }
`;

export const youtubeIframeScripts = {
  startProgressTracking,
  stopProgressTracking,
  onPlayerReady,
  onPlayerStateChange,
  onPlayerError,
  onPlaybackRateChange,
  onPlaybackQualityChange,
  onAutoplayBlocked,
};
