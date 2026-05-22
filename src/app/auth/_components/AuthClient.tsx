"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/Brand";
import { Icon } from "@/components/Icon";
import { SocialIcon } from "@/components/SocialIcon";
import { useAppStore, type AuthProvider } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";

type SupabaseProvider = "google" | "kakao";

type SocialProvider = "kakao" | "naver" | "google";

const PROVIDERS: {
  value: SocialProvider;
  supabaseProvider?: SupabaseProvider;
  label: string;
  bg: string;
  fg: string;
  border?: string;
}[] = [
  {
    value: "kakao",
    supabaseProvider: "kakao",
    label: "카카오로 시작하기",
    bg: "#FEE500",
    fg: "#000",
  },
  {
    value: "naver",
    // Naver는 Supabase 기본 제공 미지원 — Phase 2에서 추가 예정
    label: "네이버로 시작하기",
    bg: "#03C75A",
    fg: "#fff",
  },
  {
    value: "google",
    supabaseProvider: "google",
    label: "Google로 시작하기",
    bg: "#fff",
    fg: "#1f1f1f",
    border: "#d1d5db",
  },
];

export function AuthClient() {
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const reason = params.get("reason");
  const errorParam = params.get("error");
  const loginWith = useAppStore((s) => s.loginWith);
  const onboardingDone = useAppStore((s) => s.profile.onboardingDone);
  const [busy, setBusy] = useState<AuthProvider | null>(null);

  // NEXT_PUBLIC_APP_URL로 관리 — window 의존성 제거
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://localedu.vercel.app"}/auth/callback?next=${onboardingDone ? next : "/onboarding"}`;

  async function handle(provider: AuthProvider, supabaseProvider?: SupabaseProvider) {
    setBusy(provider);

    if (supabaseProvider) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: supabaseProvider,
        options: { redirectTo },
      });
      if (error) {
        console.error("OAuth 오류:", error.message);
        // 에러 파라미터와 함께 현재 페이지로 리디렉트
        window.location.href = `/auth?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`;
      }
      // 성공 시 브라우저가 OAuth 제공사로 리디렉트됨
      return;
    }

    // Naver 등 미지원 provider — 준비 중 안내
    setBusy(null);
    alert("네이버 로그인은 준비 중입니다. 카카오 또는 Google을 이용해주세요.");
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-white">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3 md:px-6">
        <BrandLogo size={26} />
        <Link
          href={next}
          aria-label="닫기"
          className="grid h-10 w-10 place-items-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-soft)]"
        >
          <Icon name="close" size={18} />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-6">
        <div className="w-full max-w-[420px]">
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Icon name="user" size={28} />
            </div>
            <h1 className="mt-4 text-[22px] font-bold leading-tight">
              학원지도에 로그인
            </h1>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
              저장한 학원·비교함·문의를
              <br />
              여러 기기에서 이어 볼 수 있어요.
            </p>
          </div>

          {reason && (
            <div className="mt-4 rounded-lg bg-[var(--color-primary-soft)] px-3 py-2 text-center text-[12.5px] text-[var(--color-primary)]">
              {decodeURIComponent(reason)}
            </div>
          )}

          {errorParam && (
            <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-center text-[12.5px] text-red-600">
              로그인 중 오류가 발생했어요. 다시 시도해주세요.
            </div>
          )}

          {/* 소셜 버튼 */}
          <div className="mt-6 flex flex-col gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.value}
                disabled={busy !== null}
                onClick={() => handle(p.value, p.supabaseProvider)}
                className="relative flex h-12 items-center justify-center rounded-lg text-[14.5px] font-semibold transition disabled:opacity-50"
                style={{
                  background: p.bg,
                  color: p.fg,
                  border: p.border ? `1px solid ${p.border}` : "none",
                }}
              >
                <span className="absolute left-4 inline-flex items-center justify-center">
                  <SocialIcon provider={p.value} size={20} />
                </span>
                <span>{busy === p.value ? "로그인 중…" : p.label}</span>
              </button>
            ))}
          </div>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--color-border)]" />
            <span className="text-[11.5px] text-[var(--color-text-tertiary)]">
              또는
            </span>
            <span className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          {/* 비로그인 동등 비중 */}
          <Link
            href={onboardingDone ? "/explore" : "/onboarding"}
            className="flex h-12 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white text-[14px] font-medium hover:bg-[var(--color-bg-soft)]"
          >
            로그인 없이 둘러보기
          </Link>
          <p className="mt-2 text-center text-[11.5px] text-[var(--color-text-tertiary)]">
            모든 핵심 기능은 로그인 없이도 사용할 수 있어요.
            <br />
            로그인은 <b>기기 간 동기화</b>를 위한 거예요.
          </p>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-[var(--color-text-tertiary)]">
            로그인하면 <a className="underline" href="#">이용약관</a>과{" "}
            <a className="underline" href="#">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </main>
    </div>
  );
}
