# React Native Youtube Bridge

> [English](./README.md) | 한국어

<div align="center">
  <img src="https://raw.githubusercontent.com/react-native-bridges/react-native-youtube-bridge/main/assets/logo.png" width="300px" alt="React Native Youtube Bridge 로고" />
</div>


## 개요

`react-native-youtube-bridge`는 iOS, Android, Web에서 사용할 수 있는 타입 안전한 Hook 기반 YouTube 플레이어 라이브러리입니다.

<p align="center">
  <img src="https://raw.githubusercontent.com/react-native-bridges/react-native-youtube-bridge/main/assets/example.gif" width="600" alt="react-native-youtube-bridge 데모" />
</p>

### 주요 특징

- 🎥 네이티브 YouTube 모듈 없이 YouTube IFrame Player API 사용
- 🪝 `useYouTubePlayer` + `YoutubeView` Hook 기반 API
- 🔔 `useYouTubeEvent`를 통한 타입 안전 이벤트
- 🌐 iOS, Android, React Native Web 지원
- 🧩 Inline HTML 및 외부 WebView 렌더링 모드
- 🧠 TypeScript 지원

## 빠른 시작

### 📚 문서

전체 문서는 <https://react-native-youtube-bridge-docs.pages.dev/ko/>에서 확인할 수 있습니다.

- [시작하기](https://react-native-youtube-bridge-docs.pages.dev/ko/guide/getting-started/overview.html)
- [API 레퍼런스](https://react-native-youtube-bridge-docs.pages.dev/ko/guide/usage/api-reference.html)
- [1.x 문서](https://react-native-youtube-bridge-docs.pages.dev/1.x/ko/)
- [1.x에서 마이그레이션](https://react-native-youtube-bridge-docs.pages.dev/ko/guide/migration-from-1.x.html)

### 예제 및 데모

- [📁 예제 프로젝트](https://github.com/react-native-bridges/react-native-youtube-bridge/tree/main/example)
- [🌐 웹 데모](https://react-native-youtube-bridge-example.pages.dev/)
- [🤖 Expo Snack](https://snack.expo.dev/@harang/react-native-youtube-bridge)

### 🤖 AI

- [llms.txt](https://react-native-youtube-bridge-docs.pages.dev/ko/llms.txt)
- [llms-full.txt](https://react-native-youtube-bridge-docs.pages.dev/ko/llms-full.txt)

### 설치

```bash
npm install react-native-youtube-bridge
```

### 기본 사용법

```tsx
import { YoutubeView, useYouTubePlayer } from 'react-native-youtube-bridge';

function App() {
  const player = useYouTubePlayer('AbZH7XWDW_k');

  return <YoutubeView player={player} />;
}
```

전체 가이드는 [문서](https://react-native-youtube-bridge-docs.pages.dev/ko/)를 참고하세요.

## 라이선스

[MIT](./LICENSE)
