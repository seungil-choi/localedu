/**
 * 모바일 홈 상단 Hero — 임팩트 영역만 담당.
 * 실제 검색은 하단 HomeSearchPanel이 처리.
 */
export function HomeHero() {
  return (
    <section className="px-4 pt-4">
      <div className="overflow-hidden rounded-2xl bg-[var(--color-primary-soft)] px-5 pb-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-bold leading-tight tracking-tight">
              우리 아이에게 딱 맞는
              <br />
              <span className="text-[var(--color-primary)]">학원</span>을 찾아보세요
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
              지역·과목·학년 조건으로
              <br />
              맞춤 학원을 추천해드려요.
            </p>
          </div>
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

/** Hero 일러스트 — 지도 핀 + 책 모티프 */
function HeroIllustration() {
  return (
    <svg
      width="92"
      height="92"
      viewBox="0 0 92 92"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      {/* 지도 카드 (배경) */}
      <rect x="8" y="18" width="76" height="58" rx="10" fill="#fff" />
      <line x1="8" y1="36" x2="84" y2="36" stroke="#dde0f3" strokeWidth="1" />
      <line x1="8" y1="54" x2="84" y2="54" stroke="#dde0f3" strokeWidth="1" />
      <line x1="28" y1="18" x2="28" y2="76" stroke="#dde0f3" strokeWidth="1" />
      <line x1="58" y1="18" x2="58" y2="76" stroke="#dde0f3" strokeWidth="1" />

      {/* 보조 위치 점 */}
      <circle cx="20" cy="46" r="2.5" fill="#a78bfa" />
      <circle cx="68" cy="64" r="2.5" fill="#a78bfa" />

      {/* 메인 핀 */}
      <path
        d="M46 14c-7 0-12 5.4-12 12 0 9 12 18 12 18s12-9 12-18c0-6.6-5-12-12-12z"
        fill="#4f46e5"
      />
      <circle cx="46" cy="26" r="5" fill="#fff" />
    </svg>
  );
}
