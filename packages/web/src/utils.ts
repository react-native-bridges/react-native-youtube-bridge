export const parseTimeParam = (time: string | null, defaultValue?: number): number | undefined => {
  if (!time) {
    return defaultValue;
  }

  const parsed = Number(time);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};
