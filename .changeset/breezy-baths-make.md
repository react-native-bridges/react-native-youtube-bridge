---
"@react-native-youtube-bridge/core": patch
"@react-native-youtube-bridge/react": patch
"react-native-youtube-bridge": patch
"@react-native-youtube-bridge/web": patch
---

fix: migrate from bun to pnpm to resolve workspace dependency resolution issues
- Bun changeset publish fails to resolve workspace dependencies
- Migrated from bun to pnpm for stable monorepo workflow
- Updated CI/CD configurations for pnpm compatibility
