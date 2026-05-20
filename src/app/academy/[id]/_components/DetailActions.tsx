"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { InquiryDialog } from "@/components/InquiryDialog";
import { Icon } from "@/components/Icon";

/**
 * Hero 영역 CTA — 학부모 행동 흐름(저장 → 비교 → 상담)을 동등 비중으로.
 */
export function DetailActions({ academyId }: { academyId: string }) {
  const compareIds = useAppStore((s) => s.compareIds);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const savedIds = useAppStore((s) => s.savedIds);
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const isCompared = compareIds.includes(academyId);
  const isSaved = savedIds.includes(academyId);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      {/* 데스크톱 — 저장/비교가 먼저 (학부모 자연 흐름), 상담은 primary로 마지막 강조 */}
      <div className="mt-5 hidden grid-cols-3 gap-2 md:grid">
        <button
          onClick={() => toggleSaved(academyId)}
          className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border py-2.5 text-[13.5px] font-semibold transition ${
            isSaved
              ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
              : "border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          }`}
        >
          <Icon name={isSaved ? "bookmark-filled" : "bookmark"} size={14} />
          {isSaved ? "저장됨" : "저장"}
        </button>
        <button
          onClick={() => toggleCompare(academyId)}
          className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border py-2.5 text-[13.5px] font-semibold transition ${
            isCompared
              ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
              : "border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          }`}
        >
          <Icon name={isCompared ? "check" : "compare"} size={14} />
          {isCompared ? "비교 중" : "비교 추가"}
        </button>
        <button
          onClick={() => setInquiryOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[var(--color-primary)] py-2.5 text-[13.5px] font-bold text-white hover:bg-[var(--color-primary-hover)]"
        >
          <Icon name="chat" size={15} />
          상담 문의
        </button>
      </div>

      {/* 보조: 전화·길찾기 */}
      <div className="mt-2 hidden gap-2 md:flex">
        <button className="inline-flex items-center gap-1 whitespace-nowrap text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
          <Icon name="phone" size={12} />
          전화 문의
        </button>
        <span className="text-[var(--color-text-tertiary)]">·</span>
        <button className="inline-flex items-center gap-1 whitespace-nowrap text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
          <Icon name="navigate" size={12} />
          길찾기
        </button>
      </div>

      <InquiryDialog
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        academyIds={[academyId]}
      />
    </>
  );
}
