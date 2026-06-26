---
"@react-native-youtube-bridge/core": patch
"@react-native-youtube-bridge/react": patch
"@react-native-youtube-bridge/web": patch
"react-native-youtube-bridge": patch
---

Fix package entry metadata to match tsdown's `.cjs`, `.mjs`, and `.d.mts` outputs so Expo Snack and CommonJS resolvers can load the internal packages.
