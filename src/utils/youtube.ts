import type { YoutubePlayerVars } from '../types/youtube';
import { DEFAULT_EXTERNAL_WEB_URL } from './constants';

export const getYoutubeWebViewUrl = (
  videoId: string,
  useInlineHtml: boolean,
  playerVars: YoutubePlayerVars,
  webViewBaseUrl?: string,
) => {
  if (useInlineHtml) {
    return '';
  }

  const baseUrl = webViewBaseUrl || DEFAULT_EXTERNAL_WEB_URL;

  const { startTime, autoplay, controls, loop, muted, playsinline, rel, endTime, origin } = playerVars;

  const url = new URL(baseUrl);

  url.searchParams.set('videoId', videoId);
  startTime && url.searchParams.set('startTime', startTime.toString());
  endTime && url.searchParams.set('endTime', endTime.toString());
  url.searchParams.set('origin', origin || baseUrl);
  url.searchParams.set('autoplay', autoplay ? 'true' : 'false');
  url.searchParams.set('controls', controls ? 'true' : 'false');
  url.searchParams.set('loop', loop ? 'true' : 'false');
  url.searchParams.set('muted', muted ? 'true' : 'false');
  url.searchParams.set('playsinline', playsinline ? 'true' : 'false');
  url.searchParams.set('rel', rel ? 'true' : 'false');

  return url.toString();
};
