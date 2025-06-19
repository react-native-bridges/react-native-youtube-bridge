import { useMemo } from 'react';
import { ERROR_CODES, type PlayerEvents, type YouTubeSource } from '../types/youtube';
import { extractVideoIdFromUrl, validateVideoId } from '../utils/validate';

const useYouTubeVideoId = (source: YouTubeSource, onError?: PlayerEvents['onError']): string => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const sourceValue = useMemo(() => {
    if (typeof source === 'string') {
      return source;
    }

    if ('videoId' in source) {
      return source.videoId;
    }

    if ('url' in source) {
      return source.url;
    }

    return null;
  }, [
    typeof source === 'string' ? source : 'videoId' in source ? source.videoId : 'url' in source ? source.url : null,
  ]);

  const videoId = useMemo(() => {
    if (!sourceValue) {
      console.error('Invalid YouTube source: ', sourceValue);
      onError?.({
        code: 1002,
        message: ERROR_CODES[1002],
      });
      return;
    }

    if (validateVideoId(sourceValue)) {
      return sourceValue;
    }

    const extractedId = extractVideoIdFromUrl(sourceValue);

    if (!extractedId) {
      console.error('Invalid YouTube source: ', sourceValue);
      onError?.({
        code: 1002,
        message: ERROR_CODES[1002],
      });
      return;
    }

    return extractedId;
  }, [sourceValue, onError]);

  return videoId ?? '';
};

export default useYouTubeVideoId;
