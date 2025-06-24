# React Native Youtube Bridge Web

> [English](./README.md) | 한국어

React Native 환경에서 [`react-native-youtube-bridge`](https://github.com/react-native-bridges/react-native-youtube-bridge)와 함께 사용할 수 있는 외부 웹뷰용 YouTube 플레이어 라이브러리입니다.

## 개요

이 라이브러리는 React Native 애플리케이션에서 YouTube 동영상을 재생할 때, 커스텀 웹 페이지를 통해 외부 웹뷰를 구현하고자 하는 경우에 유용합니다.

## 사용 사례

React Native 환경에서는 다음과 같은 두 가지 방법으로 YouTube iframe을 WebView에서 사용할 수 있습니다:

```tsx
function App() {
  return (
    <>
      {/* 방법 1: 인라인 HTML 사용 (기본값) */}
      <YoutubePlayer
        source={source}
        useInlineHtml
      />
      
      {/* 방법 2: 외부 웹뷰 페이지 사용 */}
      <YoutubePlayer
        source={source}
        useInlineHtml={false}
        // 기본값: https://react-native-youtube-bridge.pages.dev
        webViewUrl="https://your-custom-player.com"
      />
    </>
  )
}
```

현재는 기본 정적 사이트(https://react-native-youtube-bridge.pages.dev)를 외부 웹뷰 URL로 사용하고 있습니다.

만약 직접 제작한 커스텀 플레이어 페이지를 사용하고 싶다면, `webViewUrl` 속성에 해당 URL을 전달하면 됩니다. 이때 `@react-native-youtube-bridge/web`을 활용하여 React 기반의 커스텀 플레이어 페이지를 손쉽게 구축할 수 있습니다.

## 설치

```bash
# npm
npm install @react-native-youtube-bridge/web

# pnpm
pnpm add @react-native-youtube-bridge/web

# yarn
yarn add @react-native-youtube-bridge/web

# bun
bun add @react-native-youtube-bridge/web
```

## 사용법

```tsx
import { YoutubePlayer } from '@react-native-youtube-bridge/web';

function CustomPlayerPage() {
  return <YoutubePlayer />;
}

export default CustomPlayerPage;
```

## 기여하기

프로젝트 기여 방법과 개발 워크플로우에 대한 자세한 내용은 [기여 가이드](./CONTRIBUTING.md)를 참고해 주세요.

## 라이센스

[MIT](./LICENSE)
