"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";
import { useAppStore } from "@/store/useAppStore";

const TABS: { href: string; label: string; icon: IconName; activeIcon?: IconName }[] = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/explore", label: "지도", icon: "map" },
  { href: "/compare", label: "비교함", icon: "compare" },
  { href: "/saved", label: "저장함", icon: "bookmark", activeIcon: "bookmark-filled" },
  { href: "/me", label: "마이", icon: "user" },
];

export function MobileBottomTab() {
  const pathname = usePathname();
  const compareCount = useAppStore((s) => s.compareIds.length);
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-[var(--color-border)] bg-white md:hidden">
      {TABS.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        const iconName = active && t.activeIcon ? t.activeIcon : t.icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5"
            style={{
              color: active
                ? "var(--color-primary)"
                : "var(--color-text-tertiary)",
            }}
          >
            <Icon name={iconName} size={22} strokeWidth={active ? 2 : 1.6} />
            <span className="text-[11px] font-medium">{t.label}</span>
            {t.href === "/compare" && compareCount > 0 && (
              <span className="absolute right-[28%] top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-white">
                {compareCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
