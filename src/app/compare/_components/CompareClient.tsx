"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { findAcademy } from "@/lib/mock";
import type { Academy } from "@/lib/types";
import { Thumb } from "@/components/Thumb";
import { Stars } from "@/components/Stars";
import { InquiryDialog } from "@/components/InquiryDialog";
import { Icon } from "@/components/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDistance, formatMonthly } from "@/lib/format";

const MAX_COMPARE = 3;

interface Props {
  academyIds: string[];
}

/**
 * 비교 결과 페이지.
 *
 * - URL ?ids=a,b,c 로 전달받음 (영속 상태 X)
 * - 보관함의 다중 선택에서 진입
 * - 카드 1순위 평점 표시 + 가격/수업 정보/숙제량 등 비교 표
 */
export function CompareClient({ academyIds }: Props) {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const items = useMemo(
    () =>
      academyIds
        .slice(0, MAX_COMPARE)
        .map((id) => findAcademy(id))
        .filter((x): x is Academy => Boolean(x)),
    [academyIds],
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
        <Link
          href="/saved"
          className="inline-flex items-center gap-1 text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <Icon name="back" size={14} />
          보관함으로
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <h1 className="text-[24px] font-bold">학원 비교</h1>
          <span className="rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-[12px] font-semibold text-[var(--color-primary)]">
            {items.length}곳 비교 중
          </span>
        </div>
        <p className="text-[13px] text-[var(--color-text-secondary)]">
          학원별 가격·수업 방식·후기를 한눈에 확인하세요.
        </p>
      </div>

      {/* 평점 1위 안내 */}
      {topRated && items.length > 1 && topRated.rating > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[var(--color-primary)]">
            <Icon name="award" size={18} />
          </span>
          <div className="flex-1 text-[13px]">
            <b>{topRated.name}</b>의 평점이 가장 높아요.
            <span className="ml-1 text-[var(--color-text-secondary)]">
              ({topRated.rating.toFixed(1)} / {topRated.review_count}개 후기)
            </span>
          </div>
          <Link
            href={`/academy/${topRated.id}`}
            className="shrink-0 rounded-md border border-[var(--color-primary)] bg-white px-2.5 py-1 text-[12px] font-semibold text-[var(--color-primary)]"
          >
            상세 보기
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
          · 정보는 학원 제공 및 사용자 후기 기반이며, 실제와 다를 수 있어요.
        </p>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <Link
            href="/saved"
            className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-[13px] font-medium hover:bg-[var(--color-bg-soft)] md:flex-none"
          >
            <Icon name="back" size={14} />
            다시 고르기
          </Link>
          <button
            onClick={() => setInquiryOpen(true)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)] md:flex-none"
          >
            <Icon name="chat" size={15} />
            상담 문의 ({items.length}곳)
          </button>
        </div>
      </div>

      <InquiryDialog
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        academyIds={items.map((a) => a.id)}
      />
    </div>
  );
}

function Empty() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-[640px] place-items-center px-6">
      <EmptyState
        variant="section"
        icon="compare"
        title="비교할 학원이 없어요"
        description={
          <>
            보관함에서 <b>“비교할 학원 선택”</b>을 눌러
            <br />
            2~3곳을 골라 비교해보세요.
          </>
        }
        action={
          <Link
            href="/saved"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
          >
            보관함으로 가기
            <Icon name="forward" size={13} />
          </Link>
        }
      />
    </div>
  );
}

/* ──── 표 행 컴포넌트 ──── */

function RowPrice({ items }: { items: Academy[] }) {
  const valid = items.filter((a) => a.monthly_price > 0).map((a) => a.monthly_price);
  const best = valid.length > 0 ? Math.min(...valid) : 0;

  return (
    <tr className="border-b border-[var(--color-border)] last:border-0">
      <Th>월 수강료</Th>
      {items.map((a) => {
        const isBest = a.monthly_price === best && a.monthly_price > 0 && items.length > 1;
        return (
          <td
            key={a.id}
            className={`px-4 py-3 text-[14px] font-semibold ${
              isBest ? "text-[var(--color-primary)]" : ""
            }`}
          >
            {a.monthly_price > 0 ? formatMonthly(a.monthly_price) : "문의"}
            {isBest && (
              <span className="ml-2 rounded bg-[var(--color-primary-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-primary)]">
                최저가
              </span>
            )}
          </td>
        );
      })}
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
          {values[i] || "—"}
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
