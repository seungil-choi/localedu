"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { InquiryDialog } from "@/components/InquiryDialog";
import { Icon } from "@/components/Icon";

export function MobileStickyCTA({ academyId }: { academyId: string }) {
  const isSaved = useAppStore((s) => s.savedIds.includes(academyId));
  const isCompared = useAppStore((s) => s.compareIds.includes(academyId));
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
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
            onClick={() => toggleCompare(academyId)}
            aria-label={isCompared ? "비교 해제" : "비교 추가"}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border ${
              isCompared
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
            }`}
          >
            <Icon name={isCompared ? "check" : "compare"} size={18} />
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
