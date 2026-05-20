import { OnboardingClient } from "./_components/OnboardingClient";

export const metadata = {
  title: "환영합니다",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return <OnboardingClient />;
}
