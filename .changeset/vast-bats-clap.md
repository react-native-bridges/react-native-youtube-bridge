---
"react-native-youtube-bridge": patch
---

fix(types): preserve TSDoc in YoutubePlayer component props

- Add explicit type annotation to maintain interface reference
- Fix Go to Definition to navigate to YoutubePlayerProps interface
- Ensure IntelliSense displays JSDoc comments for component props
- Prevent TypeScript compiler from inlining props type definition
