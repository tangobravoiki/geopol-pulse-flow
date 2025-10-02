import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  url: string;
}

export const useYouTubeVideos = (query: string) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 3) {
      setVideos([]);
      return;
    }

    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: functionError } = await supabase.functions.invoke('search-youtube', {
          body: { query },
        });

        if (functionError) {
          throw functionError;
        }

        setVideos(data.videos || []);
      } catch (err) {
        console.error('YouTube fetch error:', err);
        setError('YouTube videoları yüklenemedi');
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(fetchVideos, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { videos, isLoading, error };
};
