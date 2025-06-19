const MATCH_URL_YOUTUBE =
  /(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})/;

export const extractVideoIdFromUrl = (url?: string): string | undefined => {
  if (!url) {
    return undefined;
  }

  const match = url.match(MATCH_URL_YOUTUBE);

  return match ? match[1] : undefined;
};

export const validateVideoId = (videoId?: string): boolean => {
  const videoIdRegex = /^[\w-]{11}$/;
  return videoIdRegex.test(videoId ?? '');
};

export const escapeHtml = (unsafe?: string): string => {
  if (!unsafe) {
    return '';
  }

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const safeNumber = (value: number | undefined, defaultValue = 0): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return defaultValue;
  }

  return Math.max(0, Math.floor(value));
};
