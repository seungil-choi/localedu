"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-[48px]">😥</div>
      <h1 className="text-[22px] font-bold text-[var(--color-text-primary)]">
        일시적인 오류가 발생했어요
      </h1>
      <p className="mt-2 max-w-[340px] text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
        페이지를 불러오는 중 문제가 생겼어요.
        <br />
        잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-6 flex gap-2">
        <button
          onClick={reset}
          className="rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-[14px] font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-soft)]"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
