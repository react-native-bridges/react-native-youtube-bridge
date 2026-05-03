# React Native Youtube Bridge

> [English](./README.md) | 한국어

<div align="center">
  <img src="./assets/logo.png" width="300px" alt="React Native Youtube Bridge 로고" />
</div>


## 개요

React Native에서 YouTube 플레이어를 사용하려면 YouTube IFrame API, WebView 동작, 이벤트, 플랫폼 차이를 직접 연결해야 하는 경우가 많습니다.

`react-native-youtube-bridge`는 iOS, Android, Web에서 사용할 수 있는 타입 안전한 Hook 기반 YouTube 플레이어 라이브러리입니다.

<p align="center">
  <img src="./assets/example.gif" width="600" alt="react-native-youtube-bridge 데모" />
</p>

### 주요 특징

- 🎥 **YouTube IFrame Player API** - 네이티브 YouTube 모듈 대신 YouTube iframe player를 사용
- 🪝 **Hook 기반 API** - `useYouTubePlayer`로 플레이어를 만들고 `YoutubeView`로 렌더링
- 🔔 **타입 안전 이벤트** - `useYouTubeEvent`로 ready, state, progress, mute, error 이벤트 구독
- 🌐 **크로스 플랫폼** - iOS, Android, React Native Web 지원
- 🧩 **유연한 렌더링 모드** - 기본 inline HTML 또는 외부 WebView 플레이어 페이지 사용 가능
- 🧠 **TypeScript 지원** - 플레이어 메서드, 이벤트, source 입력, view props 타입 제공
- 🚀 **Expo 친화적** - Expo와 최신 React Native 프로젝트에서 사용하기 좋음

## 빠른 시작

### 📚 문서

전체 문서는 <https://react-native-youtube-bridge-docs.pages.dev/ko/>에서 확인할 수 있습니다.

- [시작하기](https://react-native-youtube-bridge-docs.pages.dev/ko/guide/getting-started/overview.html)
- [API 레퍼런스](https://react-native-youtube-bridge-docs.pages.dev/ko/guide/usage/api-reference.html)
- [1.x 문서](https://react-native-youtube-bridge-docs.pages.dev/1.x/ko/)
- [1.x에서 마이그레이션](https://react-native-youtube-bridge-docs.pages.dev/ko/guide/migration-from-1.x.html)

### 예제 및 데모

- [📁 예제 프로젝트](/example/) - 예제 React Native 앱
- [🌐 웹 데모](https://react-native-youtube-bridge-example.pages.dev/) - 호스팅된 데모
- [🤖 Expo Snack](https://snack.expo.dev/@harang/react-native-youtube-bridge) - Expo Snack에서 바로 체험

### 🤖 AI

- [llms.txt](https://react-native-youtube-bridge-docs.pages.dev/ko/llms.txt): 문서 페이지와 설명을 담은 구조화된 색인 파일입니다.
- [llms-full.txt](https://react-native-youtube-bridge-docs.pages.dev/ko/llms-full.txt): 전체 문서를 하나의 파일로 합친 전체 내용 파일입니다.

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

이벤트, 플레이어 제어, 렌더링 모드, WebView 커스터마이징, 마이그레이션은 [전체 문서](https://react-native-youtube-bridge-docs.pages.dev/ko/)를 참고하세요.

## 기여하기

프로젝트 기여 방법과 개발 환경 설정은 [기여 가이드](CONTRIBUTING.md)를 참고해 주세요.

## 라이선스

[MIT](./LICENSE)
