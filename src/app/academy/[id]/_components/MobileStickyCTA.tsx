"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { InquiryDialog } from "@/components/InquiryDialog";
import { Icon } from "@/components/Icon";

/**
 * 모바일 학원 상세 하단 고정 CTA — 저장 / 상담 (2-up).
 *
 * 비교는 보관함의 다중 선택 모드로 진입.
 */
export function MobileStickyCTA({ academyId }: { academyId: string }) {
  const isSaved = useAppStore((s) => s.savedIds.includes(academyId));
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <div
        className="fixed left-0 right-0 z-20 border-t border-[var(--color-border)] bg-white px-4 py-3 md:hidden"
        style={{ bottom: "var(--mobile-bottom-tab-h)" }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaved(academyId)}
            aria-label={isSaved ? "저장 해제" : "저장"}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border ${
              isSaved
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
            }`}
          >
            <Icon name={isSaved ? "bookmark-filled" : "bookmark"} size={18} />
          </button>
          <button
            onClick={() => setInquiryOpen(true)}
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[var(--color-primary)] text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
          >
            <Icon name="chat" size={16} />
            상담 문의
          </button>
        </div>
      </div>

      <InquiryDialog
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        academyIds={[academyId]}
      />
    </>
  );
}
