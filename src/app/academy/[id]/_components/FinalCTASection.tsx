"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { InquiryDialog } from "@/components/InquiryDialog";
import { Icon } from "@/components/Icon";

interface Props {
  academyId: string;
  consultationHours: { weekday: string; weekend: string };
}

/**
 * 학원 상세 페이지 마지막 CTA — 저장 / 상담 (2-up).
 *
 * 비교는 보관함의 다중 선택으로 진입하므로 여기서는 제공하지 않음.
 */
export function FinalCTASection({ academyId, consultationHours }: Props) {
  const isSaved = useAppStore((s) => s.savedIds.includes(academyId));
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const w = consultationHours.weekday;
  const we = consultationHours.weekend;

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] p-5 text-white">
        <p className="text-[14px] leading-relaxed">
          마음에 드시면 <b>저장</b>해 두시고, 보관함에서 2~3곳을 골라 <b>비교</b>해보세요.
          <br />
          최종 결정 전에 <b>상담</b>으로 자녀 학년·시간대를 확인해보면 좋아요.
        </p>
        <p className="mt-2 text-[12px] text-white/85">
          상담 가능 시간: {w ? `평일 ${w}` : "전화·문의로 확인"}
          {we && ` · 토 ${we}`}
        </p>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <button
            onClick={() => toggleSaved(academyId)}
            className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg py-3 text-[13.5px] font-semibold transition ${
              isSaved
                ? "bg-white text-[var(--color-primary)]"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            <Icon name={isSaved ? "bookmark-filled" : "bookmark"} size={14} />
            {isSaved ? "저장됨" : "저장"}
          </button>
          <button
            onClick={() => setInquiryOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-white py-3 text-[14px] font-bold text-[var(--color-primary)] hover:bg-[var(--color-bg-soft)]"
          >
            <Icon name="chat" size={14} />
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
