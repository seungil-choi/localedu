"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { MyInquiries } from "./MyInquiries";
import { supabase } from "@/lib/supabase";
import { Icon, type IconName } from "@/components/Icon";

const PROVIDER_LABEL: Record<string, string> = {
  kakao: "카카오",
  naver: "네이버",
  google: "Google",
  email: "이메일",
};

export function MeClient() {
  const user = useAppStore((s) => s.user);
  const profile = useAppStore((s) => s.profile);
  const logout = useAppStore((s) => s.logout);

  async function handleLogout() {
    await supabase.auth.signOut(); // Supabase 세션 삭제 (AuthListener가 logout() 호출)
    logout(); // 로컬 스토어 즉시 초기화
  }
  const savedCount = useAppStore((s) => s.savedIds.length);
  const compareCount = useAppStore((s) => s.compareIds.length);

  if (!user) {
    return <LoggedOut />;
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 py-6 md:px-6">
      <h1 className="text-[22px] font-bold">내 정보</h1>

      <section className="mt-4 rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet-200 to-blue-200 text-[22px] font-bold text-[var(--color-primary)]">
            {user.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[16px] font-bold">{user.name}님</span>
              <span className="rounded-md bg-[var(--color-primary-soft)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--color-primary)]">
                {PROVIDER_LABEL[user.provider]} 로그인
              </span>
            </div>
            <p className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">
              {profile.region ? `${profile.region}` : "지역 미설정"}
              {profile.childGrade && ` · ${profile.childGrade}`}
              {profile.interests.length > 0 &&
                ` · ${profile.interests.slice(0, 3).join(", ")}`}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href="/onboarding"
            className="rounded-lg border border-[var(--color-border)] bg-white py-2 text-center text-[12.5px] font-medium hover:bg-[var(--color-bg-soft)]"
          >
            정보 수정
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-[var(--color-border)] bg-white py-2 text-center text-[12.5px] font-medium hover:bg-[var(--color-bg-soft)]"
          >
            로그아웃
          </button>
        </div>
      </section>

      {/* 활동 요약 */}
      <section className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href="/saved"
          className="rounded-xl border border-[var(--color-border)] bg-white p-4 hover:bg-[var(--color-bg-soft)]"
        >
          <div className="flex items-center gap-1.5 text-[12.5px] text-[var(--color-text-secondary)]">
            <Icon name="bookmark" size={14} />
            저장한 학원
          </div>
          <div className="mt-1 text-[20px] font-bold">{savedCount}곳</div>
        </Link>
        <Link
          href="/compare"
          className="rounded-xl border border-[var(--color-border)] bg-white p-4 hover:bg-[var(--color-bg-soft)]"
        >
          <div className="flex items-center gap-1.5 text-[12.5px] text-[var(--color-text-secondary)]">
            <Icon name="compare" size={14} />
            비교 중
          </div>
          <div className="mt-1 text-[20px] font-bold">{compareCount}곳</div>
        </Link>
      </section>

      <MyInquiries />

      {/* 도움 */}
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {([
          { l: "이용 가이드", i: "help" as IconName },
          { l: "고객센터", i: "chat" as IconName },
        ]).map((m) => (
          <li key={m.l}>
            <button className="flex w-full items-center justify-between gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-3 text-left text-[13px] hover:bg-[var(--color-bg-soft)]">
              <span className="flex items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]">
                  <Icon name={m.i} size={14} />
                </span>
                {m.l}
              </span>
              <Icon name="forward" size={14} color="var(--color-text-tertiary)" />
            </button>
          </li>
        ))}
      </ul>

      <footer className="mt-8 flex flex-col items-center gap-2 text-[12px] text-[var(--color-text-tertiary)] md:flex-row md:justify-center">
        <span>© {new Date().getFullYear()} 학원지도</span>
        <span className="hidden md:inline">|</span>
        <a className="hover:underline" href="#">
          이용약관
        </a>
        <span className="hidden md:inline">|</span>
        <a className="hover:underline" href="#">
          개인정보처리방침
        </a>
      </footer>
    </div>
  );
}

function LoggedOut() {
  const shortcuts: { l: string; h: string; i: IconName; d: string }[] = [
    { l: "저장함", h: "/saved", i: "bookmark", d: "관심 학원 모아보기" },
    { l: "비교함", h: "/compare", i: "compare", d: "지금 비교 중인 학원" },
    { l: "지도 탐색", h: "/explore", i: "map", d: "내 주변 학원 찾기" },
  ];
  const helps: { l: string; i: IconName }[] = [
    { l: "이용 가이드", i: "help" },
    { l: "고객센터", i: "chat" },
  ];
  return (
    <div className="mx-auto max-w-[640px] px-4 py-8 md:px-6">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon name="user" size={28} />
        </div>
        <h1 className="mt-4 text-[20px] font-bold">로그인이 필요해요</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
          저장한 학원과 비교 결과를
          <br />
          여러 기기에서 이어 볼 수 있어요.
        </p>
        <Link
          href="/auth?next=/me"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-3 text-[15px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          간편 로그인
        </Link>
        <p className="mt-2 text-[11.5px] text-[var(--color-text-tertiary)]">
          카카오 · 네이버 · 구글 계정으로 가입할 수 있어요.
        </p>
      </div>

      <MyInquiries />

      <ul className="mt-4 grid gap-2">
        {shortcuts.map((m) => (
          <li key={m.l}>
            <Link
              href={m.h}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 hover:bg-[var(--color-bg-soft)]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <Icon name={m.i} size={16} />
              </span>
              <span className="flex-1">
                <span className="block text-[14px] font-semibold">{m.l}</span>
                <span className="text-[11.5px] text-[var(--color-text-tertiary)]">
                  {m.d}
                </span>
              </span>
              <Icon name="forward" size={14} color="var(--color-text-tertiary)" />
            </Link>
          </li>
        ))}
      </ul>

      <ul className="mt-4 grid grid-cols-2 gap-2">
        {helps.map((m) => (
          <li key={m.l}>
            <button className="flex w-full items-center justify-between gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-3 text-left text-[13px] hover:bg-[var(--color-bg-soft)]">
              <span className="flex items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]">
                  <Icon name={m.i} size={14} />
                </span>
                {m.l}
              </span>
              <Icon name="forward" size={14} color="var(--color-text-tertiary)" />
            </button>
          </li>
        ))}
      </ul>

      <footer className="mt-8 flex flex-col items-center gap-2 text-[12px] text-[var(--color-text-tertiary)] md:flex-row md:justify-center">
        <span>© {new Date().getFullYear()} 학원지도</span>
      </footer>
    </div>
  );
}
