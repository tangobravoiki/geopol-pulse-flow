import { MapPin, ExternalLink, Calendar, Globe, Video } from "lucide-react";
import { NewsItem } from "@/hooks/useNewsFeed";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useYouTubeVideos } from "@/hooks/useYouTubeVideos";

interface NewsCardProps {
  news: NewsItem;
  onLocationClick?: (location: string) => void;
}

export const NewsCard = ({ news, onLocationClick }: NewsCardProps) => {
  const [showVideos, setShowVideos] = useState(false);
  const { videos, isLoading: videosLoading } = useYouTubeVideos(
    showVideos ? news.title : ""
  );

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

          {/* Date and Video Button */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(news.pubDate)}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowVideos(!showVideos);
              }}
              className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
            >
              <Video className="w-4 h-4" />
              <span>{showVideos ? "Gizle" : "Videolar"}</span>
            </button>
          </div>
        </div>

        {/* YouTube Videos Section */}
        {showVideos && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" />
              İlgili YouTube Videoları
            </h4>
            
            {videosLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Videolar yükleniyor...
              </div>
            ) : videos.length > 0 ? (
              <div className="space-y-2">
                {videos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-24 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {video.channelTitle}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Bu haber için video bulunamadı
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
