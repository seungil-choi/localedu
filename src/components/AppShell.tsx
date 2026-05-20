import { Header } from "./Header";
import { MobileTopBar } from "./MobileTopBar";
import { MobileBottomTab } from "./MobileBottomTab";
import { SaveLoginToast } from "./SaveLoginToast";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <MobileTopBar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileBottomTab />
      <SaveLoginToast />
    </div>
  );
}
