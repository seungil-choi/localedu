"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { findAcademy } from "@/lib/mock";
import { Thumb } from "@/components/Thumb";
import { Stars } from "@/components/Stars";
import { formatDistance, formatMonthly } from "@/lib/format";
import type { Academy } from "@/lib/types";

/**
 * MVP 저장함:
 * - 단순 리스트 (폴더 / 다중 선택 / 비슷한 학원 추천은 Phase 2)
 * - 비교함 위젯만 유지 (즉시 행동 유도)
 * - 카드 액션: 비교 추가 / 삭제만
 */

type Tab = "saved" | "recent";
type SortKey = "recent" | "rating" | "price";

export function SavedClient() {
  const savedIds = useAppStore((s) => s.savedIds);
  const recentIds = useAppStore((s) => s.recentIds);
  const compareIds = useAppStore((s) => s.compareIds);
  const removeCompare = useAppStore((s) => s.removeCompare);

  const [tab, setTab] = useState<Tab>("saved");
  const [sortKey, setSortKey] = useState<SortKey>("recent");

  const items = useMemo(() => {
    const ids = tab === "saved" ? savedIds : recentIds;
    let arr = ids.map(findAcademy).filter((x): x is Academy => Boolean(x));
    if (sortKey === "rating") arr = [...arr].sort((a, b) => b.rating - a.rating);
    else if (sortKey === "price")
      arr = [...arr].sort((a, b) => a.monthly_price - b.monthly_price);
    return arr;
  }, [tab, savedIds, recentIds, sortKey]);

  const compareItems = compareIds.map(findAcademy).filter(Boolean) as Academy[];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
      <h1 className="text-[24px] font-bold">
        저장한 학원{" "}
        <span className="text-[var(--color-primary)]">{savedIds.length}곳</span>
      </h1>
      <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
        관심 있는 학원을 저장하고 비교해보세요.
      </p>

      <div className="mt-4 flex border-b border-[var(--color-border)]">
        {(
          [
            { v: "saved" as const, l: "관심 학원", c: savedIds.length },
            { v: "recent" as const, l: "최근 본 학원", c: recentIds.length },
          ]
        ).map((t) => (
          <button
            key={t.v}
            onClick={() => setTab(t.v)}
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

      <div className="mt-5 grid grid-cols-12 gap-5">
        {/* 좌측 본문 */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          {/* 정렬만 */}
          <div className="flex items-center justify-end">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-[12.5px]"
            >
              <option value="recent">최신 저장순</option>
              <option value="rating">평점순</option>
              <option value="price">가격순</option>
            </select>
          </div>

          {items.length === 0 ? (
            <Empty tab={tab} />
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {items.map((a) => (
                <SavedRow key={a.id} academy={a} />
              ))}
            </ul>
          )}
        </div>

        {/* 우측: 비교함 위젯만 (Phase 2: 비슷한 학원 추가) */}
        <aside className="col-span-12 flex flex-col gap-4 lg:col-span-4 xl:col-span-3">
          {compareItems.length > 0 ? (
            <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-bold">비교함 담긴 학원</h3>
                <Link
                  href="/compare"
                  className="text-[11.5px] text-[var(--color-primary)] hover:underline"
                >
                  비교함 ›
                </Link>
              </div>
              <div className="mt-3 flex flex-col gap-1.5">
                {compareItems.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-white p-1.5"
                  >
                    <span className="h-7 w-9 shrink-0 overflow-hidden rounded">
                      <Thumb subject={c.subject} name={c.name} ratio="4/3" rounded="rounded" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium">
                      {c.name}
                    </span>
                    <button
                      aria-label="제거"
                      onClick={() => removeCompare(c.id)}
                      className="grid h-6 w-6 place-items-center rounded text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-soft)]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <Link
                href="/compare"
                className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-[13px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
              >
                비교하기 ({compareItems.length})
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--color-border-strong)] bg-white p-4 text-center">
              <p className="text-[13px] font-semibold">아직 비교함이 비어있어요</p>
              <p className="mt-1 text-[12px] text-[var(--color-text-secondary)]">
                저장한 학원에서 <b>“비교 추가”</b>를 눌러보세요.
              </p>
            </div>
          )}

          {/* 도움 안내 — 100명 초기엔 빈 사이드바보다 가이드가 낫다 */}
          <div className="rounded-xl bg-[var(--color-bg-soft)] p-4 text-[12.5px] leading-relaxed text-[var(--color-text-secondary)]">
            💡 <b>저장함</b>은 후보 학원을 묶어두는 공간이에요.
            <br />
            여기서 마음에 드는 2~3곳을 골라
            <br />
            <Link href="/compare" className="font-semibold text-[var(--color-primary)] underline">
              비교함
            </Link>
            에서 차이를 확인해보세요.
          </div>
        </aside>
      </div>
    </div>
  );
}

function SavedRow({ academy: a }: { academy: Academy }) {
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const inCompare = useAppStore((s) => s.compareIds.includes(a.id));
  return (
    <li className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3">
      <Link href={`/academy/${a.id}`} className="block w-[120px] shrink-0">
        <Thumb subject={a.subject} name={a.name} ratio="4/3" rounded="rounded-lg" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/academy/${a.id}`}
            className="truncate text-[15px] font-semibold hover:underline"
          >
            {a.name}
          </Link>
          {a.certified && (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-[var(--color-primary-soft)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--color-primary)]">
              🛡 인증 학원
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
            .slice(0, 3)
            .map((c) => (
              <span
                key={c}
                className="rounded-md bg-[var(--color-bg-muted)] px-1.5 py-0.5 text-[11px] text-[var(--color-text-secondary)]"
              >
                {c}
              </span>
            ))}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-[14px] font-bold">{formatMonthly(a.monthly_price)}</span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          onClick={() => toggleCompare(a.id)}
          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-[12.5px] font-medium ${
            inCompare
              ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
              : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          }`}
        >
          {inCompare ? "✓ 비교됨" : "⇆ 비교 추가"}
        </button>
        <button
          onClick={() => toggleSaved(a.id)}
          aria-label="삭제"
          className="grid h-9 w-9 place-items-center rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"
        >
          🗑
        </button>
      </div>
    </li>
  );
}

function Empty({ tab }: { tab: Tab }) {
  return (
    <div className="mt-5 grid place-items-center rounded-xl border border-dashed border-[var(--color-border)] bg-white py-16 text-center">
      <div className="text-3xl">{tab === "saved" ? "🔖" : "🕘"}</div>
      <h2 className="mt-3 text-[16px] font-semibold">
        {tab === "saved" ? "저장한 학원이 없어요" : "최근 본 학원이 없어요"}
      </h2>
      <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
        지도에서 마음에 드는 학원을 저장해보세요.
      </p>
      <Link
        href="/explore"
        className="mt-4 inline-flex rounded-lg bg-[var(--color-primary)] px-4 py-2 text-[13px] font-semibold text-white"
      >
        지도 탐색으로 가기 →
      </Link>
    </div>
  );
}
