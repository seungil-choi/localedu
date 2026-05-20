"use client";

import { useEffect, useRef } from "react";

interface Props {
  lat: number;
  lng: number;
  name: string;
}

/**
 * 학원 상세 위치 섹션 — Leaflet 미니맵
 * VWorld WMTS 타일 + 학원 위치 핀
 */
export function AcademyMiniMap({ lat, lng, name }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!lat || !lng) return;

    let map: import("leaflet").Map;
    let marker: import("leaflet").Marker;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // 이미 초기화된 경우 방지
      if (mapRef.current) return;

      const vworldKey = process.env.NEXT_PUBLIC_VWORLD_KEY;
      const tileUrl = vworldKey
        ? `https://api.vworld.kr/req/wmts/1.0.0/${vworldKey}/Base/{z}/{y}/{x}.png`
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      map = L.map(containerRef.current!, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        attributionControl: false,
      });

      if (vworldKey) {
        L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
      } else {
        L.tileLayer(tileUrl, {
          subdomains: ["a", "b", "c"],
          maxZoom: 19,
        }).addTo(map);
      }

      // 학원 위치 핀
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:32px;height:32px;
          background:var(--color-primary,#5B5BD6);
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      marker = L.marker([lat, lng], { icon })
        .addTo(map)
        .bindTooltip(name, { permanent: true, direction: "top", offset: [0, -36] });

      mapRef.current = map;
    })();

    return () => {
      if (map) {
        map.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, name]);

  // 유효한 좌표가 없으면 빈 placeholder
  if (!lat || !lng) {
    return (
      <div className="flex h-full min-h-[180px] items-center justify-center rounded-lg bg-[var(--color-bg-soft)] text-[13px] text-[var(--color-text-tertiary)]">
        지도 준비 중
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[180px] w-full overflow-hidden rounded-lg"
      style={{ minHeight: 180 }}
    />
  );
}
