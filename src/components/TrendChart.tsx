import { useEffect, useRef } from "react";
import { NewsItem } from "@/hooks/useNewsFeed";

interface TrendChartProps {
  news: NewsItem[];
}

export const TrendChart = ({ news }: TrendChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || news.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Process data
    const dailyCount = new Map<string, number>();
    news.forEach((item) => {
      const date = new Date(item.pubDate).toISOString().split("T")[0];
      dailyCount.set(date, (dailyCount.get(date) || 0) + 1);
    });

    const dates = Array.from(dailyCount.keys()).sort().slice(-7);
    const counts = dates.map((date) => dailyCount.get(date) || 0);
    const maxCount = Math.max(...counts, 1);

    // Draw chart
    const padding = 40;
    const width = rect.width - padding * 2;
    const height = rect.height - padding * 2;
    const barWidth = width / dates.length;

    // Clear canvas
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw bars
    counts.forEach((count, index) => {
      const barHeight = (count / maxCount) * height;
      const x = padding + index * barWidth + barWidth * 0.1;
      const y = padding + height - barHeight;

      // Gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, "#3b82f6");
      gradient.addColorStop(1, "#06b6d4");

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);

      // Label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      const dateLabel = new Date(dates[index]).getDate().toString();
      ctx.fillText(dateLabel, x + barWidth * 0.4, padding + height + 20);

      // Value
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 12px system-ui";
      ctx.fillText(count.toString(), x + barWidth * 0.4, y - 5);
    });

    // Title
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Son 7 Gün", padding, 20);
  }, [news]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg"
      style={{ height: "200px" }}
    />
  );
};
