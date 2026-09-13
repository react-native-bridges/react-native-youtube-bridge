---
'@react-native-youtube-bridge/core': patch
'@react-native-youtube-bridge/react': patch
'react-native-youtube-bridge': patch
'@react-native-youtube-bridge/web': patch
---

Update the build tooling used to publish the library packages, including tsdown, React Native Builder Bob, and Vite. Preserve the existing public APIs and peer dependency ranges.

Verify the updated packages with the Expo 57 / React Native 0.86.3 example, React 19.2.3, and React Native WebView 13.16.1. Add checks for packed entry points, consumer types, and native release bundling while retaining TypeScript 5.9.3 compatibility.
