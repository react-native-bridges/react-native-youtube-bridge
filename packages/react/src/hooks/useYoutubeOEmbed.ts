import { useEffect, useState } from 'react';

type OEmbed = {
  author_name: string;
  author_url: string;
  height: number;
  html: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_url: string;
  thumbnail_width: number;
  title: string;
  type: string;
  version: string;
  width: number;
};

/**
 * Hook to fetch the oEmbed data for a YouTube video.
 * @param url - The URL of the YouTube video.
 * @returns The oEmbed data, loading state, and error.
 */
const useYoutubeOEmbed = (url: string) => {
  const [oEmbed, setOEmbed] = useState<OEmbed>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setError(null);
    setOEmbed(undefined);

    const fetchOEmbed = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch oEmbed');
        }

        const data = await response.json();
        setOEmbed(data);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        if (error instanceof Error) {
          setError(error);
          return;
        }

        setError(new Error('Failed to fetch oEmbed'));
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      fetchOEmbed();
    }

    return () => {
      controller.abort();
    };
  }, [url]);

  return {
    oEmbed,
    isLoading,
    error,
  };
};

export default useYoutubeOEmbed;
