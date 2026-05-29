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
 * - 56px 본문 높이 + safe-area-inset (iOS 홈 인디케이터)
 * - 비활성 아이콘/라벨 색상은 text-secondary 사용 (WCAG AA 7.5:1)
 * - 활성 탭은 상단 인디케이터 바 + 굵은 아이콘 + 브랜드 색
 * - 약한 위쪽 그림자로 본문과 시각적으로 분리
 */
export function MobileBottomTab() {
  const pathname = usePathname();
  const compareCount = useAppStore((s) => s.compareIds.length);

  return (
    <nav
      aria-label="모바일 메인 메뉴"
      className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-[var(--color-border)] bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.04)] md:hidden"
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
            aria-label={t.label}
            aria-current={active ? "page" : undefined}
            className={`relative flex h-14 flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
              active
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            {/* 활성 인디케이터 — 상단 막대 */}
            {active && (
              <span
                aria-hidden
                className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-b-full bg-[var(--color-primary)]"
              />
            )}

            <span className="relative inline-flex">
              <Icon name={iconName} size={22} strokeWidth={active ? 2.2 : 1.8} />
              {t.href === "/compare" && compareCount > 0 && (
                <span
                  aria-label={`비교 ${compareCount}개`}
                  className="absolute -right-2 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-white ring-2 ring-white"
                >
                  {compareCount}
                </span>
              )}
            </span>
            <span className={`text-[12px] tracking-tight ${active ? "font-semibold" : "font-medium"}`}>
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
