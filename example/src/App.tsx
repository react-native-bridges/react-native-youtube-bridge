import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  PlayerState,
  YoutubeView,
  useYouTubeEvent,
  useYouTubePlayer,
  useYoutubeOEmbed,
} from 'react-native-youtube-bridge';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableRates, setAvailableRates] = useState<number[]>([1]);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [videoId, setVideoId] = useState('AbZH7XWDW_k');
  const [progressInterval, setProgressInterval] = useState(1000);
  const { oEmbed, isLoading, error } = useYoutubeOEmbed(`https://www.youtube.com/watch?v=${videoId}`);

  const player = useYouTubePlayer(videoId, {
    autoplay: true,
    controls: true,
    playsinline: true,
    rel: false,
    muted: true,
  });

  const changePlaybackRate = (rate: number) => {
    player.setPlaybackRate(rate);
  };

  const changeVolume = (newVolume: number) => {
    player.setVolume(newVolume);
    setVolume(newVolume);
  };

  const toggleMute = useCallback(() => {
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
      return;
    }

    player.mute();
    setIsMuted(true);
  }, [player, isMuted]);

  const onPlay = useCallback(() => {
    if (isPlaying) {
      player.pause();
      return;
    }

    player.play();
  }, [player, isPlaying]);

  const getPlayerInfo = async () => {
    const [currentTime, duration, url, state, loaded] = await Promise.all([
      player.getCurrentTime(),
      player.getDuration(),
      player.getVideoUrl(),
      player.getPlayerState(),
      player.getVideoLoadedFraction(),
    ]);

    console.log(
      `
        currentTime: ${currentTime}
        duration: ${duration}
        url: ${url}
        state: ${state}
        loaded: ${loaded}
        `,
    );

    Alert.alert(
      'Player info',
      `Current time: ${formatTime(currentTime || 0)}\n` +
        `duration: ${formatTime(duration || 0)}\n` +
        `state: ${state}\n` +
        `loaded: ${((loaded || 0) * 100).toFixed(1)}%\n` +
        `url: ${url || 'N/A'}`,
    );
  };

  const playbackRate = useYouTubeEvent(player, 'playbackRateChange', 1);
  const playbackQuality = useYouTubeEvent(player, 'playbackQualityChange');
  const progress = useYouTubeEvent(player, 'progress', progressInterval);

  const currentTime = progress?.currentTime ?? 0;
  const duration = progress?.duration ?? 0;
  const loadedFraction = progress?.loadedFraction ?? 0;

  useYouTubeEvent(player, 'ready', (playerInfo) => {
    console.log('Player is ready!');
    Alert.alert('Alert', 'YouTube player is ready!');

    console.log('rates', playerInfo.availablePlaybackRates);
    console.log('vol', playerInfo.volume);
    console.log('muted', playerInfo.muted);

    if (playerInfo?.availablePlaybackRates) {
      setAvailableRates(playerInfo.availablePlaybackRates);
    }

    if (playerInfo?.volume !== undefined) {
      setVolume(playerInfo.volume);
    }

    if (playerInfo?.muted !== undefined) {
      setIsMuted(playerInfo.muted);
    }
  });

  useYouTubeEvent(player, 'stateChange', (state) => {
    console.log('Player state changed:', state);
    setIsPlaying(state === PlayerState.PLAYING);

    switch (state) {
      case PlayerState.UNSTARTED:
        console.log('Player is not started');
        break;
      case PlayerState.PLAYING:
        console.log('Video is playing');
        break;
      case PlayerState.PAUSED:
        console.log('Video is paused');
        break;
      case PlayerState.BUFFERING:
        console.log('Video is buffering');
        break;
      case PlayerState.ENDED:
        console.log('Video is ended');
        break;
      case PlayerState.CUED:
        console.log('Video is cued');
        break;
    }
  });

  useYouTubeEvent(player, 'autoplayBlocked', () => {
    console.log('Autoplay was blocked');
  });

  useYouTubeEvent(player, 'error', (error) => {
    console.error('Player error:', error);
    Alert.alert('Error', `Player error (${error.code}): ${error.message}`);
  });

  useEffect(() => {
    console.log('oEmbed', oEmbed, isLoading, error);
    console.log('playbackQuality', playbackQuality);
  }, [oEmbed, isLoading, error, playbackQuality]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>YouTube IFrame API Player</Text>
          <Text style={styles.subtitle}>Video ID: {videoId}</Text>
          <Text style={styles.subtitle}>Playback rate: {playbackRate}x</Text>
        </View>
        <YoutubeView
          useInlineHtml
          player={player}
          height={Platform.OS === 'web' ? 'auto' : undefined}
          webViewProps={{
            renderToHardwareTextureAndroid: true,
          }}
          style={{
            maxHeight: 400,
          }}
          iframeStyle={{
            aspectRatio: 16 / 9,
          }}
        />

        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                },
              ]}
            />
            <View style={[styles.bufferFill, { width: `${loadedFraction * 100}%` }]} />
          </View>
          <Text style={styles.bufferText}>Buffer: {(loadedFraction * 100).toFixed(1)}%</Text>
        </View>

        <View style={styles.progressContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: progressInterval === 0 ? '#9E9E9E' : '#4CAF50' }]}
            onPress={() => setProgressInterval(progressInterval === 0 ? 1000 : 0)}
          >
            <Text style={styles.buttonText}>{progressInterval}ms interval</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, styles.seekButton]}
            onPress={() => player.seekTo(currentTime > 10 ? currentTime - 10 : 0)}
          >
            <Text style={styles.buttonText}>⏪ -10s</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.playButton]} onPress={onPlay}>
            <Text style={styles.buttonText}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={() => player.stop()}>
            <Text style={styles.buttonText}>⏹️ Stop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.seekButton]}
            onPress={() => player.seekTo(currentTime + 10, true)}
          >
            <Text style={styles.buttonText}>⏭️ +10s</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.volumeSection}>
          <Text style={styles.sectionTitle}>Volume control</Text>
          <View style={styles.volumeControls}>
            <TouchableOpacity style={[styles.volumeButton, isMuted && styles.activeButton]} onPress={toggleMute}>
              <Text style={styles.buttonText}>{isMuted ? '🔇 Muted' : '🔊 Unmuted'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.volumeButton} onPress={() => changeVolume(25)}>
              <Text style={styles.buttonText}>25%</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.volumeButton} onPress={() => changeVolume(50)}>
              <Text style={styles.buttonText}>50%</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.volumeButton} onPress={() => changeVolume(100)}>
              <Text style={styles.buttonText}>100%</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.volumeText}>Current volume: {volume}%</Text>
        </View>

        <View style={styles.speedSection}>
          <Text style={styles.sectionTitle}>Playback rate</Text>
          <View style={styles.speedControls}>
            {availableRates.map((rate) => (
              <TouchableOpacity
                key={rate}
                style={[styles.speedButton, playbackRate === rate && styles.activeButton]}
                onPress={() => changePlaybackRate(rate)}
              >
                <Text style={styles.buttonText}>{rate}x</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoSection}>
          <TouchableOpacity style={[styles.button, styles.infoButton]} onPress={getPlayerInfo}>
            <Text style={styles.buttonText}>📊 Player info</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.videoSwitcher}>
          <Text style={styles.switcherTitle}>Test other videos:</Text>
          <View style={styles.videoButtons}>
            <TouchableOpacity
              style={[styles.videoButton, videoId === 'AbZH7XWDW_k' && styles.activeVideoButton]}
              onPress={() => setVideoId('AbZH7XWDW_k')}
            >
              <Text style={styles.videoButtonText}>INVU</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.videoButton, videoId === '9bZkp7q19f0' && styles.activeVideoButton]}
              onPress={() => setVideoId('9bZkp7q19f0')}
            >
              <Text style={styles.videoButtonText}>Gangnam Style</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.videoButton, videoId === 'fJ9rUzIMcZQ' && styles.activeVideoButton]}
              onPress={() => setVideoId('fJ9rUzIMcZQ')}
            >
              <Text style={styles.videoButtonText}>Bohemian Rhapsody</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.videoButton, videoId === 'jNQXAC9IVRw' && styles.activeVideoButton]}
              onPress={() => setVideoId('jNQXAC9IVRw')}
            >
              <Text style={styles.videoButtonText}>Me at the zoo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff0000',
    borderRadius: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  bufferFill: {
    height: '100%',
    backgroundColor: '#ffcccc',
    borderRadius: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  bufferText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  seekButton: {
    backgroundColor: '#2196F3',
  },
  infoButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  volumeSection: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  volumeControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  volumeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#9E9E9E',
    borderRadius: 6,
    minWidth: 60,
  },
  volumeText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  speedSection: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  speedControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  speedButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#607D8B',
    borderRadius: 6,
    marginBottom: 8,
    minWidth: 50,
  },
  activeButton: {
    backgroundColor: '#FF5722',
  },
  infoSection: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  videoSwitcher: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  switcherTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  videoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  videoButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FF9800',
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  activeVideoButton: {
    backgroundColor: '#E65100',
  },
  videoButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default App;
