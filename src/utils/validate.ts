export const validateVideoId = (videoId: string): boolean => {
  // YouTube video ID is 11 characters of alphanumeric and hyphen, underscore
  const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
  return videoIdRegex.test(videoId);
};

export const extractVideoIdFromUrl = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
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
