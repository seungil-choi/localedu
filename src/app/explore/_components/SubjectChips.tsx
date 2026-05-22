"use client";

import type { Subject } from "@/lib/types";

export const SUBJECTS: Subject[] = [
  "수학",
  "영어",
  "국어",
  "과학",
  "사회",
  "예체능",
  "코딩",
];

type Value = Subject | "전체";

interface Props {
  value: Value;
  onChange: (v: Value) => void;
  size?: "md" | "sm";
}

/** 과목 필터 칩 — 가로 스크롤 가능, 1개 선택. */
export function SubjectChips({ value, onChange, size = "md" }: Props) {
  const padding = size === "md" ? "px-3 py-1 text-[12px]" : "px-3 py-1 text-[11.5px]";
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
      {(["전체", ...SUBJECTS] as Value[]).map((s) => {
        const active = value === s;
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`shrink-0 whitespace-nowrap rounded-full font-semibold transition ${padding} ${
              active
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            }`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
