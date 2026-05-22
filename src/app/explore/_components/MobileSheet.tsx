"use client";

import { useState } from "react";
import type { Academy, Subject } from "@/lib/types";
import { AcademyList } from "./AcademyList";
import { ExploreSearchBar } from "./ExploreSearchBar";
import { ResultsHeader } from "./ResultsHeader";
import { SubjectChips } from "./SubjectChips";
import type { SortKey } from "./SortSelect";

interface Props {
  sorted: Academy[];
  keyword: string;
  inputValue: string;
  subject: Subject | "전체";
  sortKey: SortKey;
  onInputChange: (v: string) => void;
  onSearch: () => void;
  onSubjectChange: (s: Subject | "전체") => void;
  onSortChange: (k: SortKey) => void;
  onSelect: (id: string) => void;
  onClear: () => void;
}

/**
 * 모바일 하단 시트 — 핸들로 펼쳤다 접었다.
 * - 접힘: 45vh
 * - 펼침: 70vh
 *
 * 데스크탑(md+)에서는 부모가 hidden 처리.
 */
export function MobileSheet({
  sorted,
  keyword,
  inputValue,
  subject,
  sortKey,
  onInputChange,
  onSearch,
  onSubjectChange,
  onSortChange,
  onSelect,
  onClear,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasFilter = Boolean(keyword) || subject !== "전체";

  return (
    <div
      className={`fixed bottom-16 left-0 right-0 z-20 flex flex-col rounded-t-2xl border-t border-[var(--color-border)] bg-white shadow-[0_-8px_24px_rgba(0,0,0,.08)] transition-all duration-300 ${
        expanded ? "h-[70vh]" : "h-[45vh]"
      }`}
    >
      {/* 드래그 핸들 */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "접기" : "펼치기"}
        className="flex w-full flex-col items-center py-2"
      >
        <span className="h-1 w-10 rounded-full bg-[var(--color-border-strong)]" />
      </button>

      {/* 검색바 */}
      <div className="px-3 pb-2">
        <ExploreSearchBar
          value={inputValue}
          onChange={onInputChange}
          onSubmit={onSearch}
          placeholder="학원명, 과목, 동네"
          size="sm"
        />
      </div>

      {/* 과목 칩 */}
      <div className="px-3 pb-2">
        <SubjectChips value={subject} onChange={onSubjectChange} size="sm" />
      </div>

      {/* 결과 수 + 정렬 */}
      <div className="border-b border-[var(--color-border)] px-4 py-1.5">
        <ResultsHeader
          count={sorted.length}
          keyword={keyword}
          sortKey={sortKey}
          onSortChange={onSortChange}
          size="sm"
          rightSlot={
            hasFilter ? (
              <button
                onClick={onClear}
                className="text-[11px] text-[var(--color-text-tertiary)] underline"
              >
                초기화
              </button>
            ) : null
          }
        />
      </div>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto">
        <AcademyList
          items={sorted}
          limit={60}
          hasFilter={hasFilter}
          onSelect={onSelect}
          onClear={onClear}
        />
      </div>
    </div>
  );
}
