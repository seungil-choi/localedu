"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadKakaoMaps,
  type KakaoCustomOverlay,
  type KakaoMap as KakaoMapInstance,
  type KakaoNamespace,
} from "@/lib/kakao";
import { USER_LOCATION } from "@/lib/mock";
import { subjectColor, formatPriceMan } from "@/lib/format";
import type { Academy } from "@/lib/types";

interface Props {
  academies: Academy[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  resultCount?: number;
  height?: string;
}

export function KakaoMap({
  academies,
  selectedId,
  onSelect,
  showRefreshButton,
  onRefresh,
  resultCount,
  height = "100%",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const overlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const userOverlayRef = useRef<KakaoCustomOverlay | null>(null);
  const kakaoRef = useRef<KakaoNamespace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // SDK 로드 + 지도 mount
  useEffect(() => {
    let cancelled = false;
    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled || !containerRef.current) return;
        kakaoRef.current = kakao;
        mapRef.current = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(USER_LOCATION.lat, USER_LOCATION.lng),
          level: 4,
        });

        // 사용자 위치
        const userEl = document.createElement("div");
        userEl.className = "ledu-user-marker";
        userEl.innerHTML = `
          <span class="ledu-user-pulse"></span>
          <span class="ledu-user-dot"></span>
        `;
        userOverlayRef.current = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(USER_LOCATION.lat, USER_LOCATION.lng),
          content: userEl,
          yAnchor: 0.5,
          xAnchor: 0.5,
          zIndex: 5,
        });
        userOverlayRef.current.setMap(mapRef.current);
      })
      .catch((e: Error) => {
        console.warn("[KakaoMap]", e.message);
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 마커 동기화
  useEffect(() => {
    const kakao = kakaoRef.current;
    const map = mapRef.current;
    if (!kakao || !map) return;

    // 기존 마커 제거
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    academies.forEach((a) => {
      const wrap = document.createElement("button");
      wrap.type = "button";
      wrap.className = "ledu-marker-button";
      const isSelected = selectedId === a.id;
      wrap.style.setProperty("--marker-color", subjectColor(a.subject));
      wrap.dataset.selected = String(isSelected);
      wrap.innerHTML = `
        <span class="ledu-marker-pin">
          <span class="ledu-marker-subject">${a.subject}</span>
          <span class="ledu-marker-price">${formatPriceMan(a.monthly_price)}</span>
        </span>
      `;
      wrap.addEventListener("click", () => onSelectRef.current?.(a.id));

      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(a.lat, a.lng),
        content: wrap,
        yAnchor: 1,
        xAnchor: 0.5,
        clickable: true,
        zIndex: isSelected ? 20 : 10,
      });
      overlay.setMap(map);
      overlaysRef.current.push(overlay);
    });
  }, [academies, selectedId]);

  if (error) {
    // SDK 로드 실패 시 호출자가 fallback. 이 컴포넌트는 빈 컨테이너만 노출.
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ height }}>
      <div ref={containerRef} className="absolute inset-0" />

      {/* 결과 카운트 */}
      {resultCount !== undefined && (
        <div className="pointer-events-none absolute left-3 top-3">
          <div className="rounded-full bg-white px-3 py-1.5 text-sm shadow ring-1 ring-black/5">
            현재 지도에서 <b>{resultCount}개</b> 학원이 검색됩니다
          </div>
        </div>
      )}

      {/* 우상단 컨트롤 */}
      <div className="pointer-events-none absolute right-3 top-3 flex flex-col gap-2">
        {showRefreshButton && (
          <button
            type="button"
            onClick={onRefresh}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-md ring-1 ring-black/5 hover:bg-gray-50"
          >
            ↻ 이 지역 학원 보기
          </button>
        )}
      </div>

      <KakaoMarkerStyles />
    </div>
  );
}

function KakaoMarkerStyles() {
  return (
    <style jsx global>{`
      .ledu-marker-button {
        border: 0;
        background: transparent;
        cursor: pointer;
        padding: 0;
      }
      .ledu-marker-pin {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 52px;
        height: 52px;
        border-radius: 999px;
        background: var(--marker-color, #4f46e5);
        color: #fff;
        outline: 2px solid #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
        transition:
          transform 0.12s ease,
          box-shadow 0.12s ease;
        line-height: 1;
      }
      .ledu-marker-button[data-selected="true"] .ledu-marker-pin {
        width: 60px;
        height: 60px;
        outline: 3px solid #fff;
        box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
        transform: translateY(-2px);
      }
      .ledu-marker-subject,
      .ledu-marker-price {
        font-size: 11px;
        font-weight: 700;
      }
      .ledu-marker-price {
        margin-top: 2px;
      }

      .ledu-user-marker {
        position: relative;
        width: 0;
        height: 0;
      }
      .ledu-user-pulse {
        position: absolute;
        inset: -20px auto auto -20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(79, 70, 229, 0.15);
      }
      .ledu-user-dot {
        position: absolute;
        inset: -7px auto auto -7px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #4f46e5;
        outline: 3px solid #fff;
      }
    `}</style>
  );
}
