"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { InquiryDialog } from "@/components/InquiryDialog";
import { Icon } from "@/components/Icon";
import { kakaoMapDirectionsUrl } from "@/lib/format";
import type { Academy } from "@/lib/types";

/**
 * Hero 영역 CTA — 저장 / 상담 (2-up).
 *
 * 비교는 보관함의 다중 선택 모드로 진입하므로 상세 페이지에서는
 * "저장 → 상담"만 노출한다.
 */
export function DetailActions({ academy }: { academy: Academy }) {
  const isSaved = useAppStore((s) => s.savedIds.includes(academy.id));
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      {/* 데스크탑 — 저장 / 상담 */}
      <div className="mt-5 hidden grid-cols-2 gap-2 md:grid">
        <button
          onClick={() => toggleSaved(academy.id)}
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
          onClick={() => setInquiryOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[var(--color-primary)] py-2.5 text-[13.5px] font-bold text-white hover:bg-[var(--color-primary-hover)]"
        >
          <Icon name="chat" size={15} />
          상담 문의
        </button>
      </div>

      {/* 보조: 길찾기 (카카오맵 외부 링크) */}
      <div className="mt-2 hidden gap-2 md:flex">
        <a
          href={kakaoMapDirectionsUrl(academy.name, academy.lat, academy.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 whitespace-nowrap text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
        >
          <Icon name="navigate" size={12} />
          카카오맵에서 길찾기
        </a>
      </div>

      <InquiryDialog
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        academyIds={[academy.id]}
      />
    </>
  );
}
