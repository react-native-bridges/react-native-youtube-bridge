import type { ReactNativeWebView } from '../types/webview';

export const isWebViewAvailable = (window: Window): window is Window & { ReactNativeWebView: ReactNativeWebView } => {
  return (
    typeof window !== 'undefined' &&
    'ReactNativeWebView' in window &&
    window.ReactNativeWebView !== undefined &&
    window.ReactNativeWebView !== null
  );
};
