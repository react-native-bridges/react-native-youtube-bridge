# React Native Youtube Bridge

> [English](./README.md) | 한국어

## 개요
React Native에서 YouTube 플레이어를 사용하려면 복잡한 설정이 필요합니다.   
하지만 현재 지속적으로 유지보수되고 있는 React Native용 YouTube 플레이어 라이브러리가 없는 상황입니다. (가장 인기 있는 react-native-youtube-iframe의 [최근 릴리즈는 2023년 07월 02일](https://github.com/LonelyCpp/react-native-youtube-iframe/releases/tag/v2.3.0))   

`react-native-youtube-bridge`는 [YouTube iframe Player API](https://developers.google.com/youtube/iframe_api_reference)를 React Native에서 쉽게 사용할 수 있도록 도와주는 라이브러리입니다.   

- ✅ TypeScript 지원
- ✅ iOS, Android, Web 플랫폼 지원
- ✅ New Architecture 지원
- ✅ YouTube 네이티브 플레이어 모듈 없이도 사용 가능
- ✅ [YouTube iframe Player API](https://developers.google.com/youtube/iframe_api_reference) 전체 기능 지원
- ✅ 개발자 친화적인 API 제공
- ✅ Expo 지원

## 예제
> 빠른 시작을 원하신다면 [예제](/example/)를 확인해보세요.

- [웹 데모](https://react-native-youtube-bridge.pages.dev/)

## 설치

```bash
npm install react-native-youtube-bridge

pnpm add react-native-youtube-bridge

yarn add react-native-youtube-bridge

bun add react-native-youtube-bridge
```

## 사용법

```tsx
import { YoutubePlayer } from 'react-native-youtube-bridge';

function App() {
  return (
    <YoutubePlayer videoId={videoId} />
  )
}
```

### 이벤트
YouTube iframe API의 상태 변화를 애플리케이션에 전달하기 위해 [이벤트](https://developers.google.com/youtube/iframe_api_reference#Events)를 발생시킵니다. 콜백 함수를 통해 원하는 이벤트를 구독할 수 있습니다.   

> 주의 - 성능 최적화 및 비정상 동작 방지를 위해 콜백 함수는 `useCallback`으로 감싸주세요.

```tsx
function App() {
  const playerRef = useRef<PlayerControls>(null);

  const handleReady = useCallback(() => {
    console.log('플레이어 준비 완료!');
  }, []);

  const handleStateChange = useCallback((state: PlayerState) => {
    console.log('플레이어 상태 변경:', state);
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    console.log('재생 속도 변경:', rate);
  }, []);

  const handlePlaybackQualityChange = useCallback((quality: string) => {
    console.log('재생 품질 변경:', quality);
  }, []);

  const handleAutoplayBlocked = useCallback(() => {
    console.log('자동 재생이 차단되었습니다');
  }, []);

  const handleError = useCallback((error: YouTubeError) => {
    console.error('플레이어 오류:', error);
  }, []);

  return (
    <YoutubePlayer
      onReady={handleReady}
      onStateChange={handleStateChange}
      onError={handleError}
      onPlaybackRateChange={handlePlaybackRateChange}
      onPlaybackQualityChange={handlePlaybackQualityChange}
      onAutoplayBlocked={handleAutoplayBlocked}
    />
  )
}
```

### 기능
YouTube iframe API의 [함수들](https://developers.google.com/youtube/iframe_api_reference#Functions)을 `ref`를 통해 호출하여 음소거, 재생, 볼륨 조절 등 다양한 플레이어 기능을 제어할 수 있습니다.   

```tsx
function App() {
  const playerRef = useRef<PlayerControls>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const onPlay = useCallback(() => {
    if (isPlaying) {
      playerRef.current?.pause();
      return;
    }

    playerRef.current?.play();
  }, [isPlaying]);

  const seekTo = useCallback((time: number, allowSeekAhead: boolean) => {
    playerRef.current?.seekTo(time, allowSeekAhead);
  }, []);

  const stop = () => playerRef.current?.stop();

  return (
    <View>
      <YoutubePlayer
        ref={playerRef}
        videoId={videoId}
      />

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.seekButton]}
          onPress={() => seekTo(currentTime > 10 ? currentTime - 10 : 0)}
        >
          <Text style={styles.buttonText}>⏪ -10초</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.playButton]} onPress={onPlay}>
          <Text style={styles.buttonText}>{isPlaying ? '⏸️ 일시정지' : '▶️ 재생'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stop}>
          <Text style={styles.buttonText}>⏹️ 정지</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.seekButton]}
          onPress={() => seekTo(currentTime + 10, true)}
        >
          <Text style={styles.buttonText}>⏭️ +10초</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
```

### 플레이어 매개변수
YouTube 내장 플레이어의 [매개변수](https://developers.google.com/youtube/player_parameters#Parameters)를 설정하여 재생 환경을 맞춤화할 수 있습니다.

```tsx
function App() {
  return (
    <YoutubePlayer
      videoId={videoId}
      playerVars={{
        autoplay: true,
        controls: true,
        playsinline: true,
        rel: false,
        muted: true,
      }}
    />
  )
}
```

### 스타일
YouTube 플레이어의 스타일을 원하는 대로 커스터마이징할 수 있습니다.

```tsx
function App() {
  return (
    <YoutubePlayer
      ref={playerRef}
      videoId={videoId}
      height={400}
      width={200}
      onReady={handleReady}
      onStateChange={handleStateChange}
      onProgress={handleProgress}
      onError={handleError}
      onPlaybackRateChange={handlePlaybackRateChange}
      onPlaybackQualityChange={handlePlaybackQualityChange}
      onAutoplayBlocked={handleAutoplayBlocked}
      style={{
        borderRadius: 10,
      }}
      // 웹 플랫폼 지원
      iframeStyle={{
        aspectRatio: 16 / 9,
      }}
      // iOS, Android 플랫폼 지원
      webviewStyle={{
        // ...
      }}
      // iOS, Android 플랫폼 지원
      webviewProps={{
        // ...
      }}
    />
  )
}
```

### 유용한 기능

#### 재생 진행률 추적
- `progressInterval`이 설정된 경우, 해당 간격(ms)마다 `onProgress` 콜백이 호출됩니다.
- `progressInterval`이 `undefined`이거나 `0` 또는 `null`인 경우, `onProgress` 콜백은 호출되지 않습니다.

```tsx
function App() {
  const handleProgress = useCallback((progress: ProgressData) => {
    setCurrentTime(progress.currentTime);
    setDuration(progress.duration);
    setLoadedFraction(progress.loadedFraction);
  }, []);

  return (
    <YoutubePlayer
      videoId={videoId}
      progressInterval={1000}
      onProgress={handleProgress}
    />
  )
}
```

## 기여하기

리포지토리 기여 방법과 개발 워크플로우를 알아보려면 [기여 가이드](CONTRIBUTING.md)를 참고하세요.

## 라이선스

[MIT](./LICENSE)
