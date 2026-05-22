"use client";

import { SortSelect, type SortKey } from "./SortSelect";

interface Props {
  count: number;
  keyword?: string;
  sortKey: SortKey;
  onSortChange: (k: SortKey) => void;
  /** 모바일 시트에서만 노출하는 보조 액션 */
  rightSlot?: React.ReactNode;
  size?: "md" | "sm";
}

/** 결과 카운트 + 키워드 + 정렬 셀렉트. */
export function ResultsHeader({
  count,
  keyword,
  sortKey,
  onSortChange,
  rightSlot,
  size = "md",
}: Props) {
  const textSize = size === "md" ? "text-[12.5px]" : "text-[12px]";
  return (
    <div className="flex items-center justify-between gap-2">
      <div className={`${textSize} text-[var(--color-text-secondary)]`}>
        <b className="text-[var(--color-text-primary)]">{count}</b>개
        {keyword && (
          <span className="ml-1 text-[var(--color-primary)]">&ldquo;{keyword}&rdquo;</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {rightSlot}
        <SortSelect value={sortKey} onChange={onSortChange} size={size} />
      </div>
    </div>
  );
}
