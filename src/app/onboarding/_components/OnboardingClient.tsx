"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { Region, Subject } from "@/lib/types";
import { BrandLogo } from "@/components/Brand";
import { Icon, type IconName } from "@/components/Icon";

const REGIONS: { v: Region | "기타"; l: string; ready: boolean }[] = [
  { v: "강북구", l: "서울 강북구", ready: true },
  { v: "노원구", l: "서울 노원구", ready: false },
  { v: "도봉구", l: "서울 도봉구", ready: false },
  { v: "성북구", l: "서울 성북구", ready: false },
  { v: "기타", l: "다른 지역 (준비 중)", ready: false },
];

const GRADE_GROUPS = [
  { l: "유아 (3~7세)", grades: ["유아"] },
  {
    l: "초등",
    grades: ["초등 1학년", "초등 2학년", "초등 3학년", "초등 4학년", "초등 5학년", "초등 6학년"],
  },
  { l: "중등", grades: ["중등 1학년", "중등 2학년", "중등 3학년"] },
  { l: "고등", grades: ["고등 1학년", "고등 2학년", "고등 3학년"] },
];

const SUBJECTS: Subject[] = ["국어", "영어", "수학", "과학", "사회", "예체능", "코딩"];

const STEPS = ["환영", "지역", "자녀", "관심 과목", "완료"] as const;

export function OnboardingClient() {
  const router = useRouter();
  const params = useSearchParams();
  // 온보딩 전 보던 페이지로 돌아가기 (예: /academy/gangbuk-xxx)
  const nextPath = params.get("next") || "/explore";

  const updateProfile = useAppStore((s) => s.updateProfile);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const skipOnboarding = useAppStore((s) => s.skipOnboarding);

  const [step, setStep] = useState(0);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [grade, setGrade] = useState<string | undefined>(undefined);
  const [interests, setInterests] = useState<Subject[]>([]);

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
    setInterests((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s],
    );
  }

  // Step 진행 가능 여부
  const canNext = (() => {
    if (step === 0) return true;
    if (step === 1) return Boolean(region);
    if (step === 2) return Boolean(grade);
    if (step === 3) return true; // 관심 과목은 선택, 건너뛸 수 있음
    return true;
  })();

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3 md:px-6">
        <BrandLogo size={26} />
        <button
          onClick={skip}
          className="text-[12.5px] text-[var(--color-text-secondary)] hover:underline"
        >
          나중에 설정하기 ›
        </button>
      </header>

      {/* 진행 바 — 모바일에서는 라벨 없이 도트만, 데스크탑에서는 라벨 동반 */}
      <div className="border-b border-[var(--color-border)] px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-[640px] items-center gap-1.5 md:gap-2">
          {STEPS.slice(0, -1).map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-1.5 md:gap-2">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                  i < step
                    ? "bg-[var(--color-primary)] text-white"
                    : i === step
                      ? "ring-2 ring-[var(--color-primary)] text-[var(--color-primary)]"
                      : "bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)]"
                }`}
              >
                {i < step ? <Icon name="check" size={12} /> : i + 1}
              </span>
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

      {/* 본문 */}
      <main className="flex flex-1 flex-col items-center overflow-y-auto px-4 pb-4 pt-8 md:px-6 md:pt-10">
        <div className="w-full max-w-[520px]">
          {step === 0 && <StepWelcome />}
          {step === 1 && <StepRegion value={region} onChange={setRegion} />}
          {step === 2 && <StepGrade value={grade} onChange={setGrade} />}
          {step === 3 && (
            <StepInterests value={interests} onToggle={toggleInterest} />
          )}
        </div>
      </main>

      {/* 푸터 액션 */}
      <footer className="border-t border-[var(--color-border)] bg-white px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-[520px] gap-2">
          {step > 0 && (
            <button
              onClick={back}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-[14px] font-medium hover:bg-[var(--color-bg-soft)]"
            >
              <Icon name="back" size={14} />
              이전
            </button>
          )}
          {step < STEPS.length - 2 ? (
            <button
              disabled={!canNext}
              onClick={next}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[var(--color-primary)] py-3 text-[15px] font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
            >
              다음
              <Icon name="forward" size={14} />
            </button>
          ) : (
            <button
              onClick={done}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[var(--color-primary)] py-3 text-[15px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
            >
              학원 보러 가기
              <Icon name="forward" size={14} />
            </button>
          )}
        </div>
        {step === 3 && (
          <button
            onClick={done}
            className="mx-auto mt-2 block text-[12px] text-[var(--color-text-secondary)] hover:underline"
          >
            건너뛰기
          </button>
        )}
      </footer>
    </div>
  );
}

/* ──── Step 0: 환영 ──── */
function StepWelcome() {
  const features: { icon: IconName; l: string; d: string }[] = [
    { icon: "map", l: "지역·거리 기준 발견", d: "내 위치에서 가까운 학원부터" },
    { icon: "compare", l: "최대 3곳 비교", d: "수업 방식·가격·후기 한눈에" },
    { icon: "chat", l: "한 번에 여러 곳 문의", d: "상담 신청을 일괄로" },
  ];
  return (
    <div className="text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <Icon name="map" size={36} />
      </div>
      <h1 className="mt-5 text-[24px] font-bold leading-tight">
        학원지도에 오신 걸<br />환영해요
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
        지도에서 우리 동네 학원을 발견하고
        <br />
        2~3곳을 비교해 빠르게 선택할 수 있어요.
      </p>
      <ul className="mt-6 flex flex-col gap-2 text-left">
        {features.map((m) => (
          <li
            key={m.l}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Icon name={m.icon} size={18} />
            </span>
            <span>
              <span className="block text-[14px] font-semibold">{m.l}</span>
              <span className="block text-[12px] text-[var(--color-text-tertiary)]">
                {m.d}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[12px] text-[var(--color-text-tertiary)]">
        1분이면 끝나요. 로그인 없이 시작할 수 있어요.
      </p>
    </div>
  );
}

/* ──── Step 1: 지역 ──── */
function StepRegion({
  value,
  onChange,
}: {
  value?: Region;
  onChange: (v: Region) => void;
}) {
  return (
    <div>
      <h1 className="text-[22px] font-bold">어디 사세요?</h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
        살고 계신 지역을 알려주시면 그 동네 학원부터 보여드려요.
      </p>
      <ul className="mt-5 flex flex-col gap-2">
        {REGIONS.map((r) => {
          const active = value === r.v;
          const disabled = !r.ready;
          return (
            <li key={r.v}>
              <button
                disabled={disabled}
                onClick={() => onChange(r.v as Region)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                    : disabled
                      ? "cursor-not-allowed border-[var(--color-border)] bg-[var(--color-bg-soft)] opacity-60"
                      : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]"
                }`}
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ring-[var(--color-border)] ${
                    r.ready
                      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)]"
                  }`}
                >
                  <Icon name={r.ready ? "location-filled" : "warning"} size={18} />
                </span>
                <span className="flex-1">
                  <span className="block text-[14.5px] font-semibold">{r.l}</span>
                  <span className="block text-[11.5px] text-[var(--color-text-tertiary)]">
                    {r.ready ? "지금 데이터 제공 중" : "곧 제공 예정"}
                  </span>
                </span>
                {active && (
                  <Icon name="check" size={16} color="var(--color-primary)" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ──── Step 2: 자녀 학년 ──── */
function StepGrade({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h1 className="text-[22px] font-bold">자녀가 몇 학년이에요?</h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
        학년에 맞는 학원과 후기를 우선 보여드려요.
      </p>
      <div className="mt-5 flex flex-col gap-4">
        {GRADE_GROUPS.map((g) => (
          <div key={g.l}>
            <div className="text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {g.l}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {g.grades.map((gr) => {
                const active = value === gr;
                return (
                  <button
                    key={gr}
                    onClick={() => onChange(gr)}
                    className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
                      active
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {gr}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11.5px] text-[var(--color-text-tertiary)]">
        · 자녀가 여러 명이라면 가장 많이 검색하실 학년을 선택해주세요. 마이에서 추가/변경할 수 있어요.
      </p>
    </div>
  );
}

/* ──── Step 3: 관심 과목 ──── */
function StepInterests({
  value,
  onToggle,
}: {
  value: Subject[];
  onToggle: (s: Subject) => void;
}) {
  return (
    <div>
      <h1 className="text-[22px] font-bold">관심 있는 과목을 골라주세요</h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
        여러 개 선택할 수 있어요. 나중에 변경할 수 있어요.
      </p>
      <ul className="mt-5 grid grid-cols-2 gap-2">
        {SUBJECTS.map((s) => {
          const active = value.includes(s);
          return (
            <li key={s}>
              <button
                onClick={() => onToggle(s)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                    : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]"
                }`}
              >
                <span className="text-[14.5px] font-semibold">{s}</span>
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${
                    active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-border-strong)] bg-white text-transparent"
                  }`}
                >
                  <Icon name="check" size={12} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-[11.5px] text-[var(--color-text-tertiary)]">
        · 관심 과목은 추천과 알림에만 사용돼요. 나머지 학원도 다 볼 수 있어요.
      </p>
    </div>
  );
}
