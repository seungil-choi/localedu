"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { ACADEMIES, REGION_CENTERS } from "@/lib/mock";
import type { Region } from "@/lib/types";
import { Icon } from "./Icon";

const REGIONS: Region[] = ["강북구", "노원구", "도봉구", "성북구"];

interface Props {
  /** "trigger" 모드면 버튼만 렌더, 클릭 시 자체 모달 열림 */
  variant?: "trigger" | "inline";
}

/**
 * 헤더에 들어가는 지역 선택 — 클릭 시 모달, 4개 자치구 + 학원 수.
 */
export function RegionPicker({ variant = "trigger" }: Props) {
  const region = useAppStore((s) => s.filter.region);
  const setFilter = useAppStore((s) => s.setFilter);
  const [open, setOpen] = useState(false);

  // 각 region별 학원 수 (메모리에서 즉시 카운트)
  const counts = REGIONS.reduce(
    (acc, r) => {
      acc[r] = ACADEMIES.filter((a) => a.region === r).length;
      return acc;
    },
    {} as Record<Region, number>,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function pick(r: Region) {
    setFilter({ region: r });
    setOpen(false);
  }

  const display = region === "전체" ? "전체" : region;

  if (variant === "inline") {
    return <RegionGrid current={region} counts={counts} onPick={pick} />;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--color-bg-soft)]"
      >
        <Icon name="location-filled" size={14} color="var(--color-primary)" />
        <span>{display}</span>
        <Icon name="down" size={14} color="var(--color-text-tertiary)" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 py-12"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <h3 className="text-[16px] font-bold">지역 선택</h3>
              <button
                aria-label="닫기"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-soft)]"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="p-4">
              <RegionGrid current={region} counts={counts} onPick={pick} />
              <p className="mt-4 text-center text-[11.5px] text-[var(--color-text-tertiary)]">
                현재 4개 자치구 학원 데이터를 제공해요.
                <br />
                다른 지역은 곧 추가됩니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function RegionGrid({
  current,
  counts,
  onPick,
}: {
  current: Region | "전체";
  counts: Record<Region, number>;
  onPick: (r: Region) => void;
}) {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {REGIONS.map((r) => {
        const active = current === r;
        const c = REGION_CENTERS[r];
        return (
          <li key={r}>
            <button
              onClick={() => onPick(r)}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
                active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                  : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]"
              }`}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                  active
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]"
                }`}
              >
                <Icon name="location-filled" size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold">{r}</span>
                <span className="block text-[11.5px] text-[var(--color-text-tertiary)]">
                  학원 {counts[r]}곳 · {c.landmark} 기준
                </span>
              </span>
              {active && (
                <Icon
                  name="check"
                  size={14}
                  color="var(--color-primary)"
                  className="ml-auto shrink-0"
                />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
