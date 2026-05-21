export default function ExploreLoading() {
  return (
    <div className="flex h-[calc(100vh-57px)] animate-pulse">
      {/* 데스크탑 좌측 패널 skeleton */}
      <div className="hidden w-[380px] shrink-0 flex-col gap-3 border-r border-[var(--color-border)] bg-white p-3 md:flex">
        <div className="h-10 rounded-xl bg-[var(--color-bg-muted)]" />
        <div className="flex gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-7 w-12 rounded-full bg-[var(--color-bg-muted)]" />
          ))}
        </div>
        <div className="h-4 w-24 rounded bg-[var(--color-bg-muted)]" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-[var(--color-bg-muted)]" />
        ))}
      </div>

      {/* 지도 영역 skeleton */}
      <div className="flex-1 bg-[var(--color-bg-soft)]" />

      {/* 모바일 바텀시트 skeleton */}
      <div className="fixed bottom-16 left-0 right-0 z-20 rounded-t-2xl border-t border-[var(--color-border)] bg-white p-4 md:hidden">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--color-border-strong)]" />
        <div className="h-9 rounded-xl bg-[var(--color-bg-muted)]" />
        <div className="mt-2 flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-7 w-12 rounded-full bg-[var(--color-bg-muted)]" />
          ))}
        </div>
      </div>
    </div>
  );
}
