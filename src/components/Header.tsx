"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./Brand";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { RegionPicker } from "./RegionPicker";
import { useAppStore } from "@/store/useAppStore";

// 4탭 구조 — 비교함은 보관함 안에서 다중 선택으로 진입
const NAV: { href: string; label: string }[] = [
  { href: "/", label: "홈" },
  { href: "/explore", label: "지도 탐색" },
  { href: "/saved", label: "보관함" },
  { href: "/me", label: "마이" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 hidden border-b border-[var(--color-border)] bg-white md:block">
      <Container className="flex items-center justify-between py-3">
        <div className="flex items-center gap-6">
          <Link href="/">
            <BrandLogo />
          </Link>
          <RegionPicker />
        </div>

        <nav className="flex items-center gap-2">
          {NAV.map((n) => {
            const active =
              n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {n.label}
                {active && (
                  <span className="absolute -bottom-3 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded bg-[var(--color-primary)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <UserSlot />
        </div>
      </Container>
    </header>
  );
}

function UserSlot() {
  const user = useAppStore((s) => s.user);
  if (!user) {
    return (
      <Link
        href="/auth"
        className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-sm font-medium hover:bg-[var(--color-bg-soft)]"
      >
        로그인
      </Link>
    );
  }
  return (
    <Link
      href="/me"
      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white py-1 pl-1 pr-3 text-sm font-medium hover:bg-[var(--color-bg-soft)]"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-primary-soft)] text-[12px] font-bold text-[var(--color-primary)]">
        {user.name.charAt(0)}
      </span>
      <span className="hidden lg:inline">{user.name}</span>
      <Icon name="down" size={14} color="var(--color-text-tertiary)" />
    </Link>
  );
}
