"use client";

import { useState } from "react";
import { ACADEMIES_WITH_RATINGS as ACADEMIES, findAcademy } from "@/lib/mock";
import { MapView } from "@/components/MapView";
import type { Subject } from "@/lib/types";
import { AcademyPanel } from "./AcademyPanel";
import { CompareBar } from "./CompareBar";
import { DesktopPanel } from "./DesktopPanel";
import { MobileSheet } from "./MobileSheet";
import { SUBJECTS } from "./SubjectChips";
import type { SortKey } from "./SortSelect";
import { useFilteredAcademies, type Bounds } from "./useFilteredAcademies";

interface Props {
  initialQ?: string;
  initialSubject?: string;
}

/**
 * Explore 페이지 컨테이너.
 *
 * 책임:
 *   - 검색/과목/정렬/선택 상태 보관
 *   - boundary 상태 (지도 이동 시 갱신, "이 영역에서 다시 검색" 트리거)
 *   - 자식 컴포넌트(DesktopPanel/MobileSheet/MapView/AcademyPanel)에 데이터 + 콜백 전달
 *
 * 모든 UI는 자식에 위임. 필터링 로직은 useFilteredAcademies 훅으로 분리.
 */
export function ExploreClient({ initialQ = "", initialSubject = "" }: Props) {
  const initSubject = (
    SUBJECTS.includes(initialSubject as Subject) ? initialSubject : "전체"
  ) as Subject | "전체";

  const [keyword, setKeyword] = useState(initialQ);
  const [inputValue, setInputValue] = useState(initialQ);
  const [subject, setSubject] = useState<Subject | "전체">(initSubject);
  const [sortKey, setSortKey] = useState<SortKey>("recommend");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [activeBounds, setActiveBounds] = useState<Bounds | null>(null);
  const [boundsDirty, setBoundsDirty] = useState(false);

  const { filtered, visible, sorted } = useFilteredAcademies({
    source: ACADEMIES,
    keyword,
    subject,
    sortKey,
    activeBounds,
  });

  function handleBoundsChange(b: Bounds) {
    setBounds(b);
    if (!activeBounds) {
      setActiveBounds(b);
      return;
    }
    const moved =
      Math.abs(b.north - activeBounds.north) > 0.001 ||
      Math.abs(b.south - activeBounds.south) > 0.001 ||
      Math.abs(b.east - activeBounds.east) > 0.001 ||
      Math.abs(b.west - activeBounds.west) > 0.001;
    if (moved) setBoundsDirty(true);
  }

  function refreshBounds() {
    if (bounds) setActiveBounds(bounds);
    setBoundsDirty(false);
  }

  function handleSearch() {
    setKeyword(inputValue);
    setSelectedId(null);
  }

  function handleSubject(s: Subject | "전체") {
    setSubject(s);
    setSelectedId(null);
  }

  function handleClear() {
    setKeyword("");
    setInputValue("");
    setSubject("전체");
  }

  const selectedAcademy = selectedId ? (findAcademy(selectedId) ?? null) : null;

  return (
    <div className="relative flex h-[calc(100vh-57px)] flex-col">
      <div className="flex min-h-0 flex-1">
        <DesktopPanel
          sorted={sorted}
          keyword={keyword}
          inputValue={inputValue}
          subject={subject}
          sortKey={sortKey}
          hoveredId={hoveredId}
          selectedId={selectedId}
          onInputChange={setInputValue}
          onSearch={handleSearch}
          onSubjectChange={handleSubject}
          onSortChange={setSortKey}
          onSelect={setSelectedId}
          onHover={setHoveredId}
          onClear={handleClear}
        />

        <div className="relative flex-1">
          <MapView
            academies={filtered}
            selectedId={selectedId ?? hoveredId}
            onSelect={setSelectedId}
            onBoundsChange={handleBoundsChange}
            showRefreshButton={boundsDirty}
            onRefresh={refreshBounds}
            resultCount={visible.length}
            height="100%"
          />
        </div>
      </div>

      <AcademyPanel academy={selectedAcademy} onClose={() => setSelectedId(null)} />

      <div className="md:hidden">
        <MobileSheet
          sorted={sorted}
          keyword={keyword}
          inputValue={inputValue}
          subject={subject}
          sortKey={sortKey}
          onInputChange={setInputValue}
          onSearch={handleSearch}
          onSubjectChange={handleSubject}
          onSortChange={setSortKey}
          onSelect={setSelectedId}
          onClear={handleClear}
        />
      </div>

      <CompareBar />
    </div>
  );
}
