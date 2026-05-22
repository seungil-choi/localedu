"use client";

import Link from "next/link";
import type { Academy } from "@/lib/types";
import { Thumb } from "./Thumb";
import { Stars } from "./Stars";
import { Icon } from "./Icon";
import { Chip } from "./ui/Chip";
import { formatDistance, formatMonthly } from "@/lib/format";
import { useAppStore } from "@/store/useAppStore";

/**
 * 학원 카드 variants
 *   - "grid" (default): 썸네일 위 + 정보 아래 — 홈/상세/저장함의 메인 카드
 *   - "list": grid와 동일 (의미 alias — 호출부 의도 명시용)
 *   - "compact": 부동산 사이드 패널 한 줄 카드 — Explore 목록
 */
interface Props {
  academy: Academy;
  rank?: number;
  variant?: "grid" | "list" | "compact";
  showCompareButton?: boolean;
  /** compact variant: 활성화 (선택된 마커 또는 호버) */
  highlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

export function AcademyCard({
  academy: a,
  rank,
  variant = "grid",
  showCompareButton = true,
  highlighted = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: Props) {
  const compareIds = useAppStore((s) => s.compareIds);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const savedIds = useAppStore((s) => s.savedIds);
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const isCompared = compareIds.includes(a.id);
  const isSaved = savedIds.includes(a.id);
  const hasPrice = a.monthly_price > 0;

  /* ───────── compact: 부동산 사이드 리스트 한 줄 카드 ───────── */
  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`flex w-full gap-3 border-b border-[var(--color-border)] bg-white p-3 text-left transition hover:bg-[var(--color-bg-soft)] ${
          highlighted ? "bg-[var(--color-primary-soft)]/40" : ""
        }`}
      >
        <div className="w-[88px] shrink-0">
          <Thumb subject={a.subject} name={a.name} ratio="4/3" rounded="rounded-md" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[14px] font-semibold">{a.name}</span>
            <span className="shrink-0 rounded bg-[var(--color-primary-soft)] px-1.5 py-0.5 text-[10.5px] font-medium text-[var(--color-primary)]">
              {a.subject}
            </span>
            {a.certified && (
              <Icon name="shield" size={12} color="var(--color-primary)" />
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[12px]">
            {a.rating > 0 ? (
              <Stars rating={a.rating} size={12} showCount count={a.review_count} />
            ) : (
              <span className="text-[var(--color-text-tertiary)]">후기 준비 중</span>
            )}
            <span className="text-[var(--color-text-tertiary)]">
              · {a.dong} · {formatDistance(a.distance_km)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="text-[13px] font-semibold">
              {hasPrice ? formatMonthly(a.monthly_price) : "수강료 문의"}
            </span>
            <span className="flex items-center gap-1">
              <CompactAction
                active={isCompared}
                ariaLabel="비교"
                icon="compare"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompare(a.id);
                }}
              />
              <CompactAction
                active={isSaved}
                ariaLabel={isSaved ? "저장 해제" : "저장"}
                icon={isSaved ? "bookmark-filled" : "bookmark"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaved(a.id);
                }}
              />
            </span>
          </div>
        </div>
      </button>
    );
  }

  /* ───────── grid / list (기본 — 세로 카드) ───────── */
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
      <Link href={`/academy/${a.id}`} className="relative block">
        <Thumb subject={a.subject} name={a.name} rounded="rounded-none" />
        {rank !== undefined && (
          <span
            className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-md text-[12px] font-bold text-white"
            style={{ background: "var(--color-primary)" }}
          >
            {rank}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleSaved(a.id);
          }}
          aria-label={isSaved ? "저장 해제" : "저장"}
          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md bg-white/90 shadow-sm hover:bg-white"
          style={{
            color: isSaved
              ? "var(--color-primary)"
              : "var(--color-text-secondary)",
          }}
        >
          <Icon name={isSaved ? "bookmark-filled" : "bookmark"} size={14} />
        </button>
      </Link>

      <Link
        href={`/academy/${a.id}`}
        className="flex flex-1 flex-col gap-1.5 p-3"
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-semibold">{a.name}</span>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-[12px] text-[var(--color-text-tertiary)]">
            <Icon name="navigate" size={11} />
            {formatDistance(a.distance_km)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[13px]">
          {a.rating > 0 ? (
            <Stars rating={a.rating} showCount count={a.review_count} />
          ) : (
            <span className="text-[var(--color-text-tertiary)]">
              후기 준비 중
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {a.meta.features.slice(0, 2).map((f) => (
            <Chip key={f}>{f}</Chip>
          ))}
        </div>
        <div className="mt-auto pt-1 text-[14px] font-semibold">
          {hasPrice ? formatMonthly(a.monthly_price) : "수강료 문의"}
        </div>
      </Link>

      {showCompareButton && (
        <button
          type="button"
          onClick={() => toggleCompare(a.id)}
          className={`mx-3 mb-3 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border py-1.5 text-[13px] font-medium transition ${
            isCompared
              ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
              : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          }`}
        >
          <Icon name={isCompared ? "check" : "compare"} size={13} />
          {isCompared ? "비교됨" : "비교 추가"}
        </button>
      )}
    </div>
  );
}

function CompactAction({
  active,
  ariaLabel,
  icon,
  onClick,
}: {
  active: boolean;
  ariaLabel: string;
  icon: Parameters<typeof Icon>[0]["name"];
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <span
      role="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`grid h-7 w-7 cursor-pointer place-items-center rounded-md border ${
        active
          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
          : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
      }`}
    >
      <Icon name={icon} size={13} />
    </span>
  );
}
