import type { ERROR_CODES, PlaybackQuality } from '../types/youtube';

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

export const getErrorMessage = (errorCode: keyof typeof ERROR_CODES): string => {
  const errorMessages: Record<keyof typeof ERROR_CODES, string> = {
    2: '잘못된 매개변수 값입니다.',
    5: 'HTML5 플레이어 오류가 발생했습니다.',
    100: '비디오를 찾을 수 없거나 비공개 상태입니다.',
    101: '임베드 재생이 허용되지 않습니다.',
    150: '임베드 재생이 허용되지 않습니다.',
  };

  return errorMessages[errorCode] || `알 수 없는 오류 (${errorCode})`;
};
