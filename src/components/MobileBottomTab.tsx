"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";

const TABS: {
  href: string;
  label: string;
  icon: IconName;
  activeIcon?: IconName;
}[] = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/explore", label: "지도", icon: "map" },
  { href: "/saved", label: "보관함", icon: "bookmark", activeIcon: "bookmark-filled" },
  { href: "/me", label: "마이", icon: "user" },
];

/**
 * 모바일 하단 탭 네비.
 * - 4탭 구조 (홈/지도/보관함/마이)
 *   비교함은 보관함 안에서 다중 선택으로 진입
 * - 56px 본문 높이 + safe-area-inset (iOS 홈 인디케이터)
 * - 비활성 아이콘/라벨 색상은 text-secondary 사용 (WCAG AA 7.5:1)
 * - 활성 탭은 상단 인디케이터 바 + 굵은 아이콘 + 브랜드 색
 */
export function MobileBottomTab() {
  const pathname = usePathname();

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
            {active && (
              <span
                aria-hidden
                className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-b-full bg-[var(--color-primary)]"
              />
            )}

            <Icon name={iconName} size={22} strokeWidth={active ? 2.2 : 1.8} />
            <span className={`text-[12px] tracking-tight ${active ? "font-semibold" : "font-medium"}`}>
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
