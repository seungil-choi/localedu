"use client";

export const SORT_OPTIONS = [
  { value: "recommend", label: "추천순" },
  { value: "rating",    label: "평점순" },
  { value: "distance",  label: "거리순" },
  { value: "price",     label: "가격순" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

interface Props {
  value: SortKey;
  onChange: (v: SortKey) => void;
  size?: "md" | "sm";
}

/** 정렬 셀렉트 — 데스크탑(md)·모바일(sm) 크기 분기. */
export function SortSelect({ value, onChange, size = "md" }: Props) {
  const sizing =
    size === "md"
      ? "px-2 py-1 text-[12px] rounded-md"
      : "px-2 py-0.5 text-[11.5px] rounded";
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
      aria-label="정렬 기준"
      className={`border border-[var(--color-border)] bg-white outline-none ${sizing}`}
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
