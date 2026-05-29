"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { findAcademy } from "@/lib/mock";
import { Thumb } from "@/components/Thumb";
import { Stars } from "@/components/Stars";
import { Icon } from "@/components/Icon";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDistance, formatMonthly } from "@/lib/format";
import type { Academy } from "@/lib/types";

/**
 * 보관함 (구 저장함 + 비교함 통합).
 *
 * - 2탭: 관심 학원 / 최근 본
 * - "선택" 모드 진입 시 카드에 체크박스 노출
 * - 2~3개 선택 → 하단 플로팅 "비교하기" 버튼 → /compare?ids=a,b,c
 *
 * 비교는 영속 상태가 아니라 URL 파라미터로 전달되는 세션 모드.
 */

type Tab = "saved" | "recent";
type SortKey = "recent" | "rating" | "price";

const MAX_COMPARE = 3;

export function SavedClient() {
  const router = useRouter();
  const savedIds = useAppStore((s) => s.savedIds);
  const recentIds = useAppStore((s) => s.recentIds);

  const [tab, setTab] = useState<Tab>("saved");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const items = useMemo(() => {
    const ids = tab === "saved" ? savedIds : recentIds;
    let arr = ids.map(findAcademy).filter((x): x is Academy => Boolean(x));
    if (sortKey === "rating") arr = [...arr].sort((a, b) => b.rating - a.rating);
    else if (sortKey === "price")
      arr = [...arr].sort((a, b) => a.monthly_price - b.monthly_price);
    return arr;
  }, [tab, savedIds, recentIds, sortKey]);

  function enterSelectMode() {
    setSelectMode(true);
    setSelectedIds(new Set());
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  function toggleSelected(id: string) {
    setSelectedIds((cur) => {
      const next = new Set(cur);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_COMPARE) {
        next.add(id);
      }
      return next;
    });
  }

  function startCompare() {
    if (selectedIds.size < 2) return;
    const ids = Array.from(selectedIds).join(",");
    router.push(`/compare?ids=${encodeURIComponent(ids)}`);
  }

  const canCompare = selectedIds.size >= 2;
  const selectCount = selectedIds.size;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 pb-32 md:px-6 md:pb-12">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-bold">
            보관함{" "}
            <span className="text-[var(--color-primary)]">{savedIds.length}곳</span>
          </h1>
          <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
            관심 학원을 저장하고, 2~3곳을 골라 비교해보세요.
          </p>
        </div>
        {tab === "saved" && items.length > 0 && (
          <button
            onClick={selectMode ? exitSelectMode : enterSelectMode}
            className={`shrink-0 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition ${
              selectMode
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
            }`}
          >
            {selectMode ? "취소" : "비교할 학원 선택"}
          </button>
        )}
      </div>

      {/* 탭 */}
      <div className="mt-4 flex border-b border-[var(--color-border)]">
        {(
          [
            { v: "saved" as const, l: "관심 학원", c: savedIds.length },
            { v: "recent" as const, l: "최근 본 학원", c: recentIds.length },
          ]
        ).map((t) => (
          <button
            key={t.v}
            onClick={() => {
              setTab(t.v);
              exitSelectMode();
            }}
            className={`relative px-4 py-2.5 text-[14px] font-medium ${
              tab === t.v
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            {t.l}
            <span className="ml-1 text-[12px] text-[var(--color-text-tertiary)]">
              {t.c}
            </span>
            {tab === t.v && (
              <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[var(--color-primary)]" />
            )}
          </button>
        ))}
      </div>

      {/* 선택 모드 안내 */}
      {selectMode && (
        <div className="mt-3 rounded-lg bg-[var(--color-primary-soft)] px-4 py-2.5 text-[12.5px] text-[var(--color-primary)]">
          비교할 학원을 <b>2~3개</b> 선택해주세요. ({selectCount}/{MAX_COMPARE})
        </div>
      )}

      {/* 정렬 */}
      <div className="mt-4 flex items-center justify-end">
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          aria-label="정렬 기준"
          className="rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-[12.5px]"
        >
          <option value="recent">최신 저장순</option>
          <option value="rating">평점순</option>
          <option value="price">가격순</option>
        </select>
      </div>

      {/* 목록 */}
      {items.length === 0 ? (
        <Empty tab={tab} />
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {items.map((a) => (
            <SavedRow
              key={a.id}
              academy={a}
              selectMode={selectMode}
              selected={selectedIds.has(a.id)}
              selectionFull={selectedIds.size >= MAX_COMPARE && !selectedIds.has(a.id)}
              onSelect={() => toggleSelected(a.id)}
            />
          ))}
        </ul>
      )}

      {/* 다중 선택 비교 플로팅 바 (모바일 + 데스크탑) */}
      {selectMode && selectCount > 0 && (
        <CompareFloatingBar
          count={selectCount}
          canCompare={canCompare}
          onCompare={startCompare}
          onCancel={exitSelectMode}
        />
      )}
    </div>
  );
}

/* ──── 한 줄 카드 ──── */

interface RowProps {
  academy: Academy;
  selectMode: boolean;
  selected: boolean;
  selectionFull: boolean;
  onSelect: () => void;
}

function SavedRow({ academy: a, selectMode, selected, selectionFull, onSelect }: RowProps) {
  const toggleSaved = useAppStore((s) => s.toggleSaved);

  const handleClick = () => {
    if (selectMode && !selectionFull) onSelect();
  };

  return (
    <li
      onClick={selectMode ? handleClick : undefined}
      className={`flex items-center gap-3 rounded-xl border p-3 transition ${
        selectMode
          ? selectionFull
            ? "cursor-not-allowed border-[var(--color-border)] bg-[var(--color-bg-soft)] opacity-60"
            : "cursor-pointer border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]"
          : "border-[var(--color-border)] bg-white"
      } ${selected ? "!border-[var(--color-primary)] bg-[var(--color-primary-soft)]/30" : ""}`}
    >
      {selectMode && (
        <span
          aria-hidden
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 ${
            selected
              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
              : "border-[var(--color-border-strong)] bg-white"
          }`}
        >
          {selected && <Icon name="check" size={14} />}
        </span>
      )}

      <Link
        href={`/academy/${a.id}`}
        className="block w-[100px] shrink-0 sm:w-[120px]"
        onClick={(e) => selectMode && e.preventDefault()}
      >
        <Thumb subject={a.subject} name={a.name} ratio="4/3" rounded="rounded-lg" />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/academy/${a.id}`}
            onClick={(e) => selectMode && e.preventDefault()}
            className="truncate text-[15px] font-semibold hover:underline"
          >
            {a.name}
          </Link>
          {a.certified && (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-[var(--color-primary-soft)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--color-primary)]">
              <Icon name="shield" size={10} /> 인증
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-2 text-[12.5px]">
          <Stars rating={a.rating} size={12} showCount count={a.review_count} />
          <span className="text-[var(--color-text-tertiary)]">
            · {formatDistance(a.distance_km)}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap gap-1">
          {Array.from(
            new Set([
              a.age_groups.join("·"),
              `${a.subject} 전문`,
              ...a.meta.features,
            ]),
          )
            .slice(0, 2)
            .map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-[14px] font-bold">{formatMonthly(a.monthly_price)}</span>
        {!selectMode && (
          <button
            onClick={() => toggleSaved(a.id)}
            aria-label="저장 해제"
            className="grid h-9 w-9 place-items-center rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"
          >
            <Icon name="trash" size={15} />
          </button>
        )}
      </div>
    </li>
  );
}

/* ──── 다중 선택 시 비교하기 플로팅 바 ──── */

function CompareFloatingBar({
  count,
  canCompare,
  onCompare,
  onCancel,
}: {
  count: number;
  canCompare: boolean;
  onCompare: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed left-1/2 z-30 w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
      style={{ bottom: "calc(var(--mobile-bottom-tab-h) + 1rem)" }}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onCancel}
          aria-label="선택 모드 종료"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-soft)]"
        >
          <Icon name="close" size={16} />
        </button>
        <button
          onClick={onCompare}
          disabled={!canCompare}
          className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="compare" size={16} />
          비교하기 ({count}/{MAX_COMPARE})
        </button>
      </div>
      {!canCompare && (
        <p className="mt-2 text-center text-[11.5px] text-[var(--color-text-tertiary)]">
          최소 2곳을 선택해주세요.
        </p>
      )}
    </div>
  );
}

/* ──── 빈 상태 ──── */

function Empty({ tab }: { tab: Tab }) {
  return (
    <div className="mt-5">
      <EmptyState
        icon={tab === "saved" ? "bookmark" : "clock"}
        title={tab === "saved" ? "저장한 학원이 없어요" : "최근 본 학원이 없어요"}
        description="지도에서 마음에 드는 학원을 저장해보세요."
        action={
          <Link
            href="/explore"
            className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
          >
            지도 탐색으로 가기
            <Icon name="forward" size={12} />
          </Link>
        }
      />
    </div>
  );
}
