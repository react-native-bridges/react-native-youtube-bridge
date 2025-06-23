export const ERROR_CODES = {
  2: 'INVALID_PARAMETER_VALUE',
  5: 'HTML5_PLAYER_ERROR',
  100: 'VIDEO_NOT_FOUND_OR_PRIVATE',
  101: 'EMBEDDED_PLAYBACK_NOT_ALLOWED',
  150: 'EMBEDDED_RESTRICTED',
  1000: 'FAILED_TO_PARSE_WEBVIEW_MESSAGE',
  1001: 'WEBVIEW_LOADING_ERROR',
  1002: 'INVALID_YOUTUBE_VIDEO_ID',
  1003: 'FAILED_TO_LOAD_YOUTUBE_API',
  1004: 'UNKNOWN_ERROR',
} as const;

export const MATCH_URL_YOUTUBE =
  /(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})/;
