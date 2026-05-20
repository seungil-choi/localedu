"use client";

import { useEffect, useRef, useState } from "react";
import type { Academy, Region } from "@/lib/types";
import { subjectColor, formatPriceMan, formatDistance } from "@/lib/format";
import { USER_LOCATION, REGION_CENTERS } from "@/lib/mock";
import { useAppStore } from "@/store/useAppStore";
import { Icon } from "./Icon";

/**
 * Leaflet + VWorld 타일 기반 진짜 지도.
 * 부동산 서비스 패턴 차용:
 *   - 마커 클러스터링
 *   - 지도 드래그·줌
 *   - 지도 이동 시 onBoundsChange로 사이드 리스트 동기화
 *   - 마커 클릭 → 팝업
 */

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface Props {
  academies: Academy[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onBoundsChange?: (b: Bounds) => void;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  resultCount?: number;
  height?: string;
}

const SUBWAY_STATIONS = [
  { name: "수유역", lat: 37.6376, lng: 127.0254 },
  { name: "미아역", lat: 37.6266, lng: 127.0254 },
  { name: "미아사거리역", lat: 37.6132, lng: 127.0303 },
  { name: "솔샘역", lat: 37.6254, lng: 127.0411 },
  { name: "북한산우이역", lat: 37.6643, lng: 127.0123 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LMod = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LMap = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LLayer = any;

export function LeafletMap({
  academies,
  selectedId,
  onSelect,
  onBoundsChange,
  showRefreshButton,
  onRefresh,
  resultCount,
  height = "100%",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const LRef = useRef<LMod | null>(null);
  const clusterRef = useRef<LLayer | null>(null);
  const userMarkerRef = useRef<LLayer | null>(null);
  const [tileError, setTileError] = useState(false);
  const [ready, setReady] = useState(false);
  const onSelectRef = useRef(onSelect);
  const onBoundsChangeRef = useRef(onBoundsChange);
  onSelectRef.current = onSelect;
  onBoundsChangeRef.current = onBoundsChange;

  // store에서 region 변경 감지 → 지도 중심 이동
  const region = useAppStore((s) => s.filter.region) as Region | "전체";

  // 1) 라이브러리 + 지도 초기화 (1회)
  useEffect(() => {
    let cancelled = false;
    let map: LMap | null = null;

    (async () => {
      const leaflet = await import("leaflet");
      const L: LMod = leaflet.default || leaflet;
      LRef.current = L;
      // markercluster는 사이드 이펙트로 L.markerClusterGroup 추가
      await import("leaflet.markercluster");
      await import("leaflet/dist/leaflet.css");
      await import("leaflet.markercluster/dist/MarkerCluster.css");
      await import("leaflet.markercluster/dist/MarkerCluster.Default.css");

      if (cancelled || !containerRef.current) return;

      const key = process.env.NEXT_PUBLIC_VWORLD_KEY;
      if (!key) {
        setTileError(true);
        return;
      }

      map = L.map(containerRef.current, {
        center: [USER_LOCATION.lat, USER_LOCATION.lng],
        zoom: 13,
        zoomControl: false,
      });
      mapRef.current = map;

      const tile = L.tileLayer(
        `https://api.vworld.kr/req/wmts/1.0.0/${key}/Base/{z}/{y}/{x}.png`,
        {
          attribution: "© VWorld · 국토지리정보원",
          maxZoom: 18,
          minZoom: 11,
          crossOrigin: true,
        },
      );
      tile.on("tileerror", () => setTileError(true));
      tile.addTo(map);

      // 사용자 위치 (region에 따라 위치 바뀜 — useEffect로 동기화)
      const initialCenter =
        region !== "전체" && REGION_CENTERS[region as Region]
          ? REGION_CENTERS[region as Region]
          : USER_LOCATION;
      userMarkerRef.current = L.marker([initialCenter.lat, initialCenter.lng], {
        icon: L.divIcon({
          className: "ledu-user-icon",
          html: `<span class="ledu-user-pulse"></span><span class="ledu-user-dot"></span>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
        interactive: false,
      }).addTo(map);
      map.setView([initialCenter.lat, initialCenter.lng], 13);

      // 지하철역
      SUBWAY_STATIONS.forEach((s) => {
        L.marker([s.lat, s.lng], {
          icon: L.divIcon({
            className: "ledu-subway-icon",
            html: `<span class="ledu-subway-dot"></span><span class="ledu-subway-label">${s.name}</span>`,
            iconSize: [80, 24],
            iconAnchor: [6, 12],
          }),
          interactive: false,
        }).addTo(map);
      });

      // bounds 이벤트
      const emit = () => {
        const m = mapRef.current;
        if (!m) return;
        const b = m.getBounds();
        onBoundsChangeRef.current?.({
          north: b.getNorth(),
          south: b.getSouth(),
          east: b.getEast(),
          west: b.getWest(),
        });
      };
      map.on("moveend", emit);
      map.on("zoomend", emit);
      setTimeout(emit, 50);

      setReady(true);
    })().catch((e) => {
      console.warn("[LeafletMap init]", e);
      setTileError(true);
    });

    return () => {
      cancelled = true;
      if (map) {
        try {
          map.remove();
        } catch {
          /* ignore */
        }
      }
      mapRef.current = null;
    };
  }, []);

  // 1.5) region 변경 시 지도 중심 이동 + 사용자 마커 위치 갱신
  useEffect(() => {
    if (!ready) return;
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    if (region === "전체" || !REGION_CENTERS[region as Region]) return;
    const c = REGION_CENTERS[region as Region];
    map.setView([c.lat, c.lng], 13);
    if (userMarkerRef.current) {
      (userMarkerRef.current as { setLatLng: (ll: [number, number]) => void }).setLatLng([c.lat, c.lng]);
    }
  }, [region, ready]);

  // 2) 학원 마커 동기화 (academies / selectedId 변경 시)
  useEffect(() => {
    if (!ready) return;
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
      clusterRef.current = null;
    }

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 50,        // 50→더 일찍 클러스터링되어 마커 밀집 감소
      disableClusteringAtZoom: 17,
      iconCreateFunction: (cl: { getChildCount: () => number }) => {
        const c = cl.getChildCount();
        const size = c < 10 ? 34 : c < 30 ? 42 : c < 80 ? 50 : 58;
        return L.divIcon({
          className: "ledu-cluster",
          html: `<div class="ledu-cluster-bubble" style="width:${size}px;height:${size}px"><b>${c}</b></div>`,
          iconSize: [size, size],
        });
      },
    });

    academies.forEach((a) => {
      const isSelected = selectedId === a.id;
      const color = subjectColor(a.subject);
      // 가격 있으면 표시, 없으면 과목명만 — "₩0만" 방지
      const priceMan = Math.round((a.monthly_price || 0) / 10000);
      const priceLabel = priceMan >= 5 ? `${priceMan}만` : "";
      const icon = L.divIcon({
        className: "ledu-academy-icon",
        html: `<button class="ledu-academy-pin" data-selected="${isSelected}" style="--c:${color}">${a.subject}${priceLabel ? `<small>${priceLabel}</small>` : ""}</button>`,
        iconSize: [46, 46],
        iconAnchor: [23, 46],
      });
      const marker = L.marker([a.lat, a.lng], { icon });
      marker.bindPopup(buildPopupHTML(a), {
        closeButton: true,
        maxWidth: 280,
        className: "ledu-popup",
      });
      marker.on("click", () => onSelectRef.current?.(a.id));
      cluster.addLayer(marker);
    });

    cluster.addTo(map);
    clusterRef.current = cluster;
  }, [academies, selectedId, ready]);

  if (tileError) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ height }}>
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {resultCount !== undefined && (
        <div className="pointer-events-none absolute left-3 top-3 z-[400]">
          <div className="rounded-full bg-white px-3 py-1.5 text-sm shadow-md ring-1 ring-black/5">
            현재 지도에서 <b>{resultCount}개</b> 학원
          </div>
        </div>
      )}

      <div className="absolute right-3 top-3 z-[400] flex flex-col gap-2">
        {showRefreshButton && (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--color-primary)] px-3.5 py-1.5 text-sm font-semibold text-white shadow-md hover:bg-[var(--color-primary-hover)]"
          >
            <Icon name="refresh" size={14} />
            이 지역 다시 검색
          </button>
        )}
      </div>

      <div className="absolute bottom-3 right-3 z-[400] flex flex-col gap-1">
        <button
          aria-label="확대"
          onClick={() => {
            const m = mapRef.current;
            if (m) m.setZoom(m.getZoom() + 1);
          }}
          className="grid h-9 w-9 place-items-center rounded bg-white shadow-md ring-1 ring-black/5 hover:bg-gray-50"
        >
          <Icon name="plus" size={18} color="var(--color-text-secondary)" />
        </button>
        <button
          aria-label="축소"
          onClick={() => {
            const m = mapRef.current;
            if (m) m.setZoom(m.getZoom() - 1);
          }}
          className="grid h-9 w-9 place-items-center rounded bg-white shadow-md ring-1 ring-black/5 hover:bg-gray-50"
        >
          <Icon name="minus" size={18} color="var(--color-text-secondary)" />
        </button>
        <button
          aria-label="내 위치"
          onClick={() => {
            const m = mapRef.current;
            if (m) m.setView([USER_LOCATION.lat, USER_LOCATION.lng], 15);
          }}
          className="mt-1 grid h-9 w-9 place-items-center rounded-full bg-white shadow-md ring-1 ring-black/5"
        >
          <Icon name="navigate" size={16} color="var(--color-primary)" />
        </button>
      </div>

      <LeafletStyles />
    </div>
  );
}

function buildPopupHTML(a: Academy) {
  const dist = formatDistance(a.distance_km);
  const rating =
    a.rating > 0 ? `★ ${a.rating.toFixed(1)} (${a.review_count})` : "후기 준비 중";
  const price =
    a.monthly_price > 0 ? `월 ${Math.round(a.monthly_price / 10000)}만원` : "수강료 문의";
  const features = (a.meta?.features ?? []).slice(0, 2);
  return `
    <div class="ledu-popup-card">
      <div class="ledu-popup-head">
        <span class="ledu-popup-subject" style="background:${subjectColor(a.subject)}">${a.subject}</span>
        <strong class="ledu-popup-name">${escapeHTML(a.name)}</strong>
      </div>
      <div class="ledu-popup-meta">${rating} · ${dist}</div>
      <div class="ledu-popup-meta">${escapeHTML(a.dong)} · ${price}</div>
      ${features.length ? `<div class="ledu-popup-chips">${features.map((f) => `<span>${escapeHTML(f)}</span>`).join("")}</div>` : ""}
      <a href="/academy/${a.id}" class="ledu-popup-cta">상세 보기 →</a>
    </div>
  `;
}

function escapeHTML(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );
}

function LeafletStyles() {
  return (
    <style jsx global>{`
      .ledu-academy-icon {
        background: transparent !important;
        border: 0 !important;
      }
      .ledu-academy-pin {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 46px;
        border-radius: 999px;
        background: var(--c, #4f46e5);
        color: #fff;
        outline: 2.5px solid rgba(255,255,255,0.9);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        line-height: 1;
        cursor: pointer;
        font-family: inherit;
        border: 0;
        padding: 0;
        transition: transform 0.12s;
        font-size: 11px;
        font-weight: 700;
        gap: 1px;
      }
      .ledu-academy-pin:hover {
        transform: translateY(-2px) scale(1.05);
      }
      .ledu-academy-pin[data-selected="true"] {
        width: 54px;
        height: 54px;
        outline: 3px solid #fff;
        box-shadow: 0 6px 18px rgba(79, 70, 229, 0.45);
        z-index: 10;
      }
      .ledu-academy-pin small {
        font-size: 9px;
        font-weight: 600;
        opacity: 0.9;
      }
      .ledu-cluster {
        background: transparent !important;
        border: 0 !important;
      }
      .ledu-cluster-bubble {
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: rgba(79, 70, 229, 0.92);
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        outline: 3px solid rgba(255, 255, 255, 0.85);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
      }
      .ledu-user-icon {
        background: transparent !important;
        border: 0 !important;
      }
      .ledu-user-pulse {
        display: block;
        position: absolute;
        inset: -16px auto auto -16px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(79, 70, 229, 0.18);
        animation: ledu-pulse 1.6s ease-out infinite;
      }
      .ledu-user-dot {
        display: block;
        position: absolute;
        inset: -7px auto auto -7px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #4f46e5;
        outline: 3px solid #fff;
      }
      @keyframes ledu-pulse {
        0% {
          transform: scale(0.6);
          opacity: 0.6;
        }
        100% {
          transform: scale(1.6);
          opacity: 0;
        }
      }
      .ledu-subway-icon {
        background: transparent !important;
        border: 0 !important;
      }
      .ledu-subway-dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #1f4ed8;
        outline: 2px solid #fff;
        vertical-align: middle;
      }
      .ledu-subway-label {
        display: inline-block;
        margin-left: 4px;
        font-size: 12px;
        font-weight: 700;
        color: #1f2937;
        background: rgba(255, 255, 255, 0.85);
        padding: 1px 4px;
        border-radius: 3px;
        vertical-align: middle;
      }
      .ledu-popup .leaflet-popup-content-wrapper {
        border-radius: 12px;
        padding: 0;
      }
      .ledu-popup .leaflet-popup-content {
        margin: 12px 14px;
      }
      .ledu-popup-card {
        font-family: inherit;
        min-width: 220px;
      }
      .ledu-popup-head {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 6px;
      }
      .ledu-popup-subject {
        display: inline-grid;
        place-items: center;
        min-width: 28px;
        height: 22px;
        padding: 0 6px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        color: #fff;
      }
      .ledu-popup-name {
        font-size: 14px;
        font-weight: 700;
      }
      .ledu-popup-meta {
        font-size: 12px;
        color: #4b5563;
        margin-top: 2px;
      }
      .ledu-popup-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 6px;
      }
      .ledu-popup-chips > span {
        font-size: 11px;
        background: #f3f4f6;
        padding: 2px 6px;
        border-radius: 4px;
        color: #374151;
      }
      .ledu-popup-cta {
        display: block;
        margin-top: 8px;
        text-align: center;
        background: #4f46e5;
        color: #fff !important;
        padding: 6px 0;
        border-radius: 8px;
        font-size: 12.5px;
        font-weight: 600;
        text-decoration: none !important;
      }
      .ledu-popup-cta:hover {
        background: #4338ca;
      }
      .leaflet-control-attribution {
        font-size: 10px !important;
        background: rgba(255, 255, 255, 0.75) !important;
      }
    `}</style>
  );
}
