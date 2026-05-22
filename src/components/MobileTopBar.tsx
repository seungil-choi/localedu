"use client";

import Link from "next/link";
import { BrandLogo } from "./Brand";
import { Icon } from "./Icon";
import { RegionPicker } from "./RegionPicker";

/**
 * 모바일 상단 바.
 * - 좌: 로고
 * - 중: 지역 선택 (드롭다운)
 * - 우: 검색 진입(/explore) + 알림 — 어디서든 검색 접근 가능
 */
export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] bg-white px-3 py-2.5 md:hidden">
      <Link href="/" aria-label="홈" className="shrink-0">
        <BrandLogo size={26} />
      </Link>
      <RegionPicker />
      <div className="flex items-center">
        <Link
          href="/explore"
          aria-label="검색"
          className="grid h-11 w-11 place-items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <Icon name="search" size={20} />
        </Link>
        <button
          aria-label="알림"
          className="grid h-11 w-11 place-items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <Icon name="bell" size={20} />
        </button>
      </div>
    </header>
  );
}
