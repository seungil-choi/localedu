"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IconBadge } from "@/components/ui/IconBadge";

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
      <IconBadge name="warning" size="xl" tone="muted" shape="rounded" />
      <h1 className="mt-4 text-[20px] font-bold leading-tight text-[var(--color-text-primary)] sm:text-[22px]">
        일시적인 오류가 발생했어요
      </h1>
      <p className="mt-2 max-w-[340px] text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
        페이지를 불러오는 중 문제가 생겼어요.
        <br />
        잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-6 flex w-full max-w-[320px] flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--color-primary)] px-5 text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--color-border)] px-5 text-[14px] font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-soft)]"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
