"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppStore, MAX_COMPARE_SLOTS } from "@/store/useAppStore";
import { findAcademy } from "@/lib/mock";
import { Thumb } from "@/components/Thumb";

export function CompareBar() {
  const compareIds = useAppStore((s) => s.compareIds);
  const removeCompare = useAppStore((s) => s.removeCompare);
  const [open, setOpen] = useState(true);

  if (compareIds.length === 0) return null;
  const items = compareIds.map((id) => findAcademy(id)).filter(Boolean);

  return (
    <div className="sticky bottom-0 z-20 border-t border-[var(--color-border)] bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,.04)]">
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-[13px] text-[var(--color-text-secondary)]">
          선택한 학원{" "}
          <b className="text-[var(--color-text-primary)]">
            {compareIds.length}/{MAX_COMPARE_SLOTS}
          </b>
        </span>
        {open && (
          <div className="flex flex-1 gap-2 overflow-x-auto">
            {items.map(
              (a) =>
                a && (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-2 py-1"
                  >
                    <span className="h-7 w-7 shrink-0 overflow-hidden rounded">
                      <Thumb subject={a.subject} name={a.name} ratio="1/1" rounded="rounded" />
                    </span>
                    <span className="text-[13px] font-medium">{a.name}</span>
                    <button
                      aria-label="제거"
                      onClick={() => removeCompare(a.id)}
                      className="text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)]"
                    >
                      ✕
                    </button>
                  </span>
                ),
            )}
          </div>
        )}
        <Link
          href="/compare"
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          비교함 보기
          <span className="grid h-5 w-5 place-items-center rounded-full bg-white/25 text-[12px] font-bold">
            {compareIds.length}
          </span>
        </Link>
        <button
          aria-label={open ? "접기" : "펼치기"}
          onClick={() => setOpen((v) => !v)}
          className="grid h-8 w-8 place-items-center rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)]"
        >
          {open ? "˄" : "˅"}
        </button>
      </div>
    </div>
  );
}
