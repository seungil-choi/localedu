import type { MetadataRoute } from "next";

/**
 * /reviews 는 Phase 2 기능 (SCOPE.reviewFeedPage = false) 으로
 * MVP 동안 nav에서 노출되지 않으므로 색인도 차단한다.
 * /auth, /onboarding 도 검색 진입 경로로 부적절하므로 차단.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth", "/onboarding", "/reviews"],
      },
    ],
  };
}
