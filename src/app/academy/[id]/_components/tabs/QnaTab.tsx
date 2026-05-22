import { EmptyState } from "@/components/ui/EmptyState";

const SAMPLE_QUESTIONS = [
  "수업 시작 전 레벨 테스트가 있나요?",
  "무료 체험 수업이 가능한가요?",
  "결석 시 보충 수업이 가능한가요?",
];

/** Q&A 탭 — Phase 2 콘텐츠 (현재 자주 묻는 질문 플레이스홀더). */
export function QnaTab() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
      <EmptyState
        variant="inline"
        icon="chat"
        title="Q&A 준비 중"
        description="궁금한 점은 상담 문의로 직접 질문해보세요."
      />
      <div className="mt-5 space-y-3">
        {SAMPLE_QUESTIONS.map((q) => (
          <article
            key={q}
            className="rounded-xl border border-dashed border-[var(--color-border)] p-4"
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-primary-soft)] text-[11px] font-bold text-[var(--color-primary)]">
                Q
              </span>
              <p className="text-[13.5px] text-[var(--color-text-secondary)]">{q}</p>
            </div>
            <div className="mt-2 flex items-start gap-2">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-bg-muted)] text-[11px] font-bold text-[var(--color-text-tertiary)]">
                A
              </span>
              <p className="text-[13px] italic text-[var(--color-text-tertiary)]">
                상담을 통해 확인해주세요.
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
