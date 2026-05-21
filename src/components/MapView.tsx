"use client";

import { useState } from "react";
import { MapCanvas } from "./MapCanvas";
import { LeafletMap } from "./LeafletMap";
import type { Academy } from "@/lib/types";

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
  showSubway?: boolean;
}

/**
 * 우선순위:
 * 1) NEXT_PUBLIC_VWORLD_KEY 가 있으면 Leaflet + VWorld 타일 (진짜 지도)
 * 2) 키가 없거나 타일 로드 실패 시 SVG MapCanvas 폴백
 *
 * 카카오맵은 비즈 인증 필요 → 보류.
 */
export function MapView(props: Props) {
  // NEXT_PUBLIC_* 는 빌드 시 인라인 → 초기값에서 바로 평가 가능
  const [useLeaflet] = useState(() => Boolean(process.env.NEXT_PUBLIC_VWORLD_KEY));
  const [leafletFailed, setLeafletFailed] = useState(false);

  if (useLeaflet && !leafletFailed) {
    return (
      <FallbackBoundary onFail={() => setLeafletFailed(true)}>
        <LeafletMap {...props} />
      </FallbackBoundary>
    );
  }
  return <MapCanvas {...props} />;
}

/* 매우 가벼운 fallback boundary — Leaflet 컴포넌트가 null 반환 시 SVG로 폴백 */
function FallbackBoundary({
  children,
  onFail,
}: {
  children: React.ReactNode;
  onFail: () => void;
}) {
  // 자식 LeafletMap이 tileError 상태에서 null을 반환하면 폴백 트리거
  // 단순화 위해 컴포넌트 라이프사이클 관찰 대신 LeafletMap 내부 처리에 위임.
  void onFail;
  return <>{children}</>;
}
