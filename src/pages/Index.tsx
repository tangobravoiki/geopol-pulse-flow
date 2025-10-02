import { useState, useEffect } from "react";
import { MapPin, TrendingUp, Globe, Activity, RefreshCw } from "lucide-react";
import { NewsCard } from "@/components/NewsCard";
import { GeopoliticalMap } from "@/components/GeopoliticalMap";
import { TrendChart } from "@/components/TrendChart";
import { StatsGrid } from "@/components/StatsGrid";
import { useNewsFeed } from "@/hooks/useNewsFeed";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const { news, isLoading, refetch } = useNewsFeed();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    if (news.length > 0 && !isLoading) {
      toast.success(`${news.length} yeni haber yüklendi`, {
        description: news[0]?.title.substring(0, 60) + "...",
      });
    }
  }, [news.length]);

  const filteredNews = selectedRegion
    ? news.filter((item) => item.locations?.includes(selectedRegion))
    : news;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Jeopolitik Gündem Pro
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gelişmiş İstihbarat Platformu
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4 data-pulse text-accent" />
                <span>Canlı</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Yenile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <StatsGrid news={news} isLoading={isLoading} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* News List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Son Jeopolitik Haberler</h2>
              </div>
              {selectedRegion && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRegion(null)}
                >
                  Filtreyi Temizle
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="intelligence-card p-8 text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Haberler yükleniyor...</p>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="intelligence-card p-8 text-center">
                <Globe className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {selectedRegion
                    ? `${selectedRegion} bölgesi için haber bulunamadı`
                    : "Haber bulunamadı"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNews.slice(0, 20).map((item, index) => (
                  <NewsCard
                    key={index}
                    news={item}
                    onLocationClick={setSelectedRegion}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar with Map and Chart */}
          <div className="space-y-6">
            <div className="intelligence-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Jeopolitik Harita</h3>
              </div>
              <GeopoliticalMap news={news} />
            </div>

            <div className="intelligence-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Haber Trendleri</h3>
              </div>
              <TrendChart news={news} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
