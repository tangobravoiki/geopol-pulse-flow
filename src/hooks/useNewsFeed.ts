import { useState, useEffect, useCallback } from "react";
import { extractLocations } from "@/lib/nlp";

export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  locations: string[];
}

const RSS_FEEDS = [
  "https://geopoliticalfutures.com/feed/",
  "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
  "https://www.aljazeera.com/xml/rss/all.xml",
];

const fetchRSS = async (rssUrl: string): Promise<NewsItem[]> => {
  const proxies = [
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`,
  ];

  for (const proxy of proxies) {
    try {
      const response = await fetch(proxy);
      if (!response.ok) continue;
      
      const data = await response.json();
      
      if (data.items) {
        return data.items.map((item: any) => ({
          title: item.title || "",
          description: item.description || item.content || "",
          link: item.link || item.url || "",
          pubDate: item.pubDate || item.published || new Date().toISOString(),
          source: new URL(rssUrl).hostname,
          locations: extractLocations(item.title + " " + (item.description || "")),
        }));
      }
    } catch (error) {
      console.warn(`Proxy ${proxy} failed:`, error);
    }
  }

  return [];
};

export const useNewsFeed = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const allItems: NewsItem[] = [];
      
      for (const feed of RSS_FEEDS) {
        const items = await fetchRSS(feed);
        allItems.push(...items);
      }

      const sortedNews = allItems
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
        .slice(0, 50);

      setNews(sortedNews);
    } catch (err) {
      setError("Haberler yüklenemedi");
      console.error("News fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllNews();
    const interval = setInterval(fetchAllNews, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchAllNews]);

  return { news, isLoading, error, refetch: fetchAllNews };
};
