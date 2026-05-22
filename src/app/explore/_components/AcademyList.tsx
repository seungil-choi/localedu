"use client";

import { AcademyCard } from "@/components/AcademyCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Academy } from "@/lib/types";

interface Props {
  items: Academy[];
  /** 최대 표시 개수 — 초과 시 안내 메시지 */
  limit?: number;
  hoveredId?: string | null;
  selectedId?: string | null;
  hasFilter?: boolean;
  onSelect: (id: string) => void;
  onHover?: (id: string | null) => void;
  onClear?: () => void;
}

/**
 * Explore 결과 목록.
 *
 * - 빈 결과: 친절한 안내 + 필터 초기화 CTA
 * - 한도 초과: "지도를 좁혀보세요" 안내
 * - 카드 hover/click 시 부모에 알림 (지도 마커 강조에 사용)
 */
export function AcademyList({
  items,
  limit = 120,
  hoveredId,
  selectedId,
  hasFilter,
  onSelect,
  onHover,
  onClear,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="px-4 py-10">
        <EmptyState
          variant="inline"
          icon="search"
          title="검색 결과가 없어요"
          description="다른 키워드나 과목으로 검색해보세요."
          action={
            hasFilter && onClear ? (
              <button
                onClick={onClear}
                className="rounded-lg border border-[var(--color-border)] px-4 py-1.5 text-[12.5px] font-medium hover:bg-[var(--color-bg-soft)]"
              >
                필터 초기화
              </button>
            ) : undefined
          }
        />
      </div>
    );
  }

  const visible = items.slice(0, limit);
  const overLimit = items.length > limit;

  return (
    <ul>
      {visible.map((a) => (
        <li key={a.id}>
          <AcademyCard
            academy={a}
            variant="compact"
            highlighted={hoveredId === a.id || selectedId === a.id}
            onMouseEnter={() => onHover?.(a.id)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => onSelect(a.id)}
            showCompareButton={false}
          />
        </li>
      ))}
      {overLimit && (
        <li className="border-b border-[var(--color-border)] bg-[var(--color-bg-soft)] py-3 text-center text-[12px] text-[var(--color-text-tertiary)]">
          지도를 좁히면 더 정확한 결과를 볼 수 있어요
        </li>
      )}
    </ul>
  );
}
