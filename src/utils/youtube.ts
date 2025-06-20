import type { YoutubePlayerVars } from '../types/youtube';

export const getYoutubeWebViewUrl = (videoId: string, useInlineHtml: boolean, playerVars: YoutubePlayerVars) => {
  if (useInlineHtml) {
    return '';
  }

  const { startTime, autoplay, controls, loop, muted, playsinline, rel, endTime } = playerVars;

  const url = new URL('http://localhost:5173/');

  url.searchParams.set('videoId', videoId);
  startTime && url.searchParams.set('startTime', startTime.toString());
  endTime && url.searchParams.set('endTime', endTime.toString());
  url.searchParams.set('autoplay', autoplay ? 'true' : 'false');
  url.searchParams.set('controls', controls ? 'true' : 'false');
  url.searchParams.set('loop', loop ? 'true' : 'false');
  url.searchParams.set('muted', muted ? 'true' : 'false');
  url.searchParams.set('playsinline', playsinline ? 'true' : 'false');
  url.searchParams.set('rel', rel ? 'true' : 'false');

  return url.toString();
};
