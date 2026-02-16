# React Native Youtube Bridge

> [English](./README.md) | 한국어

> [!note]
> **V1 사용자:** [V1 문서](/packages/react-native-youtube-bridge/docs/v1.md) | [V2 마이그레이션 가이드](/packages/react-native-youtube-bridge/docs/migration-v2.md)

## 개요

React Native에서 YouTube 플레이어를 사용하려면 복잡한 설정이 필요합니다.  
하지만 현재 지속적으로 유지보수되고 있는 React Native용 YouTube 플레이어 라이브러리가 없는 상황입니다. (가장 인기 있는 react-native-youtube-iframe의 [최근 릴리즈는 2023년 07월 02일](https://github.com/LonelyCpp/react-native-youtube-iframe/releases/tag/v2.3.0))

`react-native-youtube-bridge`는 [YouTube iframe Player API](https://developers.google.com/youtube/iframe_api_reference)를 React Native에서 쉽게 사용할 수 있도록 도와주는 라이브러리입니다.

- ✅ TypeScript 지원
- ✅ iOS, Android, Web 플랫폼 지원
- ✅ New Architecture 지원
- ✅ YouTube 네이티브 플레이어 모듈 없이도 사용 가능
- ✅ 다양한 [YouTube iframe Player API](https://developers.google.com/youtube/iframe_api_reference) 기능 지원
- ✅ 다중 인스턴스 지원 - 여러 플레이어를 독립적으로 관리 가능
- ✅ Expo의 접근 방식과 매우 유사한 직관적이고 사용하기 쉬운 Hook 기반 API 제공
- ✅ Expo 지원
- ✅ 유연한 렌더링 모드 (인라인 HTML & 웹뷰)

## 예제

> 빠른 시작을 원하신다면 [예제](/example/)를 확인해보세요.

- [웹 데모](https://react-native-youtube-bridge-example.pages.dev/)
- [Expo Go](https://snack.expo.dev/@harang/react-native-youtube-bridge)

<p align="center">
  <img src="https://raw.githubusercontent.com/react-native-bridges/react-native-youtube-bridge/main/assets/example.gif" width="600" />
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
import { YoutubeView, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const videoIdOrUrl = 'AbZH7XWDW_k';

  // OR useYouTubePlayer({ videoId: 'AbZH7XWDW_k' })
  // OR useYouTubePlayer({ url: 'https://youtube.com/watch?v=AbZH7XWDW_k' })
  const player = useYouTubePlayer(videoIdOrUrl);

  return <YoutubeView player={player} />;
}
```

### 이벤트

YouTube iframe API의 상태 변화를 애플리케이션에 전달하기 위해 [이벤트](https://developers.google.com/youtube/iframe_api_reference#Events)를 발생시킵니다.

`useYouTubeEvent` hook을 사용하여 완벽한 타입 추론을 지원하며, 두 가지 방법으로 이벤트를 쉽게 감지하여 사용할 수 있습니다.

```tsx
import { YoutubeView, useYouTubeEvent, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const player = useYouTubePlayer(videoIdOrUrl);

  const playbackRate = useYouTubeEvent(player, 'playbackRateChange', 1);
  const progress = useYouTubeEvent(player, 'progress', progressInterval);

  useYouTubeEvent(player, 'ready', (playerInfo) => {
    console.log('Player is ready!');
    Alert.alert('Alert', 'YouTube player is ready!');
  });

  useYouTubeEvent(player, 'autoplayBlocked', () => {
    console.log('Autoplay was blocked');
  });

  useYouTubeEvent(player, 'error', (error) => {
    console.error('Player error:', error);
    Alert.alert('Error', `Player error (${error.code}): ${error.message}`);
  });

  return <YoutubeView player={player} />;
}
```

`useYouTubeEvent` hook은 callback으로 값을 전달받는 방식과 state로 값을 바로 사용할 수 있는 두 가지 방법을 제공합니다.

1. Callback 방식: 의존성에 따라 리렌더링이 필요한 경우 4번째 인자에 dependency array를 주입해주면 됩니다.
2. State 방식:
   1. `progress` event의 경우 3번째 인자에 interval 값을 설정할 수 있습니다. (기본값: 1000ms)
   2. 나머지 event의 경우 3번째 인자에 기본 값을 설정할 수 있습니다.

### 기능

YouTube iframe API의 [함수들](https://developers.google.com/youtube/iframe_api_reference#Functions)을 `useYouTubePlayer`를 통해 반환된 player 인스턴스 메서드를 호출하여 음소거, 재생, 볼륨 조절 등 다양한 플레이어 기능을 제어할 수 있습니다.

```tsx
import { YoutubeView, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const player = useYouTubePlayer(videoIdOrUrl);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const onPlay = useCallback(() => {
    if (isPlaying) {
      player.pause();
      return;
    }

    player.play();
  }, [isPlaying]);

  const seekTo = (time: number, allowSeekAhead: boolean) => {
    player.seekTo(time, allowSeekAhead);
  };

  const stop = () => player.stop();

  return (
    <View>
      <YoutubeView player={player} />

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
  );
}
```

### 초기 플레이어 매개변수

YouTube 내장 플레이어의 [매개변수](https://developers.google.com/youtube/player_parameters#Parameters)를 설정하여 초기 재생 환경을 맞춤화할 수 있습니다.

```tsx
import { YoutubeView, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const player = useYouTubePlayer(videoIdOrUrl, {
    autoplay: true,
    controls: true,
    playsinline: true,
    rel: false,
    muted: true,
  });

  return <YoutubeView player={player} />;
}
```

### 스타일

YouTube 플레이어의 스타일을 원하는 대로 커스터마이징할 수 있습니다.

```tsx
function App() {
  return (
    <YoutubeView
      player={player}
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
      webViewStyle={
        {
          // ...
        }
      }
      // iOS, Android 플랫폼 지원
      webViewProps={
        {
          // ...
        }
      }
    />
  );
}
```

### 재생 진행률 추적

- `useYouTubeEvent` hook을 사용하여 `progress` 이벤트의 리스너를 등록하여 재생 진행률을 추적할 수 있습니다.
- 세 번째 인자에 interval 값을 설정하여 해당 간격(ms)마다 이벤트가 호출됩니다.
- interval을 원치 않으면 `0`으로 설정하면 됩니다.
- 기본값은 1000ms입니다.

```tsx
function App() {
  const progressInterval = 1000;

  const player = useYouTubePlayer(videoIdOrUrl);
  const progress = useYouTubeEvent(player, 'progress', progressInterval);

  return <YoutubeView player={player} />;
}
```

### 플레이어 렌더링 및 소스 설정 (ios, android)

**인라인 HTML vs 웹뷰 모드**  
YouTube 플레이어 렌더링 방식을 제어하고 호환성을 위한 소스 URL을 설정합니다.

1. **인라인 HTML 모드** (`useInlineHtml: true`)는 앱 내에서 직접 HTML을 로드하여 플레이어를 렌더링합니다. (default)
2. **웹뷰 모드** (`useInlineHtml: false`)는 외부 플레이어 페이지를 로드합니다.
   - 기본 URI는 https://react-native-youtube-bridge.pages.dev 입니다.
   - 직접 제작한 커스텀 플레이어 페이지를 외부 웹뷰로 사용하려면, `@react-native-youtube-bridge/web`으로 플레이어를 구축한 후 `webViewUrl`에 해당 URL을 설정하세요. 자세한 구현 방법은 [웹 플레이어 가이드](https://github.com/react-native-bridges/react-native-youtube-bridge/tree/main/packages/web)를 참고해 주세요.

> [!NOTE]
> **webViewUrl 활용법**
>
> - `useInlineHtml: true`인 경우: WebView source의 HTML `baseUrl`로 설정됩니다.
> - `useInlineHtml: false`인 경우: WebView source의 `uri`를 override합니다.
>
> **임베드 제한 해결**: 인라인 HTML 사용 시 YouTube iframe에서 `embed not allowed` 오류가 발생하여 영상이 정상적으로 로드되지 않는다면, 웹뷰 모드로 전환하여 외부 플레이어를 통해 YouTube iframe을 로드해주세요.

```tsx
// 인라인 HTML (default)
<YoutubeView
  player={player}
  useInlineHtml
/>

// 커스텀 플레이어 페이지를 사용한 외부 웹뷰
<YoutubeView
  player={player}
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

> 자세한 내용은 [웹 플레이어 가이드](https://github.com/react-native-bridges/react-native-youtube-bridge/tree/main/packages/web)를 참고해 주세요.

### YouTube oEmbed API

`useYoutubeOEmbed` 훅을 통해 YouTube 비디오의 메타데이터를 가져올 수 있습니다.  
이 훅은 YouTube URL만 지원합니다.

```tsx
import { useYoutubeOEmbed } from 'react-native-youtube-bridge';

function App() {
  const { oEmbed, isLoading, error } = useYoutubeOEmbed(
    'https://www.youtube.com/watch?v=AbZH7XWDW_k',
  );

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
  );
}
```

## 기여하기

리포지토리 기여 방법과 개발 워크플로우를 알아보려면 [기여 가이드](/CONTRIBUTING.md)를 참고하세요.

## 라이선스

[MIT](./LICENSE)
