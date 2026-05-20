import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { AuthListener } from "@/components/AuthListener";

const notoSans = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://localedu.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "학원지도 — 우리 동네 학원을 지도에서 비교하세요",
    template: "%s · 학원지도",
  },
  description:
    "위치 기반으로 강북·노원·도봉·성북 학원을 지도에서 발견하고 비교하세요.",
  keywords: [
    "학원",
    "강북구 학원",
    "노원구 학원",
    "도봉구 학원",
    "성북구 학원",
    "학원 비교",
    "학원 지도",
    "수유동 학원",
    "미아동 학원",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "학원지도",
    title: "학원지도 — 우리 동네 학원을 지도에서 비교하세요",
    description:
      "위치 기반으로 강북·노원·도봉·성북 학원을 지도에서 발견하고 비교하세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "학원지도",
    description: "위치 기반 학원 비교 서비스",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        <AuthListener />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
