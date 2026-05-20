export default function AcademyDetailLoading() {
  return (
    <div className="mx-auto max-w-[1280px] animate-pulse px-4 py-6 md:px-6">
      {/* 브레드크럼 */}
      <div className="mb-4 h-4 w-48 rounded bg-[var(--color-border)]" />

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* 히어로 이미지 */}
          <div className="h-72 rounded-2xl bg-[var(--color-border)]" />

          {/* 섹션 스켈레톤 3개 */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-[var(--color-border)] p-5">
              <div className="mb-3 h-5 w-40 rounded bg-[var(--color-border)]" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-[var(--color-border)]" />
                <div className="h-4 w-4/5 rounded bg-[var(--color-border)]" />
              </div>
            </div>
          ))}
        </div>

        {/* 사이드바 */}
        <div className="hidden space-y-4 md:block">
          <div className="h-8 w-48 rounded bg-[var(--color-border)]" />
          <div className="h-32 rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)]" />
        </div>
      </div>
    </div>
  );
}
