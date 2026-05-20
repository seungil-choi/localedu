"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { SCOPE } from "@/lib/scope";
import type {
  AgeGroup,
  HomeworkLevel,
  Subject,
  TeachingStyle,
} from "@/lib/types";

const AGES: ("전체" | AgeGroup)[] = ["전체", "유아", "초등", "중등", "고등"];
const SUBJECTS: ("전체" | Subject)[] = [
  "전체",
  "국어",
  "영어",
  "수학",
  "과학",
  "사회",
  "예체능",
  "코딩",
];
const DISTANCES: { v: 0 | 0.5 | 1 | 2 | 3; label: string }[] = [
  { v: 0, label: "전체" },
  { v: 0.5, label: "500m" },
  { v: 1, label: "1km" },
  { v: 2, label: "2km" },
  { v: 3, label: "3km" },
];
const PRICES: { v: number; label: string }[] = [
  { v: 0, label: "전체" },
  { v: 200_000, label: "20만원 이하" },
  { v: 400_000, label: "20~40만원" },
  { v: 9_999_999, label: "40만원 이상" },
];
const STYLES: ("전체" | TeachingStyle)[] = [
  "전체",
  "소수 정예",
  "개별 맞춤",
  "그룹 수업",
];
const HW: ("전체" | HomeworkLevel)[] = ["전체", "적음", "보통", "많음"];

export function FilterSidebar({ matchCount }: { matchCount: number }) {
  const filter = useAppStore((s) => s.filter);
  const setFilter = useAppStore((s) => s.setFilter);
  const resetFilter = useAppStore((s) => s.resetFilter);
  const [showAdvanced, setShowAdvanced] = useState(!SCOPE.advancedFiltersCollapsed);

  return (
    <aside className="hidden w-[240px] shrink-0 flex-col gap-5 border-r border-[var(--color-border)] bg-white p-5 md:flex">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold">필터</h3>
        <button
          onClick={resetFilter}
          className="text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          ↻ 초기화
        </button>
      </div>

      <Group title="📍 지역">
        <button className="flex w-full items-center justify-between rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[13px]">
          {filter.region === "전체" ? "지역 선택" : `${filter.region} 전체`}
          <span>›</span>
        </button>
      </Group>

      <Group title="🎯 연령">
        <Pills
          values={AGES}
          active={filter.ageGroup}
          onChange={(v) => setFilter({ ageGroup: v as AgeGroup | "전체" })}
        />
      </Group>

      <Group title="📚 과목">
        <Pills
          values={SUBJECTS}
          active={filter.subject}
          onChange={(v) => setFilter({ subject: v as Subject | "전체" })}
          wrap
        />
      </Group>

      <Group title="📏 거리">
        <div className="flex flex-wrap gap-1.5">
          {DISTANCES.map((d) => (
            <Pill
              key={d.label}
              active={filter.distanceKm === d.v}
              onClick={() => setFilter({ distanceKm: d.v })}
            >
              {d.label}
            </Pill>
          ))}
        </div>
      </Group>

      {/* MVP: 핵심 3종(연령/과목/거리) 위까지 노출. 나머지는 "고급 필터" 토글 */}
      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-dashed border-[var(--color-border-strong)] px-3 py-2 text-[12.5px] font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
      >
        <span>고급 필터 (가격 · 수업 스타일 · 숙제량)</span>
        <span>{showAdvanced ? "▴" : "▾"}</span>
      </button>

      {showAdvanced && (
        <>
          <Group title="💰 가격 (월 수강료)">
            <div className="flex flex-wrap gap-1.5">
              {PRICES.map((p) => (
                <Pill
                  key={p.label}
                  active={filter.priceMax === p.v}
                  onClick={() => setFilter({ priceMax: p.v })}
                >
                  {p.label}
                </Pill>
              ))}
            </div>
          </Group>

          <Group title="👥 수업 스타일">
            <Pills
              values={STYLES}
              active={filter.teachingStyle}
              onChange={(v) =>
                setFilter({ teachingStyle: v as TeachingStyle | "전체" })
              }
              wrap
            />
          </Group>

          <Group title="📝 숙제량">
            <Pills
              values={HW}
              active={filter.homework}
              onChange={(v) => setFilter({ homework: v as HomeworkLevel | "전체" })}
            />
          </Group>
        </>
      )}

      <button className="mt-auto rounded-lg bg-[var(--color-primary)] py-3 text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)]">
        적용 결과 보기 ({matchCount})
      </button>
    </aside>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 text-[13px] font-semibold text-[var(--color-text-primary)]">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Pills({
  values,
  active,
  onChange,
  wrap,
}: {
  values: readonly string[];
  active: string;
  onChange: (v: string) => void;
  wrap?: boolean;
}) {
  return (
    <div className={`flex gap-1.5 ${wrap ? "flex-wrap" : "flex-wrap"}`}>
      {values.map((v) => (
        <Pill key={v} active={v === active} onClick={() => onChange(v)}>
          {v}
        </Pill>
      ))}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[12px] font-medium transition ${
        active
          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
          : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
      }`}
    >
      {children}
    </button>
  );
}
