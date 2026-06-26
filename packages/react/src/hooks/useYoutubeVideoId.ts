import {
  ERROR_CODES,
  type PlayerEvents,
  type YoutubeSource,
  extractVideoIdFromUrl,
  validateVideoId,
} from '@react-native-youtube-bridge/core';
import { useMemo } from 'react';

const getSourceValue = (source: YoutubeSource): string | null | undefined => {
  if (!source) {
    return undefined;
  }

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
};

const useYouTubeVideoId = (
  source: YoutubeSource,
  onError?: PlayerEvents['onError'],
): string | null | undefined => {
  const sourceValue = getSourceValue(source);

  const videoId = useMemo(() => {
    if (sourceValue === null) {
      console.error('Invalid YouTube source: ', sourceValue);
      onError?.({
        code: 1002,
        message: ERROR_CODES[1002],
      });
      return null;
    }

    if (sourceValue === undefined) {
      return undefined;
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
      return null;
    }

    return extractedId;
  }, [sourceValue, onError]);

  return videoId;
};

export default useYouTubeVideoId;
