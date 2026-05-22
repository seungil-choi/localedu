"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Icon } from "./Icon";

const DISMISS_KEY = "localedu:saveLoginToastDismissed";

/**
 * 저장 학원이 처음 1개 이상이 되는 시점에 노출되는 1회성 토스트.
 * - 로그인 안 한 상태에서만
 * - sessionStorage 로 한 세션 내 1회 노출
 */
export function SaveLoginToast() {
  const savedCount = useAppStore((s) => s.savedIds.length);
  const isLoggedIn = useAppStore((s) => Boolean(s.user));
  const [show, setShow] = useState(false);
  const lastCount = useRef(0);

  useEffect(() => {
    if (isLoggedIn) return;
    if (typeof window === "undefined") return;
    const dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    if (dismissed) return;
    if (savedCount > lastCount.current && savedCount >= 1) {
      setShow(true);
    }
    lastCount.current = savedCount;
  }, [savedCount, isLoggedIn]);

  function close(persist = true) {
    setShow(false);
    if (persist && typeof window !== "undefined") {
      sessionStorage.setItem(DISMISS_KEY, "1");
    }
  }

  if (!show) return null;
  return (
    <div className="fixed bottom-20 left-1/2 z-40 w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 md:bottom-6">
      <div className="flex items-center gap-3 rounded-xl bg-[var(--color-text-primary)] px-4 py-3 text-white shadow-2xl">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15">
          <Icon name="bookmark-filled" size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold">학원이 저장됐어요</p>
          <p className="text-[11.5px] text-white/80">
            로그인하면 다른 기기에서도 이어서 볼 수 있어요.
          </p>
        </div>
        <Link
          href="/auth?reason=%EC%A0%80%EC%9E%A5%ED%95%9C%20%ED%95%99%EC%9B%90%EC%9D%84%20%EA%B8%B0%EA%B8%B0%20%EA%B0%84%20%EB%8F%99%EA%B8%B0%ED%99%94%ED%95%98%EB%A0%A4%EB%A9%B4%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%ED%95%98%EC%84%B8%EC%9A%94"
          onClick={() => close()}
          className="shrink-0 rounded-md bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--color-text-primary)] hover:bg-white/90"
        >
          로그인
        </Link>
        <button
          aria-label="닫기"
          onClick={() => close()}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Icon name="close" size={14} />
        </button>
      </div>
    </div>
  );
}
