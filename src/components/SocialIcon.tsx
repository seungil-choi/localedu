/**
 * Social provider 공식 로고 — 카카오/네이버/Google.
 *
 * 디자인 가이드 준수:
 *   - 카카오: 노란 배경(#FEE500) + 검정 말풍선
 *   - 네이버: 초록 배경(#03C75A) + 흰색 'N'
 *   - Google: 4-color G mark on white
 */
type Provider = "kakao" | "naver" | "google";

export function SocialIcon({ provider, size = 18 }: { provider: Provider; size?: number }) {
  if (provider === "kakao") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          d="M12 3.5C6.75 3.5 2.5 6.83 2.5 10.94c0 2.66 1.78 4.99 4.46 6.3l-1.13 4.13c-.1.36.3.65.62.45l4.94-3.27c.2.02.4.03.61.03 5.25 0 9.5-3.33 9.5-7.44S17.25 3.5 12 3.5Z"
          fill="#000"
        />
      </svg>
    );
  }
  if (provider === "naver") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path d="M14.04 12.61 9.56 6H5v12h4.96V11.39L14.44 18H19V6h-4.96v6.61Z" fill="#fff" />
      </svg>
    );
  }
  // Google — 4-color
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M21.6 12.23c0-.65-.06-1.27-.17-1.86H12v3.52h5.4a4.62 4.62 0 0 1-2 3.03v2.51h3.23c1.89-1.74 2.97-4.3 2.97-7.2Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.23-2.5c-.9.6-2.05.95-3.4.95-2.62 0-4.83-1.77-5.62-4.15H3.04v2.6A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.38 13.87a6 6 0 0 1 0-3.81V7.46H3.04a10 10 0 0 0 0 9.01l3.34-2.6Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.96c1.47 0 2.79.5 3.83 1.5l2.87-2.86C16.97 3 14.7 2 12 2A10 10 0 0 0 3.04 7.46l3.34 2.6C7.17 7.73 9.38 5.96 12 5.96Z"
        fill="#EA4335"
      />
    </svg>
  );
}
