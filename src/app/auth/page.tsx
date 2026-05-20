import { Suspense } from "react";
import { AuthClient } from "./_components/AuthClient";

export const metadata = {
  title: "로그인",
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthClient />
    </Suspense>
  );
}
