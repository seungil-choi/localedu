"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { Icon } from "./Icon";

/**
 * 홈 첫 진입 시 노출되는 가벼운 온보딩 권유 배너.
 * - profile.onboardingDone === false 일 때만 표시
 * - 강제 X, "둘러보기"가 동등 비중
 */
export function OnboardingNudge() {
  const onboardingDone = useAppStore((s) => s.profile.onboardingDone);
  const skipOnboarding = useAppStore((s) => s.skipOnboarding);
  if (onboardingDone) return null;

  return (
    <div className="mx-auto mt-4 max-w-[1280px] px-6">
      <div className="flex items-center gap-3 rounded-xl border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] p-4">
        <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[var(--color-primary)] md:grid">
          <Icon name="sparkles" size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold">
            우리 아이에게 맞는 학원, 1분이면 추천받아요
          </p>
          <p className="text-[12.5px] text-[var(--color-text-secondary)]">
            지역과 자녀 학년만 알려주시면 맞춤 학원을 우선 보여드려요.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          1분 설정
          <Icon name="forward" size={12} />
        </Link>
        <button
          onClick={skipOnboarding}
          className="shrink-0 whitespace-nowrap text-[12px] text-[var(--color-text-secondary)] hover:underline"
        >
          나중에
        </button>
      </div>
    </div>
  );
}
