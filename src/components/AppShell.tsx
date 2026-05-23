import { Header } from "./Header";
import { MobileTopBar } from "./MobileTopBar";
import { MobileBottomTab } from "./MobileBottomTab";
import { SaveLoginToast } from "./SaveLoginToast";

/**
 * 앱 전체 레이아웃 셸.
 *
 * - 키보드 사용자를 위한 skip-link (Tab 첫 진입 시 노출)
 * - 데스크탑 Header / 모바일 TopBar+BottomTab
 * - 토스트 슬롯
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 키보드 사용자: Tab 시 본문으로 바로 점프 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-[14px] focus:font-semibold focus:text-white focus:shadow-lg"
      >
        본문으로 건너뛰기
      </a>
      <Header />
      <MobileTopBar />
      <main id="main-content" className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <MobileBottomTab />
      <SaveLoginToast />
    </div>
  );
}
