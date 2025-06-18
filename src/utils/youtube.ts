import type { PlaybackQuality } from '../types/youtube';

export const getQualityLabel = (quality: PlaybackQuality): string => {
  const qualityLabels: Record<PlaybackQuality, string> = {
    small: '240p',
    medium: '360p',
    large: '480p',
    hd720: '720p HD',
    hd1080: '1080p HD',
    highres: '고해상도',
  };

  return qualityLabels[quality] || quality;
};
