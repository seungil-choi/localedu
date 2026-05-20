"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Icon } from "@/components/Icon";
import { ageGroupFromGrade } from "@/lib/format";
import type { AgeGroup, Subject } from "@/lib/types";

interface Props {
  ageGroups: AgeGroup[];
  subject: Subject;
  recommendedFor: string[];
}

/**
 * "우리 아이에게 맞나?" 상세 페이지 첫 결정 카드.
 * - profile.childGrade ∈ academy.age_groups → 매칭
 * - 자녀 정보 없으면 학년 입력 권유 nudge
 */
export function MatchCard({ ageGroups, subject, recommendedFor }: Props) {
  const childGrade = useAppStore((s) => s.profile.childGrade);
  const interests = useAppStore((s) => s.profile.interests);
  const pathname = usePathname();

  const childAgeGroup = ageGroupFromGrade(childGrade);
  const ageMatched = childAgeGroup ? ageGroups.includes(childAgeGroup) : null;
  const subjectMatched = interests.includes(subject);

  // 자녀 정보 미입력
  if (!childGrade) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-soft)] p-4">
        <div className="flex items-center gap-2">
          <Icon name="sparkles" size={16} color="var(--color-primary)" />
          <span className="text-[14px] font-semibold">
            우리 아이에게 맞는지 알려드려요
          </span>
        </div>
        <p className="mt-1.5 text-[12.5px] text-[var(--color-text-secondary)]">
          자녀 학년을 알려주시면 학년·과목 적합도를 자동 판단해서 보여드려요.
        </p>
        <Link
          href={`/onboarding?next=${encodeURIComponent(pathname)}`}
          className="mt-3 inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          자녀 정보 입력 (1분)
          <Icon name="forward" size={12} />
        </Link>
      </div>
    );
  }

  // 매칭 결과
  const matched = ageMatched ?? false;
  const tone = matched
    ? {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        accent: "text-emerald-700",
        icon: "check-circle" as const,
      }
    : {
        bg: "bg-amber-50",
        border: "border-amber-200",
        accent: "text-amber-700",
        icon: "info" as const,
      };

  return (
    <div className={`rounded-2xl border ${tone.border} ${tone.bg} p-4`}>
      <div className="flex items-start gap-2.5">
        <span className={tone.accent}>
          <Icon name={tone.icon} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className={`text-[15px] font-bold ${tone.accent}`}>
            {matched
              ? `${childGrade}에게 적합한 학원이에요`
              : `${childGrade}에게는 살짝 다를 수 있어요`}
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
            {matched
              ? `${ageGroups.join("·")} 대상 ${subject} 학원이에요.`
              : `주로 ${ageGroups.join("·")} 학생을 위한 ${subject} 학원이에요.`}
            {subjectMatched && (
              <>
                {" "}
                관심 과목 <b>{subject}</b>에도 해당돼요.
              </>
            )}
          </p>

          {recommendedFor.length > 0 && (
            <ul className="mt-2.5 flex flex-col gap-1">
              {recommendedFor.slice(0, 3).map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-1.5 text-[12.5px] text-[var(--color-text-primary)]"
                >
                  <Icon
                    name="check"
                    size={13}
                    color={matched ? "rgb(4 120 87)" : "rgb(180 83 9)"}
                    className="mt-0.5 shrink-0"
                  />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
