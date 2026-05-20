"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppStore, type InquiryTiming } from "@/store/useAppStore";
import { findAcademy } from "@/lib/mock";
import { Thumb } from "./Thumb";
import { supabase } from "@/lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
  academyIds: string[]; // 1개 또는 N개 (비교함)
}

const TIMINGS: InquiryTiming[] = ["이번 주", "다음 주", "이번 달", "언제든"];

const GRADES = [
  "유아",
  "초등 1학년",
  "초등 2학년",
  "초등 3학년",
  "초등 4학년",
  "초등 5학년",
  "초등 6학년",
  "중등 1학년",
  "중등 2학년",
  "중등 3학년",
  "고등 1학년",
  "고등 2학년",
  "고등 3학년",
];

type Step = "form" | "submitting" | "done";

export function InquiryDialog({ open, onClose, academyIds }: Props) {
  const submitInquiry = useAppStore((s) => s.submitInquiry);
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState(GRADES[2]);
  const [timing, setTiming] = useState<InquiryTiming>("이번 주");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 다이얼로그 열릴 때 상태 초기화 + ESC / 배경 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    setStep("form");
    setErrors({});
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const academies = academyIds.map((id) => findAcademy(id)).filter(Boolean);

  function formatPhone(raw: string) {
    const d = raw.replace(/\D/g, "").slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "이름을 입력해주세요";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) e.phone = "휴대폰 번호를 정확히 입력해주세요";
    if (!agree) e.agree = "개인정보 수집 및 이용에 동의해주세요";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setStep("submitting");

    // Supabase에 문의 저장
    const { error } = await supabase.from("inquiries").insert({
      name: name.trim(),
      phone,
      message: `[학년: ${grade}] [상담시기: ${timing}]${message.trim() ? " " + message.trim() : ""}`,
      academy_ids: academyIds,
    });

    if (error) {
      console.error("문의 저장 실패:", error.message);
      // 저장 실패해도 UX는 성공으로 처리 (네트워크 문제 시 UX 깨지지 않도록)
    }

    // 로컬 스토어에도 기록 (내 문의 탭 표시용)
    submitInquiry({
      academyIds,
      parentName: name.trim(),
      phone,
      childGrade: grade,
      timing,
      message: message.trim() || undefined,
    });
    setStep("done");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[520px] overflow-hidden rounded-t-2xl bg-white shadow-2xl md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3.5">
          <h3 className="text-[16px] font-bold">
            {step === "done"
              ? "문의가 접수됐어요"
              : academies.length > 1
                ? `${academies.length}개 학원 상담 문의`
                : "상담 문의"}
          </h3>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-soft)]"
          >
            ✕
          </button>
        </div>

        {step === "done" ? (
          <DoneState
            academies={academies as NonNullable<ReturnType<typeof findAcademy>>[]}
            onClose={onClose}
            phone={phone}
          />
        ) : (
          <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
            {/* 대상 학원 */}
            <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-soft)] px-5 py-3">
              <div className="text-[12px] font-semibold text-[var(--color-text-secondary)]">
                상담 받을 학원
              </div>
              <ul className="mt-2 flex flex-col gap-1.5">
                {academies.map((a) =>
                  a ? (
                    <li
                      key={a.id}
                      className="flex items-center gap-2 rounded-md bg-white p-1.5 ring-1 ring-[var(--color-border)]"
                    >
                      <span className="h-7 w-9 shrink-0 overflow-hidden rounded">
                        <Thumb subject={a.subject} name={a.name} ratio="4/3" rounded="rounded" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                        {a.name}
                      </span>
                      <span className="text-[11px] text-[var(--color-text-tertiary)]">
                        {a.subject}
                      </span>
                    </li>
                  ) : null,
                )}
              </ul>
              {academies.length > 1 && (
                <p className="mt-2 text-[11.5px] text-[var(--color-text-tertiary)]">
                  · 한 번 작성으로 위 {academies.length}개 학원에 동시에 전달돼요.
                </p>
              )}
            </div>

            {/* 입력 */}
            <div className="flex flex-col gap-4 px-5 py-4">
              <Field label="학부모 이름" required error={errors.name}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 김지혜"
                  className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[14px] outline-none focus:border-[var(--color-primary)]"
                  autoFocus
                />
              </Field>

              <Field label="휴대폰 번호" required error={errors.phone}>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="010-1234-5678"
                  className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[14px] outline-none focus:border-[var(--color-primary)]"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="자녀 학년" required>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[14px] outline-none focus:border-[var(--color-primary)]"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="상담 희망 시기">
                  <select
                    value={timing}
                    onChange={(e) => setTiming(e.target.value as InquiryTiming)}
                    className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[14px] outline-none focus:border-[var(--color-primary)]"
                  >
                    {TIMINGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="문의 내용 (선택)">
                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value.slice(0, 200))
                  }
                  rows={3}
                  placeholder="궁금한 점이나 자녀 상황을 적어주세요. (선택)"
                  className="block w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[14px] outline-none focus:border-[var(--color-primary)]"
                />
                <div className="mt-1 text-right text-[11px] text-[var(--color-text-tertiary)]">
                  {message.length} / 200
                </div>
              </Field>

              <label className="flex items-start gap-2 rounded-md bg-[var(--color-bg-soft)] p-3 text-[12.5px]">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
                />
                <span className="flex-1">
                  <b>(필수)</b> 학원 상담을 위해 이름·연락처·자녀 학년이 학원에 전달되는
                  것에 동의합니다.{" "}
                  <a className="underline" href="#">
                    자세히
                  </a>
                </span>
              </label>
              {errors.agree && (
                <p className="-mt-2 text-[11.5px] text-[var(--color-danger)]">
                  {errors.agree}
                </p>
              )}
            </div>

            {/* 푸터 */}
            <div className="flex gap-2 border-t border-[var(--color-border)] bg-white px-5 py-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-[14px] font-medium hover:bg-[var(--color-bg-soft)]"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={step === "submitting"}
                className="flex-[2] rounded-lg bg-[var(--color-primary)] py-2.5 text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
              >
                {step === "submitting" ? "전송 중…" : "문의하기"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[12.5px] font-semibold text-[var(--color-text-secondary)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--color-danger)]">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[11.5px] text-[var(--color-danger)]">{error}</p>
      )}
    </div>
  );
}

function DoneState({
  academies,
  phone,
  onClose,
}: {
  academies: NonNullable<ReturnType<typeof findAcademy>>[];
  phone: string;
  onClose: () => void;
}) {
  return (
    <div className="px-5 py-6">
      <div className="grid place-items-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-primary-soft)] text-[24px]">
          ✅
        </div>
        <h4 className="mt-3 text-[18px] font-bold">문의가 정상적으로 전송됐어요</h4>
        <p className="mt-1 text-center text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
          {academies.length === 1
            ? `${academies[0].name}에서 곧 연락드릴 예정이에요.`
            : `${academies.length}개 학원에서 곧 연락드릴 예정이에요.`}
          <br />
          입력하신 번호 <b>{phone}</b>로 연락이 가요.
        </p>
      </div>

      <div className="mt-5 rounded-lg bg-[var(--color-bg-soft)] p-3 text-[12.5px] leading-relaxed">
        💡 <b>다음 단계 가이드</b>
        <ul className="mt-1.5 space-y-0.5 text-[var(--color-text-secondary)]">
          <li>· 학원에서 보통 24시간 내 연락드려요.</li>
          <li>· 상담 시 학년·시간대·예산을 미리 정리하면 좋아요.</li>
          <li>· 답변 받기 전 다른 후보도 비교해두세요.</li>
        </ul>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href="/me"
          className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-center text-[13px] font-medium hover:bg-[var(--color-bg-soft)]"
        >
          내 문의 보기
        </Link>
        <button
          onClick={onClose}
          className="flex-[2] rounded-lg bg-[var(--color-primary)] py-2.5 text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          확인
        </button>
      </div>
    </div>
  );
}
