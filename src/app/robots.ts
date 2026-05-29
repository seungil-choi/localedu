import type { MetadataRoute } from "next";

/**
 * 색인 차단 경로:
 *   /auth, /onboarding     — 검색 진입 경로로 부적절
 *   /reviews              — Phase 2 기능, nav 노출 X
 *   /compare              — URL 파라미터 기반 세션 페이지 (검색 결과 부적합)
 *   /me, /saved           — 개인 데이터 페이지
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth", "/onboarding", "/reviews", "/compare", "/me", "/saved"],
      },
    ],
  };
}
