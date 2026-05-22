import Link from "next/link";
import { IconBadge } from "@/components/ui/IconBadge";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <IconBadge name="map" size="xl" tone="soft" shape="rounded" />
      <h1 className="mt-4 text-[22px] font-bold text-[var(--color-text-primary)]">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mt-2 max-w-[340px] text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
        주소가 잘못됐거나 삭제된 페이지예요.
        <br />
        학원을 지도에서 다시 찾아보세요.
      </p>
      <div className="mt-6 flex gap-2">
        <Link
          href="/explore"
          className="rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          지도 탐색하기
        </Link>
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
