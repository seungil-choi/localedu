"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ACADEMIES_WITH_RATINGS as ACADEMIES, findAcademy } from "@/lib/mock";
import { MapView } from "@/components/MapView";
import { AcademyCard } from "@/components/AcademyCard";
import { Icon } from "@/components/Icon";
import { CompareBar } from "./CompareBar";
import { AcademyPanel } from "./AcademyPanel";
import { useAppStore } from "@/store/useAppStore";
import type { Academy, Subject } from "@/lib/types";

const SUBJECTS: Subject[] = ["수학", "영어", "국어", "과학", "사회", "예체능", "코딩"];
const SORT_OPTIONS = [
  { value: "recommend", label: "추천순" },
  { value: "rating",    label: "평점순" },
  { value: "distance",  label: "거리순" },
  { value: "price",     label: "가격순" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

function applyFilter(
  list: Academy[],
  keyword: string,
  subject: Subject | "전체",
  f: ReturnType<typeof useAppStore.getState>["filter"],
) {
  const kw = keyword.trim().toLowerCase();
  return list.filter((a) => {
    // 키워드 검색 — 학원명, 동, 과목
    if (kw) {
      const match =
        a.name.toLowerCase().includes(kw) ||
        a.dong.toLowerCase().includes(kw) ||
        a.subject.toLowerCase().includes(kw) ||
        a.address.toLowerCase().includes(kw);
      if (!match) return false;
    }
    // 과목 필터
    if (subject !== "전체" && a.subject !== subject) return false;
    // 스토어 필터
    if (f.region !== "전체" && a.region !== f.region) return false;
    if (f.ageGroup !== "전체" && !a.age_groups.includes(f.ageGroup)) return false;
    if (f.distanceKm > 0 && (a.distance_km ?? 99) > f.distanceKm) return false;
    if (f.priceMax > 0 && a.monthly_price > 0 && a.monthly_price > f.priceMax)
      return false;
    if (
      f.teachingStyle !== "전체" &&
      !a.meta.teaching_style.includes(f.teachingStyle)
    )
      return false;
    if (f.homework !== "전체" && a.meta.homework_level !== f.homework) return false;
    return true;
  });
}

function inBounds(a: Academy, b: Bounds | null): boolean {
  if (!b) return true;
  return a.lat <= b.north && a.lat >= b.south && a.lng <= b.east && a.lng >= b.west;
}

export function ExploreClient({
  initialQ = "",
  initialSubject = "",
}: {
  initialQ?: string;
  initialSubject?: string;
}) {
  const initQ = initialQ;
  const initSubject = (SUBJECTS.includes(initialSubject as Subject) ? initialSubject : "전체") as Subject | "전체";

  const filter = useAppStore((s) => s.filter);
  const router = useRouter();

  const [keyword, setKeyword] = useState(initQ);
  const [inputValue, setInputValue] = useState(initQ);
  const [subject, setSubject] = useState<Subject | "전체">(initSubject);
  const [sortKey, setSortKey] = useState<SortKey>("recommend");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [activeBounds, setActiveBounds] = useState<Bounds | null>(null);
  const [boundsDirty, setBoundsDirty] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => applyFilter(ACADEMIES, keyword, subject, filter),
    [keyword, subject, filter],
  );

  const visible = useMemo(
    () => (activeBounds ? filtered.filter((a) => inBounds(a, activeBounds)) : filtered),
    [filtered, activeBounds],
  );

  const sorted = useMemo(() => {
    const arr = [...visible];
    switch (sortKey) {
      case "rating":   return arr.sort((a, b) => b.rating - a.rating);
      case "distance": return arr.sort((a, b) => (a.distance_km ?? 0) - (b.distance_km ?? 0));
      case "price":    return arr.sort((a, b) => (a.monthly_price || 9999999) - (b.monthly_price || 9999999));
      default:         return arr.sort((a, b) => b.compare_count - a.compare_count);
    }
  }, [visible, sortKey]);

  function handleBoundsChange(b: Bounds) {
    setBounds(b);
    if (!activeBounds) {
      setActiveBounds(b);
    } else if (
      Math.abs(b.north - activeBounds.north) > 0.001 ||
      Math.abs(b.south - activeBounds.south) > 0.001 ||
      Math.abs(b.east - activeBounds.east) > 0.001 ||
      Math.abs(b.west - activeBounds.west) > 0.001
    ) {
      setBoundsDirty(true);
    }
  }

  function refreshBounds() {
    if (bounds) setActiveBounds(bounds);
    setBoundsDirty(false);
  }

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setKeyword(inputValue);
    setSelectedId(null);
  }

  function handleSubject(s: Subject | "전체") {
    setSubject(s);
    setSelectedId(null);
  }

  const selectedAcademy = selectedId ? findAcademy(selectedId) ?? null : null;

  return (
    <div className="relative flex h-[calc(100vh-57px)] flex-col">
      <div className="flex flex-1 min-h-0">
        {/* ── 좌측 단일 패널 (Naver Maps 스타일) ── */}
        <aside className="hidden h-full w-[380px] shrink-0 flex-col border-r border-[var(--color-border)] bg-white md:flex">

          {/* ① 검색바 */}
          <form onSubmit={handleSearch} className="border-b border-[var(--color-border)] p-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Icon
                  name="search"
                  size={15}
                  color="var(--color-text-tertiary)"
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="학원명, 과목, 동네 검색"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-soft)] py-2 pl-9 pr-3 text-[13.5px] outline-none focus:border-[var(--color-primary)] focus:bg-white"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => { setInputValue(""); setKeyword(""); inputRef.current?.focus(); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                  >
                    <Icon name="close" size={14} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-[var(--color-primary)] px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
              >
                검색
              </button>
            </div>
          </form>

          {/* ② 과목 필터 칩 */}
          <div className="border-b border-[var(--color-border)] px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {(["전체", ...SUBJECTS] as (Subject | "전체")[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSubject(s)}
                  className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap transition ${
                    subject === s
                      ? "bg-[var(--color-primary)] text-white"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ③ 결과 수 + 정렬 */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
            <div className="text-[12.5px] text-[var(--color-text-secondary)]">
              <span className="font-bold text-[var(--color-text-primary)]">{sorted.length}</span>
              <span>개</span>
              {keyword && (
                <span className="ml-1 text-[var(--color-primary)]">"{keyword}"</span>
              )}
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-md border border-[var(--color-border)] bg-white px-2 py-1 text-[12px] outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* ④ 학원 목록 (스크롤) */}
          <div className="flex-1 overflow-y-auto">
            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <Icon name="search" size={32} color="var(--color-border-strong)" />
                <p className="text-[14px] font-semibold text-[var(--color-text-secondary)]">검색 결과가 없어요</p>
                <p className="text-[12px] text-[var(--color-text-tertiary)]">다른 키워드나 과목으로 검색해보세요</p>
                {(keyword || subject !== "전체") && (
                  <button
                    onClick={() => { setKeyword(""); setInputValue(""); setSubject("전체"); }}
                    className="mt-2 rounded-lg border border-[var(--color-border)] px-4 py-1.5 text-[12.5px] font-medium hover:bg-[var(--color-bg-soft)]"
                  >
                    필터 초기화
                  </button>
                )}
              </div>
            ) : (
              <ul>
                {sorted.slice(0, 120).map((a) => (
                  <li key={a.id}>
                    <AcademyCard
                      academy={a}
                      variant="compact"
                      highlighted={hoveredId === a.id || selectedId === a.id}
                      onMouseEnter={() => setHoveredId(a.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => setSelectedId(a.id)}
                      showCompareButton={false}
                    />
                  </li>
                ))}
                {sorted.length > 120 && (
                  <li className="border-b border-[var(--color-border)] bg-[var(--color-bg-soft)] py-3 text-center text-[12px] text-[var(--color-text-tertiary)]">
                    지도를 좁히면 더 정확한 결과를 볼 수 있어요
                  </li>
                )}
              </ul>
            )}
          </div>
        </aside>

        {/* ── 우측 지도 ── */}
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

      {/* 사이드 패널 (마커 클릭 시) */}
      <AcademyPanel
        academy={selectedAcademy}
        onClose={() => setSelectedId(null)}
      />

      {/* 모바일 하단 시트 */}
      <div className="md:hidden">
        <MobileSheet
          sorted={sorted}
          keyword={keyword}
          inputValue={inputValue}
          subject={subject}
          sortKey={sortKey}
          onInputChange={setInputValue}
          onSearch={() => handleSearch()}
          onSubjectChange={handleSubject}
          onSortChange={setSortKey}
          onSelect={setSelectedId}
          onClear={() => { setKeyword(""); setInputValue(""); setSubject("전체"); }}
        />
      </div>

      <CompareBar />
    </div>
  );
}

/* ──── 모바일 하단 시트 ──── */
function MobileSheet({
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
}: {
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
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`fixed bottom-16 left-0 right-0 z-20 flex flex-col rounded-t-2xl border-t border-[var(--color-border)] bg-white shadow-[0_-8px_24px_rgba(0,0,0,.08)] transition-all duration-300 ${
        expanded ? "h-[70vh]" : "h-[45vh]"
      }`}
    >
      {/* 드래그 핸들 */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full flex-col items-center py-2"
        aria-label={expanded ? "접기" : "펼치기"}
      >
        <div className="h-1 w-10 rounded-full bg-[var(--color-border-strong)]" />
      </button>

      {/* 검색바 */}
      <div className="flex gap-2 px-3 pb-2">
        <div className="relative flex-1">
          <Icon name="search" size={14} color="var(--color-text-tertiary)" className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="학원명, 과목, 동네"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-soft)] py-2 pl-8 pr-3 text-[13px] outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        <button
          onClick={onSearch}
          className="shrink-0 rounded-lg bg-[var(--color-primary)] px-3 text-[13px] font-semibold text-white"
        >
          검색
        </button>
      </div>

      {/* 과목 칩 */}
      <div className="flex gap-1.5 overflow-x-auto px-3 pb-2 scrollbar-none">
        {(["전체", ...SUBJECTS] as (Subject | "전체")[]).map((s) => (
          <button
            key={s}
            onClick={() => onSubjectChange(s)}
            className={`shrink-0 rounded-full px-3 py-1 text-[11.5px] font-semibold whitespace-nowrap ${
              subject === s
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 결과 수 + 정렬 */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-1.5">
        <div className="text-[12px] text-[var(--color-text-secondary)]">
          <b className="text-[var(--color-text-primary)]">{sorted.length}</b>개
          {keyword && <span className="ml-1 text-[var(--color-primary)]">"{keyword}"</span>}
        </div>
        <div className="flex items-center gap-2">
          {(keyword || subject !== "전체") && (
            <button onClick={onClear} className="text-[11px] text-[var(--color-text-tertiary)] underline">
              초기화
            </button>
          )}
          <select
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="rounded border border-[var(--color-border)] bg-white px-2 py-0.5 text-[11.5px]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 목록 */}
      <ul className="flex-1 overflow-y-auto">
        {sorted.slice(0, 60).map((a) => (
          <li key={a.id}>
            <AcademyCard
              academy={a}
              variant="compact"
              onClick={() => onSelect(a.id)}
              showCompareButton={false}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
