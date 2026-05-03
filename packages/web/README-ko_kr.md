# React Native Youtube Bridge Web

> [English](./README.md) | 한국어

> [!note]
> 전체 문서는 <https://react-native-youtube-bridge-docs.pages.dev/ko>에서 확인할 수 있습니다.

[`react-native-youtube-bridge`](https://github.com/react-native-bridges/react-native-youtube-bridge)와 함께 사용할 외부 WebView 플레이어 페이지를 호스팅하기 위한 패키지입니다.

## 개요

직접 외부 플레이어 페이지를 호스팅하고, 메인 라이브러리의 `YoutubeView`에 `webViewUrl`로 전달하고 싶을 때만 이 패키지를 사용하면 됩니다.

React Native 앱에서는 계속 `react-native-youtube-bridge`를 사용합니다.

```tsx
import { YoutubeView, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const player = useYouTubePlayer('AbZH7XWDW_k');

  return <YoutubeView player={player} useInlineHtml={false} webViewUrl="https://your-custom-player.com" />;
}
```

호스팅되는 페이지에서는 `@react-native-youtube-bridge/web`를 사용합니다.

```tsx
import { YoutubePlayer } from '@react-native-youtube-bridge/web';

function CustomPlayerPage() {
  return <YoutubePlayer />;
}

export default CustomPlayerPage;
```

## Query string contract

`YoutubeView`가 호스팅된 페이지를 로드할 때 플레이어 설정을 URL query string으로 붙입니다. 기본 `YoutubePlayer` 컴포넌트는 아래 값을 자동으로 읽습니다.

- `videoId`
- `startTime`
- `endTime`
- `origin`
- `autoplay`
- `controls`
- `loop`
- `muted`
- `playsinline`
- `rel`

## 설치

```bash
npm install @react-native-youtube-bridge/web
```

## 언제 사용하면 좋은가요?

- 직접 호스팅해야 하는 요구사항이 있을 때
- iframe origin을 세밀하게 맞춰야 할 때
- inline HTML 모드 대신 외부 WebView 페이지가 필요한 호환성 이슈가 있을 때

## 기여

프로젝트 기여 방법과 개발 워크플로우는 [Contributing Guide](./CONTRIBUTING.md)를 참고하세요.

## 라이선스

[MIT](./LICENSE)
