"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { Subject } from "@/lib/types";

const SUBJECTS: Subject[] = ["수학", "영어", "국어", "과학", "사회", "예체능", "코딩"];

/**
 * 홈 히어로 좌측 — 검색 + 과목 필터 → /explore로 이동
 */
export function HomeSearchPanel() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<Subject | null>(null);

  function goExplore(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (subject) params.set("subject", subject);
    const qs = params.toString();
    router.push(`/explore${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex flex-col">
      {/* 모바일 26px → 데스크탑 32px (작은 폰에서도 줄바꿈 깨지지 않도록) */}
      <h1 className="text-[26px] font-bold leading-tight tracking-tight md:text-[32px]">
        우리 동네 학원을
        <br />
        <span className="text-[var(--color-primary)]">지도</span>에서
        <br />
        찾아보세요
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
        학원명, 과목, 동네로 검색하고
        <br />
        지도에서 바로 비교할 수 있어요.
      </p>

      {/* 검색바 */}
      <form onSubmit={goExplore} className="mt-5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Icon
              name="search"
              size={16}
              color="var(--color-text-tertiary)"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="학원명, 과목, 동네 검색"
              className="w-full rounded-xl border border-[var(--color-border)] bg-white py-3 pl-10 pr-4 text-[14px] shadow-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-[14px] font-bold text-white shadow-sm hover:bg-[var(--color-primary-hover)] active:scale-95 transition"
          >
            탐색
          </button>
        </div>
      </form>

      {/* 과목 필터 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {SUBJECTS.map((s) => (
          <button
            key={s}
            onClick={() => {
              const next = subject === s ? null : s;
              setSubject(next);
            }}
            className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition ${
              subject === s
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 선택 과목 + 바로 탐색 */}
      {subject && (
        <button
          onClick={() => goExplore()}
          className="mt-3 inline-flex items-center gap-1.5 self-start rounded-lg bg-[var(--color-primary-soft)] px-4 py-2 text-[13px] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/15 transition"
        >
          <Icon name="map" size={14} />
          {subject} 학원 지도에서 보기
          <Icon name="forward" size={12} />
        </button>
      )}

      <p className="mt-4 inline-flex items-center gap-1 text-[11.5px] text-[var(--color-text-tertiary)]">
        <Icon name="info" size={12} color="var(--color-text-tertiary)" />
        현재 강북구 211개 학원 · 노원·도봉·성북 준비 중
      </p>
    </div>
  );
}
