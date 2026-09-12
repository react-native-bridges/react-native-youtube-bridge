# Dependency compatibility decisions

The September 2026 update uses Expo 57 / React Native 0.86.3. Native development
dependencies and the example use React 19.2.3 and WebView 13.16.1. The independent
documentation and external player apps use React / React DOM 19.2.8.

TypeScript stays at 5.9.3 and Babel at 7.29.7. Expo CLI recommends TypeScript 6.0.3,
so the example explicitly excludes only TypeScript from `expo install` version
checks. This is an intentional tooling exception, not an assertion that the
project uses every Expo-recommended version. The example is separately typechecked
and exported for iOS, Android and Web. Remove this exception when migrating the
TypeScript configuration, declaration output paths and MDX tooling together.

Oxlint split the previously disabled `react/react-compiler` rule into individual
rules. The existing refs, state-in-effect and dependency diagnostics remain disabled
in the new rule names; changing hook behavior is outside this dependency update.
Other lint checks remain enabled. These compiler diagnostics need a separate
behavioral review before enabling them.

`pnpm test:packages` packs all four public packages, checks exported files and
workspace dependency replacement, typechecks a consumer and checks core/react
ESM and CommonJS loading. The consumer check uses `skipLibCheck` for third-party
React Native declarations; it is not a full minimum-supported-version matrix.
The separate Web consumer uses `skipLibCheck: false` and
`noUncheckedSideEffectImports: true`. Web declarations are bundled with the
existing tsdown catalog dependency so private CSS imports do not leak into them.

CI also checks the example bundles, native release bundling and the external
player in `web/`, which uses its own Bun lockfile. The example explicitly declares
and resolves `babel-preset-expo`: relying on Expo's transitive copy failed during
Gradle release bundling, despite the regular Expo export passing.

After validating that baseline, Changesets CLI was upgraded to 3.0.2 with
changelog-github 1.0.1 and Bun to 1.4.2. Changesets uses its v4 configuration schema
and the existing Oxfmt formatter. An isolated local clone verified a web-only patch
release, changelog generation and consumption of the changeset. A second `version`
command correctly exited with code 1 when no unreleased changesets remained.
The final release plan also includes a shared toolchain changeset for all four
public packages. Each receives one patch increment; Web's declaration fix and
toolchain changes are combined into the same patch release.
GitHub API enrichment, OIDC publishing and the hosted release action were not run.
Bun 1.4.2 passed frozen-lockfile installation, typechecking and the Vite build using
the external app's existing lockfile format.

## Additional verification on September 13, 2026

- A temporary copy without node_modules or build output passed frozen pnpm/Bun
  installation, package/documentation builds, typechecking, lint, format and tests.
- The stricter Web consumer initially reproduced a missing CSS declaration error;
  bundled declarations fixed it and the regression check now passes.
- Android debug and release APKs built with RN 0.86.3 / WebView 13.16.1. The release
  APK installed and displayed the example on the emulator. Actual Android playback
  remains unverified: the emulator could not resolve www.youtube.com (UnknownHostException).
- An iOS Release simulator build succeeded with Xcode 26.6. The installed app
  displayed a playing YouTube video and its ready-event alert on the iPhone 17
  simulator. CocoaPods' stalled Maven download was retried against the alternate
  official Maven Central endpoint using ENTERPRISE_REPOSITORY only in the test shell.
- A headless browser loaded the external player without page exceptions and
  created the real YouTube iframe. A separate mock-YouTube test verified ready,
  play/pause, volume and unmute messages; it does not prove live external playback.
- App Store/device signing, production publishing, Android live playback and the
  full advertised minimum peer-version matrix are not covered by these checks.
