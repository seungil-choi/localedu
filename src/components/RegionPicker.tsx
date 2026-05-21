"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { Region } from "@/lib/types";
import { Icon } from "./Icon";

const REGIONS: Region[] = ["강북구", "노원구", "도봉구", "성북구"];

/**
 * 헤더 지역 선택 드롭다운.
 * 버튼 클릭 시 바로 아래로 펼쳐지는 작은 메뉴 — 4개 자치구.
 */
export function RegionPicker() {
  const region = useAppStore((s) => s.filter.region);
  const setFilter = useAppStore((s) => s.setFilter);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // ESC 키 + 바깥 클릭으로 닫기
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  function pick(r: Region) {
    setFilter({ region: r });
    setOpen(false);
  }

  const display = region === "전체" ? "강북구" : region;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--color-bg-soft)]"
      >
        <Icon name="location-filled" size={14} color="var(--color-primary)" />
        <span>{display}</span>
        <Icon
          name="down"
          size={14}
          color="var(--color-text-tertiary)"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-40 mt-1.5 min-w-[140px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-white py-1 shadow-lg"
        >
          {REGIONS.map((r) => {
            const active = region === r;
            return (
              <li key={r} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => pick(r)}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-[14px] transition ${
                    active
                      ? "bg-[var(--color-primary-soft)] font-semibold text-[var(--color-primary)]"
                      : "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-soft)]"
                  }`}
                >
                  <span>{r}</span>
                  {active && (
                    <Icon name="check" size={14} color="var(--color-primary)" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
