import { useRef, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  type PlayerControls,
  PlayerState,
  type ProgressData,
  type YouTubeError,
  YoutubePlayer,
} from 'react-native-youtube-bridge';

function App() {
  const playerRef = useRef<PlayerControls>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadedFraction, setLoadedFraction] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [availableRates, setAvailableRates] = useState<number[]>([1]);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [videoId, setVideoId] = useState('AbZH7XWDW_k');

  const handleReady = async () => {
    console.log('Player is ready!');
    Alert.alert('알림', 'YouTube 플레이어가 준비되었습니다!');

    // 플레이어 준비 완료 후 정보 가져오기
    try {
      const rates = await playerRef.current?.getAvailablePlaybackRates();
      const vol = await playerRef.current?.getVolume();
      const muted = await playerRef.current?.isMuted();

      if (rates) setAvailableRates(rates);
      if (vol !== undefined) setVolume(vol);
      if (muted !== undefined) setIsMuted(muted);
    } catch (error) {
      console.error('Error getting player info:', error);
    }
  };

  const handleStateChange = (state: PlayerState) => {
    console.log('Player state changed:', state);
    setIsPlaying(state === PlayerState.PLAYING);

    switch (state) {
      case PlayerState.UNSTARTED:
        console.log('플레이어가 시작되지 않음');
        break;
      case PlayerState.PLAYING:
        console.log('비디오가 재생 중입니다');
        break;
      case PlayerState.PAUSED:
        console.log('비디오가 일시정지되었습니다');
        break;
      case PlayerState.BUFFERING:
        console.log('비디오가 버퍼링 중입니다');
        break;
      case PlayerState.ENDED:
        console.log('비디오 재생이 완료되었습니다');
        break;
      case PlayerState.CUED:
        console.log('비디오가 큐에 준비되었습니다');
        break;
    }
  };

  const handleProgress = (progress: ProgressData) => {
    setCurrentTime(progress.currentTime);
    setDuration(progress.duration);
    setLoadedFraction(progress.loadedFraction);
  };

  const handleError = (error: YouTubeError) => {
    console.error('Player error:', error);
    Alert.alert('에러', `플레이어 오류 (${error.code}): ${error.message}`);
  };

  const handlePlaybackRateChange = (rate: number) => {
    console.log('Playback rate changed:', rate);
    setPlaybackRate(rate);
  };

  const handlePlaybackQualityChange = (quality: string) => {
    console.log('Playback quality changed:', quality);
    Alert.alert('품질 변경', `재생 품질이 ${quality}로 변경되었습니다`);
  };

  const handleAutoplayBlocked = () => {
    console.log('Autoplay was blocked');
    Alert.alert('알림', '자동재생이 브라우저에 의해 차단되었습니다');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const changePlaybackRate = (rate: number) => {
    playerRef.current?.setPlaybackRate(rate);
  };

  const changeVolume = async (newVolume: number) => {
    playerRef.current?.setVolume(newVolume);
    setVolume(newVolume);
  };

  const toggleMute = async () => {
    if (isMuted) {
      playerRef.current?.unMute();
    } else {
      playerRef.current?.mute();
    }
    const muted = await playerRef.current?.isMuted();
    if (muted !== undefined) setIsMuted(muted);
  };

  const getPlayerInfo = async () => {
    try {
      const [currentTime, duration, url, _, state, loaded] = await Promise.all([
        playerRef.current?.getCurrentTime(),
        playerRef.current?.getDuration(),
        playerRef.current?.getVideoUrl(),
        playerRef.current?.getVideoEmbedCode(),
        playerRef.current?.getPlayerState(),
        playerRef.current?.getVideoLoadedFraction(),
      ]);

      Alert.alert(
        '플레이어 정보',
        `현재 시간: ${formatTime(currentTime || 0)}\n` +
          `총 길이: ${formatTime(duration || 0)}\n` +
          `상태: ${state}\n` +
          `로드된 비율: ${((loaded || 0) * 100).toFixed(1)}%\n` +
          `URL: ${url || 'N/A'}`,
      );
    } catch (error) {
      console.error('Error getting player info:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>YouTube IFrame API Player</Text>
          <Text style={styles.subtitle}>Video ID: {videoId}</Text>
          <Text style={styles.subtitle}>재생 속도: {playbackRate}x</Text>
        </View>

        <YoutubePlayer
          ref={playerRef}
          videoId={videoId}
          height={220}
          playerVars={{
            autoplay: true,
            controls: true,
            playsinline: true,
            rel: false,
            modestbranding: true,
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
          onProgress={handleProgress}
          onError={handleError}
          onPlaybackRateChange={handlePlaybackRateChange}
          onPlaybackQualityChange={handlePlaybackQualityChange}
          onAutoplayBlocked={handleAutoplayBlocked}
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
          <Text style={styles.bufferText}>버퍼: {(loadedFraction * 100).toFixed(1)}%</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, styles.playButton]}
            onPress={() => {
              if (isPlaying) {
                playerRef.current?.pause();
              } else {
                playerRef.current?.play();
              }
            }}
          >
            <Text style={styles.buttonText}>{isPlaying ? '⏸️ 일시정지' : '▶️ 재생'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={() => playerRef.current?.stop()}>
            <Text style={styles.buttonText}>⏹️ 정지</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.seekButton]}
            onPress={() => playerRef.current?.seekTo(currentTime + 10)}
          >
            <Text style={styles.buttonText}>⏭️ +10초</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.volumeSection}>
          <Text style={styles.sectionTitle}>볼륨 컨트롤</Text>
          <View style={styles.volumeControls}>
            <TouchableOpacity style={[styles.volumeButton, isMuted && styles.activeButton]} onPress={toggleMute}>
              <Text style={styles.buttonText}>{isMuted ? '🔇 음소거됨' : '🔊 음소거'}</Text>
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
          <Text style={styles.volumeText}>현재 볼륨: {volume}%</Text>
        </View>

        <View style={styles.speedSection}>
          <Text style={styles.sectionTitle}>재생 속도</Text>
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
            <Text style={styles.buttonText}>📊 플레이어 정보</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.videoSwitcher}>
          <Text style={styles.switcherTitle}>다른 비디오 테스트:</Text>
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
