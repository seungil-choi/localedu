"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAppStore, MAX_COMPARE_SLOTS } from "@/store/useAppStore";
import { ACADEMIES, findAcademy } from "@/lib/mock";
import type { Academy } from "@/lib/types";
import { Thumb } from "@/components/Thumb";
import { Stars } from "@/components/Stars";
import { InquiryDialog } from "@/components/InquiryDialog";
import { Icon } from "@/components/Icon";
import { formatDistance, formatMonthly } from "@/lib/format";

/**
 * MVP 비교함:
 * - 단일 표 (4탭/상세/위치/후기 비교는 Phase 2)
 * - 추천: "평점 1위" (자동 알고리즘 추천은 Phase 2)
 * - 메모, 링크 공유, 다축 점수는 Phase 2
 */

export function CompareClient() {
  const compareIds = useAppStore((s) => s.compareIds);
  const removeCompare = useAppStore((s) => s.removeCompare);
  const clearCompare = useAppStore((s) => s.clearCompare);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const [picker, setPicker] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const items = useMemo(
    () =>
      compareIds
        .map((id) => findAcademy(id))
        .filter((x): x is Academy => Boolean(x)),
    [compareIds],
  );

  const topRated = useMemo(
    () =>
      items.length === 0
        ? undefined
        : items.reduce((b, a) => (a.rating > b.rating ? a : b), items[0]),
    [items],
  );

  if (items.length === 0) {
    return <Empty />;
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
      {/* 헤더 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-[24px] font-bold">비교함</h1>
          <span className="rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-[12px] font-semibold text-[var(--color-primary)]">
            {items.length}개 학원 비교 중
          </span>
        </div>
        <p className="text-[13px] text-[var(--color-text-secondary)]">
          학원을 비교하고 우리 아이에게 맞는 학원을 선택해보세요.
        </p>
      </div>

      {/* 슬롯 + 추가 */}
      <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-4">
        {items.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white p-2"
          >
            <span className="h-9 w-12 shrink-0 overflow-hidden rounded">
              <Thumb subject={a.subject} name={a.name} ratio="4/3" rounded="rounded" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
              {a.name}
            </span>
            <button
              aria-label="제거"
              onClick={() => removeCompare(a.id)}
              className="grid h-7 w-7 place-items-center rounded-md text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-danger)]"
            >
              ✕
            </button>
          </div>
        ))}
        {items.length < MAX_COMPARE_SLOTS && (
          <button
            type="button"
            onClick={() => setPicker((v) => !v)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--color-border-strong)] bg-white px-3 py-2 text-[13px] font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            + 학원 추가
          </button>
        )}
      </div>

      {picker && (
        <div className="mt-2 rounded-xl border border-[var(--color-border)] bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[13px] font-semibold">학원 추가</p>
            <button
              onClick={() => setPicker(false)}
              className="text-[12px] text-[var(--color-text-secondary)]"
            >
              닫기
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {ACADEMIES.filter((a) => !compareIds.includes(a.id))
              .slice(0, 8)
              .map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    toggleCompare(a.id);
                    if (items.length + 1 >= MAX_COMPARE_SLOTS) setPicker(false);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white p-2 text-left hover:border-[var(--color-primary)]"
                >
                  <span className="h-8 w-10 shrink-0 overflow-hidden rounded">
                    <Thumb subject={a.subject} name={a.name} ratio="4/3" rounded="rounded" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium">
                      {a.name}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-tertiary)]">
                      {formatMonthly(a.monthly_price)} · ★{a.rating.toFixed(1)}
                    </span>
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* 평점 1위 안내 (자동 추천 X — 단순한 신호) */}
      {topRated && items.length > 1 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] p-3">
          <span className="text-2xl">⭐</span>
          <div className="flex-1 text-[13px]">
            현재 비교 중인 학원 중 <b>{topRated.name}</b>의 평점이 가장 높아요.
            <span className="ml-1 text-[var(--color-text-secondary)]">
              ({topRated.rating.toFixed(1)} / {topRated.review_count}개 후기)
            </span>
          </div>
          <Link
            href={`/academy/${topRated.id}`}
            className="rounded-md border border-[var(--color-primary)] bg-white px-2.5 py-1 text-[12px] font-semibold text-[var(--color-primary)]"
          >
            상세 보기 ›
          </Link>
        </div>
      )}

      {/* 비교 표 */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-soft)]">
              <th className="w-[140px] px-4 py-3 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                학원 정보
              </th>
              {items.map((a) => (
                <th key={a.id} className="px-4 py-3 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-[88px] shrink-0">
                      <Thumb
                        subject={a.subject}
                        name={a.name}
                        ratio="4/3"
                        rounded="rounded-md"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/academy/${a.id}`}
                        className="block truncate text-[14px] font-semibold hover:underline"
                      >
                        {a.name}
                      </Link>
                      <div className="mt-0.5 flex items-center gap-1">
                        <Stars
                          rating={a.rating}
                          size={12}
                          showCount
                          count={a.review_count}
                        />
                      </div>
                      <div className="mt-0.5 inline-flex items-center gap-0.5 text-[11px] text-[var(--color-text-tertiary)]">
                        <Icon name="location" size={10} />
                        {formatDistance(a.distance_km)}
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <RowPrice items={items} />
            <RowText
              items={items}
              label="수업 시간"
              get={(a) => `주 ${a.meta.class_per_week}회 / 회당 ${a.meta.class_minutes}분`}
            />
            <RowText
              items={items}
              label="수업 요일"
              get={(a) => a.class_days.join(" / ")}
            />
            <RowBest
              items={items}
              label="학생 정원"
              get={(a) => a.meta.capacity}
              format={(v) => `${v}명`}
              lowerIsBetter
            />
            <RowChips
              items={items}
              label="수업 스타일"
              get={(a) =>
                Array.from(
                  new Set([...a.meta.teaching_style, ...a.meta.features.slice(0, 1)]),
                )
              }
            />
            <RowHomework items={items} />
            <RowText
              items={items}
              label="레벨 테스트"
              get={(a) => (a.meta.level_test ? "있음 (무료)" : "없음")}
            />
            <RowText
              items={items}
              label="특징 한 줄 요약"
              get={(a) => a.judgement}
            />
          </tbody>
        </table>
      </div>

      {/* 액션 푸터 */}
      <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4 md:flex-row">
        <p className="text-[12px] text-[var(--color-text-tertiary)]">
          · 정보는 학원 제공 및 사용자 후기를 기반으로 하며, 실제와 다를 수 있습니다.
        </p>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <button
            onClick={clearCompare}
            className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-[13px] font-medium hover:bg-[var(--color-bg-soft)] md:flex-none"
          >
            <Icon name="refresh" size={14} />
            비교 초기화
          </button>
          <button
            onClick={() => setInquiryOpen(true)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)] md:flex-none"
          >
            <Icon name="chat" size={15} />
            상담 문의 ({items.length}개)
          </button>
        </div>
      </div>

      <InquiryDialog
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        academyIds={compareIds}
      />
    </div>
  );
}

function Empty() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-[640px] place-items-center px-6 text-center">
      <div className="flex flex-col items-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-text-secondary)]">
          <Icon name="compare" size={28} />
        </div>
        <h2 className="mt-4 text-[20px] font-bold">비교할 학원을 골라주세요</h2>
        <p className="mt-2 text-[13px] text-[var(--color-text-secondary)]">
          지도 탐색에서 카드의 <b>“비교 추가”</b>를 누르면
          <br />
          최대 {MAX_COMPARE_SLOTS}개까지 한 번에 비교할 수 있어요.
        </p>
        <Link
          href="/explore"
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          지도 탐색으로 가기
          <Icon name="forward" size={13} />
        </Link>
      </div>
    </div>
  );
}

function RowPrice({ items }: { items: Academy[] }) {
  const best = Math.min(...items.map((a) => a.monthly_price));
  return (
    <tr className="border-b border-[var(--color-border)] last:border-0">
      <Th>월 수강료</Th>
      {items.map((a) => (
        <td
          key={a.id}
          className={`px-4 py-3 text-[14px] font-semibold ${
            a.monthly_price === best && items.length > 1 ? "text-[var(--color-primary)]" : ""
          }`}
        >
          {Math.round(a.monthly_price / 10000)}만원
          {a.monthly_price === best && items.length > 1 && (
            <span className="ml-2 rounded bg-[var(--color-primary-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-primary)]">
              최저가
            </span>
          )}
        </td>
      ))}
    </tr>
  );
}

function RowText({
  items,
  label,
  get,
}: {
  items: Academy[];
  label: string;
  get: (a: Academy) => string;
}) {
  const values = items.map(get);
  const allSame = values.every((v) => v === values[0]);
  return (
    <tr className="border-b border-[var(--color-border)] last:border-0">
      <Th>{label}</Th>
      {items.map((a, i) => (
        <td
          key={a.id}
          className={`whitespace-pre-line px-4 py-3 ${
            allSame && items.length > 1 ? "text-[var(--color-text-tertiary)]" : ""
          }`}
        >
          {values[i]}
        </td>
      ))}
    </tr>
  );
}

function RowBest({
  items,
  label,
  get,
  format,
  lowerIsBetter,
}: {
  items: Academy[];
  label: string;
  get: (a: Academy) => number;
  format: (v: number) => string;
  lowerIsBetter?: boolean;
}) {
  const nums = items.map(get);
  const best = lowerIsBetter ? Math.min(...nums) : Math.max(...nums);
  return (
    <tr className="border-b border-[var(--color-border)] last:border-0">
      <Th>{label}</Th>
      {items.map((a, i) => (
        <td
          key={a.id}
          className={`px-4 py-3 ${
            nums[i] === best && items.length > 1
              ? "font-semibold text-[var(--color-primary)]"
              : ""
          }`}
        >
          {format(nums[i])}
        </td>
      ))}
    </tr>
  );
}

function RowChips({
  items,
  label,
  get,
}: {
  items: Academy[];
  label: string;
  get: (a: Academy) => string[];
}) {
  return (
    <tr className="border-b border-[var(--color-border)] last:border-0">
      <Th>{label}</Th>
      {items.map((a) => (
        <td key={a.id} className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {get(a).map((c) => (
              <span
                key={c}
                className="rounded-md bg-[var(--color-bg-muted)] px-2 py-0.5 text-[11.5px] text-[var(--color-text-secondary)]"
              >
                {c}
              </span>
            ))}
          </div>
        </td>
      ))}
    </tr>
  );
}

function RowHomework({ items }: { items: Academy[] }) {
  return (
    <tr className="border-b border-[var(--color-border)] last:border-0">
      <Th>숙제량</Th>
      {items.map((a) => {
        const v = a.meta.homework_level;
        const color =
          v === "많음" ? "text-rose-500" : v === "적음" ? "text-emerald-600" : "";
        return (
          <td key={a.id} className={`px-4 py-3 font-semibold ${color}`}>
            {v}
          </td>
        );
      })}
    </tr>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="bg-[var(--color-bg-soft)] px-4 py-3 align-top text-[12.5px] font-semibold text-[var(--color-text-secondary)]">
      {children}
    </th>
  );
}
