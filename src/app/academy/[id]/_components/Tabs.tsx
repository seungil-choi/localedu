"use client";

import { useState } from "react";

const TABS = [
  "소개",
  "수업 정보",
  "커리큘럼",
  "강사진",
  "비용",
  "후기",
  "Q&A",
  "위치",
];

export function Tabs({ reviewCount }: { reviewCount: number }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mt-5 border-b border-[var(--color-border)]">
      <ul className="flex items-center gap-4 overflow-x-auto">
        {TABS.map((t, i) => (
          <li key={t}>
            <button
              onClick={() => setActive(i)}
              className={`relative whitespace-nowrap py-2 text-[14px] font-medium ${
                active === i
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {t}
              {t === "후기" && (
                <span className="ml-1 text-[12px] text-[var(--color-text-tertiary)]">
                  {reviewCount}
                </span>
              )}
              {t === "Q&A" && (
                <span className="ml-1 text-[12px] text-[var(--color-text-tertiary)]">
                  16
                </span>
              )}
              {active === i && (
                <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[var(--color-primary)]" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
