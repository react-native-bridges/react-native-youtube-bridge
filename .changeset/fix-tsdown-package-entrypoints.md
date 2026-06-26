---
"@react-native-youtube-bridge/core": patch
"@react-native-youtube-bridge/react": patch
---

Fix package entry metadata to match tsdown's `.cjs`, `.mjs`, `.d.cts`, and `.d.mts` outputs so Expo Snack and TypeScript CJS/ESM resolvers can load the internal packages.
