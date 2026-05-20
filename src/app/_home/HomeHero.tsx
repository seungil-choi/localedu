export function HomeHero() {
  return (
    <section className="px-4 pt-4">
      <div className="rounded-2xl bg-[var(--color-primary-soft)] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold leading-tight">
              우리 아이에게 딱 맞는
              <br />
              <span className="text-[var(--color-primary)]">학원</span>을 찾아보세요
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
              지역, 과목, 학년 등 다양한 조건으로
              <br />
              맞춤 학원을 추천해드려요.
            </p>
          </div>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <rect x="6" y="14" width="68" height="52" rx="8" fill="#fff" />
            <line x1="6" y1="30" x2="74" y2="30" stroke="#cdd0e8" strokeWidth="1" />
            <line x1="6" y1="46" x2="74" y2="46" stroke="#cdd0e8" strokeWidth="1" />
            <line x1="22" y1="14" x2="22" y2="66" stroke="#cdd0e8" strokeWidth="1" />
            <line x1="50" y1="14" x2="50" y2="66" stroke="#cdd0e8" strokeWidth="1" />
            <path d="M40 12 L40 4 L48 8 Z" fill="#a78bfa" />
            <circle cx="40" cy="40" r="14" fill="#4f46e5" />
            <circle cx="40" cy="38" r="5" fill="#fff" />
          </svg>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-3 ring-1 ring-black/5">
          <span className="text-[var(--color-text-tertiary)]">🔍</span>
          <input
            type="text"
            placeholder="학원명, 과목, 지역을 검색해보세요"
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[var(--color-text-tertiary)]"
          />
          <button
            aria-label="필터"
            className="grid h-8 w-8 place-items-center rounded-md bg-[var(--color-bg-muted)] text-[15px]"
          >
            ⇅
          </button>
        </div>
      </div>
    </section>
  );
}
