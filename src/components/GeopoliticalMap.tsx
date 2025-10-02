import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import { NewsItem } from "@/hooks/useNewsFeed";
import { getCoordinates } from "@/lib/nlp";

interface GeopoliticalMapProps {
  news: NewsItem[];
}

export const GeopoliticalMap = ({ news }: GeopoliticalMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "",
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    // Update markers
    const map = mapInstanceRef.current;
    
    // Clear existing layers
    map.eachLayer((layer) => {
      if ((layer as any).options?.pane === 'markerPane') {
        map.removeLayer(layer);
      }
    });

    // Add new markers
    const markers = (L as any).markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });

    const locationCount = new Map<string, number>();

    news.slice(0, 30).forEach((item) => {
      item.locations?.forEach((location) => {
        const coords = getCoordinates(location);
        if (coords) {
          const count = (locationCount.get(location) || 0) + 1;
          locationCount.set(location, count);

          const marker = L.circleMarker(coords, {
            radius: 8 + Math.log(count) * 2,
            fillColor: "#3b82f6",
            color: "#60a5fa",
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.6,
          });

          marker.bindPopup(`
            <div style="font-family: system-ui; padding: 8px;">
              <strong style="color: #3b82f6; font-size: 14px;">${location}</strong>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">
                ${count} aktif haber
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">
                ${item.title.substring(0, 80)}...
              </p>
            </div>
          `);

          markers.addLayer(marker);
        }
      });
    });

    map.addLayer(markers);

    return () => {
      // Don't destroy map on cleanup, just clear markers
    };
  }, [news]);

  return (
    <div 
      ref={mapRef} 
      className="w-full rounded-lg overflow-hidden border border-border"
      style={{ height: "300px" }}
    />
  );
};
