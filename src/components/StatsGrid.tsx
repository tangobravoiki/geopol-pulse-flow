import { Globe, TrendingUp, MapPin, Clock } from "lucide-react";
import { NewsItem } from "@/hooks/useNewsFeed";

interface StatsGridProps {
  news: NewsItem[];
  isLoading: boolean;
}

export const StatsGrid = ({ news, isLoading }: StatsGridProps) => {
  const totalNews = news.length;
  const uniqueLocations = new Set(news.flatMap((item) => item.locations || [])).size;
  const last24Hours = news.filter(
    (item) => new Date(item.pubDate).getTime() > Date.now() - 24 * 60 * 60 * 1000
  ).length;
  const avgPerDay = Math.round(totalNews / 7);

  const stats = [
    {
      icon: Globe,
      label: "Toplam Haber",
      value: totalNews,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: MapPin,
      label: "Aktif Bölge",
      value: uniqueLocations,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Clock,
      label: "Son 24 Saat",
      value: last24Hours,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: TrendingUp,
      label: "Günlük Ort.",
      value: avgPerDay,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="intelligence-card p-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">
                {isLoading ? (
                  <span className="inline-block w-12 h-7 bg-muted animate-pulse rounded" />
                ) : (
                  stat.value
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
