import { useMemo } from "react";
import type { Academy, Subject } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import type { SortKey } from "./SortSelect";

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

type FilterState = ReturnType<typeof useAppStore.getState>["filter"];

function matchesKeyword(a: Academy, kw: string): boolean {
  if (!kw) return true;
  return (
    a.name.toLowerCase().includes(kw) ||
    a.dong.toLowerCase().includes(kw) ||
    a.subject.toLowerCase().includes(kw) ||
    a.address.toLowerCase().includes(kw)
  );
}

function matchesStoreFilter(a: Academy, f: FilterState): boolean {
  if (f.region !== "전체" && a.region !== f.region) return false;
  if (f.ageGroup !== "전체" && !a.age_groups.includes(f.ageGroup)) return false;
  if (f.distanceKm > 0 && (a.distance_km ?? 99) > f.distanceKm) return false;
  if (f.priceMax > 0 && a.monthly_price > 0 && a.monthly_price > f.priceMax) return false;
  if (
    f.teachingStyle !== "전체" &&
    !a.meta.teaching_style.includes(f.teachingStyle)
  ) {
    return false;
  }
  if (f.homework !== "전체" && a.meta.homework_level !== f.homework) return false;
  return true;
}

function inBounds(a: Academy, b: Bounds | null): boolean {
  if (!b) return true;
  return a.lat <= b.north && a.lat >= b.south && a.lng <= b.east && a.lng >= b.west;
}

function compareBy(key: SortKey) {
  return (a: Academy, b: Academy) => {
    switch (key) {
      case "rating":
        return b.rating - a.rating;
      case "distance":
        return (a.distance_km ?? 0) - (b.distance_km ?? 0);
      case "price":
        return (a.monthly_price || 9_999_999) - (b.monthly_price || 9_999_999);
      default:
        return b.compare_count - a.compare_count;
    }
  };
}

interface Params {
  source: Academy[];
  keyword: string;
  subject: Subject | "전체";
  sortKey: SortKey;
  activeBounds: Bounds | null;
}

/**
 * Explore 페이지 필터링/정렬 파이프라인.
 *
 * 단계:
 *   1. 키워드 + 과목 + 스토어 필터(지역·나이대·거리·가격·수업스타일·숙제) 적용 → `filtered`
 *   2. 지도 boundary 적용 → `visible`
 *   3. 정렬 → `sorted`
 */
export function useFilteredAcademies({ source, keyword, subject, sortKey, activeBounds }: Params) {
  const storeFilter = useAppStore((s) => s.filter);
  const kw = keyword.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      source.filter(
        (a) =>
          matchesKeyword(a, kw) &&
          (subject === "전체" || a.subject === subject) &&
          matchesStoreFilter(a, storeFilter),
      ),
    [source, kw, subject, storeFilter],
  );

  const visible = useMemo(
    () => (activeBounds ? filtered.filter((a) => inBounds(a, activeBounds)) : filtered),
    [filtered, activeBounds],
  );

  const sorted = useMemo(
    () => [...visible].sort(compareBy(sortKey)),
    [visible, sortKey],
  );

  return { filtered, visible, sorted };
}
