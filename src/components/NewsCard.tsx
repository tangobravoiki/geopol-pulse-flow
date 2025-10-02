import { MapPin, ExternalLink, Calendar, Globe } from "lucide-react";
import { NewsItem } from "@/hooks/useNewsFeed";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  news: NewsItem;
  onLocationClick?: (location: string) => void;
}

export const NewsCard = ({ news, onLocationClick }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Tarih yok";
    }
  };

  return (
    <div className="intelligence-card p-5 group cursor-pointer">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors flex-1">
            {news.title}
          </h3>
          <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Description */}
        {news.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {news.description.replace(/<[^>]*>/g, "").substring(0, 200)}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/50">
          {/* Locations */}
          <div className="flex flex-wrap gap-1.5">
            {news.locations && news.locations.length > 0 ? (
              news.locations.slice(0, 3).map((location, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-primary/20 hover:border-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLocationClick?.(location);
                  }}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {location}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                Genel
              </Badge>
            )}
          </div>

          {/* Date and Source */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(news.pubDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
