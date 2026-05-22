"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";
import { useAppStore } from "@/store/useAppStore";

const TABS: {
  href: string;
  label: string;
  icon: IconName;
  activeIcon?: IconName;
}[] = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/explore", label: "지도", icon: "map" },
  { href: "/compare", label: "비교함", icon: "compare" },
  { href: "/saved", label: "저장함", icon: "bookmark", activeIcon: "bookmark-filled" },
  { href: "/me", label: "마이", icon: "user" },
];

/**
 * 모바일 하단 탭 네비.
 * - 각 탭은 최소 56px 높이 (Material 표준 + 한국형 안전 영역)
 * - safe-area-inset-bottom 자동 적용 (iOS 노치)
 */
export function MobileBottomTab() {
  const pathname = usePathname();
  const compareCount = useAppStore((s) => s.compareIds.length);
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-[var(--color-border)] bg-white md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map((t) => {
        const active =
          t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        const iconName = active && t.activeIcon ? t.activeIcon : t.icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            className="relative flex h-14 flex-1 flex-col items-center justify-center gap-0.5"
            style={{
              color: active
                ? "var(--color-primary)"
                : "var(--color-text-tertiary)",
            }}
          >
            <span className="relative inline-flex">
              <Icon name={iconName} size={22} strokeWidth={active ? 2 : 1.6} />
              {t.href === "/compare" && compareCount > 0 && (
                <span className="absolute -right-2 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {compareCount}
                </span>
              )}
            </span>
            <span className="text-[11px] font-medium">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
