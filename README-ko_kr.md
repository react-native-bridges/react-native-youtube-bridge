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
- ✅ 다양한 [YouTube iframe Player API](https://developers.google.com/youtube/iframe_api_reference) 기능 지원
- ✅ 개발자 친화적인 API 제공
- ✅ Expo 지원
- ✅ 유연한 렌더링 모드 (인라인 HTML & 웹뷰)

## 예제
> 빠른 시작을 원하신다면 [예제](/example/)를 확인해보세요.

- [웹 데모](https://react-native-youtube-bridge-example.pages.dev/)
- [Expo Go](https://snack.expo.dev/@harang/react-native-youtube-bridge)

<p align="center">
  <img src="./assets/example.gif" width="600" />
</p>

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
    <YoutubePlayer 
      source={source} // youtube videoId or url
      // OR source={{ videoId: 'AbZH7XWDW_k' }}
      // OR source={{ url: 'https://youtube.com/watch?v=AbZH7XWDW_k' }}
    />
  )
}
```

### 이벤트
YouTube iframe API의 상태 변화를 애플리케이션에 전달하기 위해 [이벤트](https://developers.google.com/youtube/iframe_api_reference#Events)를 발생시킵니다. 콜백 함수를 통해 원하는 이벤트를 구독할 수 있습니다.   

> 🔔 Note - 성능 최적화 및 비정상 동작 방지를 위해 콜백 함수는 `useCallback`으로 감싸주세요.

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
        source={source}
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
      source={source}
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
      source={source}
      height={400}
      width={200}
      style={{
        borderRadius: 10,
      }}
      // 웹 플랫폼 지원
      iframeStyle={{
        aspectRatio: 16 / 9,
      }}
      // iOS, Android 플랫폼 지원
      webViewStyle={{
        // ...
      }}
      // iOS, Android 플랫폼 지원
      webViewProps={{
        // ...
      }}
    />
  )
}
```

### 재생 진행률 추적
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
      source={source}
      progressInterval={1000}
      onProgress={handleProgress}
    />
  )
}
```

### 플레이어 렌더링 및 소스 설정 (ios, android)

**인라인 HTML vs 웹뷰 모드**   
YouTube 플레이어 렌더링 방식을 제어하고 호환성을 위한 소스 URL을 설정합니다.

1. **인라인 HTML 모드** (`useInlineHtml: true`)는 앱 내에서 직접 HTML을 로드하여 플레이어를 렌더링합니다. (default)
2. **웹뷰 모드** (`useInlineHtml: false`)는 외부 플레이어 페이지를 로드합니다. 기본 URI는 https://react-native-youtube-bridge.pages.dev 입니다.

> [!NOTE]
> **webViewUrl 활용법**
> - `useInlineHtml: true`인 경우: WebView source의 HTML `baseUrl`로 설정됩니다.
> - `useInlineHtml: false`인 경우: WebView source의 `uri`를 override합니다.
>
> **임베드 제한 해결**: 인라인 HTML 사용 시 YouTube iframe에서 `embed not allowed` 오류가 발생하여 영상이 정상적으로 로드되지 않는다면, 웹뷰 모드로 전환하여 외부 플레이어를 통해 YouTube iframe을 로드해주세요.

```tsx
// 인라인 HTML (default)
<YoutubePlayer
  source={source}
  useInlineHtml
/>

// 커스텀 플레이어 페이지를 사용한 외부 웹뷰
<YoutubePlayer
  source={source}
  useInlineHtml={false}
  // default: https://react-native-youtube-bridge.pages.dev
  webViewUrl="https://your-custom-player.com"
/>
```

**커스텀 플레이어 페이지**

직접 제작한 커스텀 플레이어 페이지를 사용하려면, `@react-native-youtube-bridge/web`을 활용하여 React 기반의 플레이어 페이지를 구축할 수 있습니다.

```tsx
import { YoutubePlayer } from '@react-native-youtube-bridge/web';

function CustomPlayerPage() {
  return <YoutubePlayer />;
}

export default CustomPlayerPage;
```

> 자세한 내용은 [웹 플레이어 가이드](./packages/web/)를 참고해 주세요.

### YouTube oEmbed API
`useYoutubeOEmbed` 훅을 통해 YouTube 비디오의 메타데이터를 가져올 수 있습니다.   
이 훅은 YouTube URL만 지원합니다.

```tsx
import { useYoutubeOEmbed } from 'react-native-youtube-bridge';

function App() {
  const { oEmbed, isLoading, error } = useYoutubeOEmbed('https://www.youtube.com/watch?v=AbZH7XWDW_k');

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!oEmbed) return null;

  return (
    <>
      <Text>{oEmbed.title}</Text>
      <Image 
        source={{ uri: oEmbed?.thumbnail_url }} 
        style={{ width: oEmbed?.thumbnail_width, height: oEmbed?.thumbnail_height }} 
      />
    </>
  )
}
```

## 기여하기

리포지토리 기여 방법과 개발 워크플로우를 알아보려면 [기여 가이드](CONTRIBUTING.md)를 참고하세요.

## 라이선스

[MIT](./LICENSE)
