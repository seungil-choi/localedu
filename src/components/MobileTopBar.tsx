"use client";

import Link from "next/link";
import { BrandLogo } from "./Brand";
import { Icon } from "./Icon";
import { RegionPicker } from "./RegionPicker";

export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] bg-white px-4 py-3 md:hidden">
      <Link href="/">
        <BrandLogo size={26} />
      </Link>
      <RegionPicker />
      <div className="flex items-center gap-1">
        <button
          aria-label="알림"
          className="relative grid h-9 w-9 place-items-center text-[var(--color-text-secondary)]"
        >
          <Icon name="bell" size={20} />
          <span className="absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-[var(--color-danger)] px-1 text-[10px] font-bold text-white">
            3
          </span>
        </button>
        <button
          aria-label="메뉴"
          className="grid h-9 w-9 place-items-center text-[var(--color-text-secondary)]"
        >
          <Icon name="more" size={20} />
        </button>
      </div>
    </header>
  );
}
