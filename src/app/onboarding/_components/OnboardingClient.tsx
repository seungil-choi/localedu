"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { BrandLogo } from "@/components/Brand";
import { Icon } from "@/components/Icon";
import type { Region, Subject } from "@/lib/types";
import { StepWelcome } from "./steps/StepWelcome";
import { StepRegion } from "./steps/StepRegion";
import { StepGrade } from "./steps/StepGrade";
import { StepInterests } from "./steps/StepInterests";

const STEPS = ["환영", "지역", "자녀", "관심 과목", "완료"] as const;
const LAST_FORM_STEP = STEPS.length - 2; // "관심 과목" 인덱스

/**
 * 온보딩 컨테이너.
 *
 * - 4단계 폼: 환영 → 지역 → 자녀 → 관심 과목 → (완료 후 nextPath 이동)
 * - 단계별 폼은 ./steps/Step*.tsx 로 분리
 * - 완료 시 useAppStore.updateProfile + completeOnboarding
 * - "나중에" 버튼은 skipOnboarding 호출
 */
export function OnboardingClient() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = params.get("next") || "/explore";

  const updateProfile = useAppStore((s) => s.updateProfile);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const skipOnboarding = useAppStore((s) => s.skipOnboarding);

  const [step, setStep] = useState(0);
  const [region, setRegion] = useState<Region | undefined>();
  const [grade, setGrade] = useState<string | undefined>();
  const [interests, setInterests] = useState<Subject[]>([]);

  const canNext = step === 1 ? Boolean(region) : step === 2 ? Boolean(grade) : true;

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function skip() {
    skipOnboarding();
    router.push(nextPath);
  }
  function done() {
    updateProfile({ region, childGrade: grade, interests });
    completeOnboarding();
    router.push(nextPath);
  }
  function toggleInterest(s: Subject) {
    setInterests((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-white">
      {/* 스크린리더용 페이지 제목 — 시각적으로는 ProgressBar가 컨텍스트 제공 */}
      <h1 className="sr-only">학원지도 시작하기</h1>
      <Header onSkip={skip} />
      <ProgressBar step={step} />

      <main className="flex flex-1 flex-col items-center overflow-y-auto px-4 pb-4 pt-8 md:px-6 md:pt-10">
        <div className="w-full max-w-[520px]">
          {step === 0 && <StepWelcome />}
          {step === 1 && <StepRegion value={region} onChange={setRegion} />}
          {step === 2 && <StepGrade value={grade} onChange={setGrade} />}
          {step === 3 && <StepInterests value={interests} onToggle={toggleInterest} />}
        </div>
      </main>

      <Footer
        step={step}
        canNext={canNext}
        onBack={back}
        onNext={next}
        onDone={done}
      />
    </div>
  );
}

/* ──── 부분 컴포넌트 ──── */

function Header({ onSkip }: { onSkip: () => void }) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3 md:px-6">
      <BrandLogo size={26} />
      <button
        onClick={onSkip}
        className="inline-flex items-center gap-0.5 text-[12.5px] text-[var(--color-text-secondary)] hover:underline"
      >
        나중에 설정하기
        <Icon name="forward" size={12} />
      </button>
    </header>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="border-b border-[var(--color-border)] px-4 py-3 md:px-6">
      <div className="mx-auto flex max-w-[640px] items-center gap-1.5 md:gap-2">
        {STEPS.slice(0, -1).map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-1.5 md:gap-2">
            <StepDot index={i} step={step} />
            <span
              className={`hidden text-[12px] md:inline ${
                i <= step
                  ? "font-semibold text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-tertiary)]"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 2 && (
              <span
                className={`h-px flex-1 ${
                  i < step ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepDot({ index, step }: { index: number; step: number }) {
  const done = index < step;
  const current = index === step;
  const tone = done
    ? "bg-[var(--color-primary)] text-white"
    : current
      ? "ring-2 ring-[var(--color-primary)] text-[var(--color-primary)]"
      : "bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)]";
  return (
    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${tone}`}>
      {done ? <Icon name="check" size={12} /> : index + 1}
    </span>
  );
}

function Footer({
  step,
  canNext,
  onBack,
  onNext,
  onDone,
}: {
  step: number;
  canNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onDone: () => void;
}) {
  const isLast = step >= LAST_FORM_STEP;
  return (
    <footer className="border-t border-[var(--color-border)] bg-white px-4 py-3 md:px-6">
      <div className="mx-auto flex max-w-[520px] gap-2">
        {step > 0 && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-[14px] font-medium hover:bg-[var(--color-bg-soft)]"
          >
            <Icon name="back" size={14} />
            이전
          </button>
        )}
        <button
          onClick={isLast ? onDone : onNext}
          disabled={!canNext}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[var(--color-primary)] py-3 text-[15px] font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
        >
          {isLast ? "학원 보러 가기" : "다음"}
          <Icon name="forward" size={14} />
        </button>
      </div>
      {step === LAST_FORM_STEP && (
        <button
          onClick={onDone}
          className="mx-auto mt-2 block text-[12px] text-[var(--color-text-secondary)] hover:underline"
        >
          건너뛰기
        </button>
      )}
    </footer>
  );
}
