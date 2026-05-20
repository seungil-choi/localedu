"use client";

import { useMemo } from "react";
import type { Academy } from "@/lib/types";
import { subjectColor } from "@/lib/format";
import { USER_LOCATION } from "@/lib/mock";

/**
 * 카카오/네이버 지도 연동 전 사용하는 stylized map.
 * 실제 좌표 → 화면 픽셀로 단순 선형 매핑한다.
 * Kakao API key 발급 후 KakaoMap 래퍼로 교체 예정.
 */

interface Props {
  academies: Academy[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  resultCount?: number;
  height?: string;
  showSubway?: boolean;
}

// 4개 자치구 전체 (강북·노원·도봉·성북) 감싸도록 BOUNDS 확장
const BOUNDS = {
  latMin: 37.58,
  latMax: 37.7,
  lngMin: 126.99,
  lngMax: 127.08,
};

function project(lat: number, lng: number, w: number, h: number) {
  const x = ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * w;
  const y = (1 - (lat - BOUNDS.latMin) / (BOUNDS.latMax - BOUNDS.latMin)) * h;
  return { x, y };
}

const STREETS = [
  // 가로
  { x1: 0, y1: 0.22, x2: 1, y2: 0.22 },
  { x1: 0, y1: 0.45, x2: 1, y2: 0.45 },
  { x1: 0, y1: 0.7, x2: 1, y2: 0.7 },
  // 세로
  { x1: 0.18, y1: 0, x2: 0.18, y2: 1 },
  { x1: 0.42, y1: 0, x2: 0.42, y2: 1 },
  { x1: 0.68, y1: 0, x2: 0.68, y2: 1 },
];

const PARKS = [
  { x: 0.55, y: 0.6, r: 0.13, label: "북서울꿈의숲" },
  { x: 0.78, y: 0.32, r: 0.08, label: "4·19민주묘지" },
];

const STATIONS = [
  { x: 0.18, y: 0.32, label: "수유역" },
  { x: 0.4, y: 0.55, label: "미아역" },
  { x: 0.85, y: 0.62, label: "솔샘역" },
];

export function MapCanvas({
  academies,
  selectedId,
  onSelect,
  showRefreshButton,
  onRefresh,
  resultCount,
  height = "100%",
  showSubway = true,
}: Props) {
  const W = 1000;
  const H = 600;

  const points = useMemo(
    () => academies.map((a) => ({ a, p: project(a.lat, a.lng, W, H) })),
    [academies],
  );
  const userPt = project(USER_LOCATION.lat, USER_LOCATION.lng, W, H);

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{ height, background: "#eef2f5" }}
    >
      {/* 베이스 맵 SVG */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <rect width={W} height={H} fill="#eef2f5" />
        {/* 공원/녹지 */}
        {PARKS.map((p, i) => (
          <g key={i}>
            <circle cx={p.x * W} cy={p.y * H} r={p.r * W} fill="#dceadc" />
            <text
              x={p.x * W}
              y={p.y * H}
              textAnchor="middle"
              fontSize="14"
              fill="#3f6b3f"
              fontWeight="600"
            >
              {p.label}
            </text>
          </g>
        ))}
        {/* 도로 */}
        {STREETS.map((s, i) => (
          <line
            key={i}
            x1={s.x1 * W}
            y1={s.y1 * H}
            x2={s.x2 * W}
            y2={s.y2 * H}
            stroke="#ffffff"
            strokeWidth={s.x1 === s.x2 || s.y1 === s.y2 ? 18 : 18}
          />
        ))}
        {/* 도로 옆 흰선 */}
        {STREETS.map((s, i) => (
          <line
            key={`b-${i}`}
            x1={s.x1 * W}
            y1={s.y1 * H}
            x2={s.x2 * W}
            y2={s.y2 * H}
            stroke="#e4e8ee"
            strokeWidth={20}
            strokeOpacity={0}
          />
        ))}

        {/* 지하철역 */}
        {showSubway &&
          STATIONS.map((s, i) => (
            <g key={`st-${i}`}>
              <circle cx={s.x * W} cy={s.y * H} r={6} fill="#1f4ed8" />
              <text
                x={s.x * W + 12}
                y={s.y * H + 4}
                fontSize="14"
                fontWeight="700"
                fill="#1f2937"
              >
                {s.label}
              </text>
            </g>
          ))}

        {/* 사용자 위치 */}
        <g>
          <circle
            cx={userPt.x}
            cy={userPt.y}
            r={20}
            fill="#4f46e5"
            fillOpacity={0.15}
          />
          <circle cx={userPt.x} cy={userPt.y} r={7} fill="#4f46e5" />
          <circle cx={userPt.x} cy={userPt.y} r={3} fill="#fff" />
        </g>
      </svg>

      {/* 마커 (HTML 오버레이) */}
      <div className="absolute inset-0">
        {points.map(({ a, p }) => {
          const xPct = (p.x / W) * 100;
          const yPct = (p.y / H) * 100;
          const selected = selectedId === a.id;
          const color = subjectColor(a.subject);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelect?.(a.id)}
              className="absolute flex flex-col items-center"
              style={{
                left: `${xPct}%`,
                top: `${yPct}%`,
                transform: "translate(-50%, -100%)",
                zIndex: selected ? 20 : 10,
              }}
            >
              <span
                className="flex flex-col items-center justify-center rounded-full text-white shadow-md transition"
                style={{
                  background: color,
                  width: selected ? 60 : 52,
                  height: selected ? 60 : 52,
                  outline: selected ? "3px solid white" : "2px solid white",
                  boxShadow: selected
                    ? "0 6px 16px rgba(79,70,229,.35)"
                    : "0 4px 8px rgba(0,0,0,.12)",
                }}
              >
                <span className="text-[11px] font-bold leading-none">
                  {a.subject}
                </span>
                {Math.round((a.monthly_price || 0) / 10000) >= 5 && (
                  <span className="mt-0.5 text-[10px] font-semibold leading-none opacity-90">
                    {Math.round(a.monthly_price / 10000)}만
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

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

      {/* 좌측 결과 카운트 (상단) */}
      {resultCount !== undefined && (
        <div className="pointer-events-none absolute left-3 top-3">
          <div className="rounded-full bg-white px-3 py-1.5 text-sm shadow ring-1 ring-black/5">
            현재 지도에서 <b>{resultCount}개</b> 학원이 검색됩니다
          </div>
        </div>
      )}

      {/* 우하단 줌 + 내 위치 */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1">
        <button
          aria-label="확대"
          className="grid h-8 w-8 place-items-center rounded bg-white text-lg shadow ring-1 ring-black/5"
        >
          +
        </button>
        <button
          aria-label="축소"
          className="grid h-8 w-8 place-items-center rounded bg-white text-lg shadow ring-1 ring-black/5"
        >
          −
        </button>
        <button
          aria-label="내 위치"
          className="mt-1 grid h-8 w-8 place-items-center rounded-full bg-white shadow ring-1 ring-black/5"
        >
          ◎
        </button>
      </div>
    </div>
  );
}
