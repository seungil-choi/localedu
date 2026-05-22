"use client";

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
  hoveredId: string | null;
  selectedId: string | null;
  onInputChange: (v: string) => void;
  onSearch: () => void;
  onSubjectChange: (s: Subject | "전체") => void;
  onSortChange: (k: SortKey) => void;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onClear: () => void;
}

/**
 * Explore 데스크탑 좌측 패널 — Naver Maps 스타일.
 *
 * 구성 (위 → 아래):
 *   1. 검색 입력
 *   2. 과목 필터 칩
 *   3. 결과 수 + 정렬
 *   4. 학원 목록 (스크롤)
 */
export function DesktopPanel({
  sorted,
  keyword,
  inputValue,
  subject,
  sortKey,
  hoveredId,
  selectedId,
  onInputChange,
  onSearch,
  onSubjectChange,
  onSortChange,
  onSelect,
  onHover,
  onClear,
}: Props) {
  const hasFilter = Boolean(keyword) || subject !== "전체";

  return (
    <aside className="hidden h-full w-[380px] shrink-0 flex-col border-r border-[var(--color-border)] bg-white md:flex">
      <div className="border-b border-[var(--color-border)] p-3">
        <ExploreSearchBar value={inputValue} onChange={onInputChange} onSubmit={onSearch} />
      </div>
      <div className="border-b border-[var(--color-border)] px-3 py-2">
        <SubjectChips value={subject} onChange={onSubjectChange} />
      </div>
      <div className="border-b border-[var(--color-border)] px-4 py-2">
        <ResultsHeader
          count={sorted.length}
          keyword={keyword}
          sortKey={sortKey}
          onSortChange={onSortChange}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <AcademyList
          items={sorted}
          hoveredId={hoveredId}
          selectedId={selectedId}
          hasFilter={hasFilter}
          onSelect={onSelect}
          onHover={onHover}
          onClear={onClear}
        />
      </div>
    </aside>
  );
}
