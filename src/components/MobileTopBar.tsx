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
      <button
        aria-label="알림"
        className="grid h-11 w-11 place-items-center text-[var(--color-text-secondary)]"
      >
        <Icon name="bell" size={20} />
      </button>
    </header>
  );
}
