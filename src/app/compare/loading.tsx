/** 비교 페이지 스켈레톤. */
export default function CompareLoading() {
  return (
    <div className="mx-auto max-w-[1280px] animate-pulse px-4 py-6 md:px-6">
      <div className="h-4 w-24 rounded bg-[var(--color-bg-muted)]" />
      <div className="mt-2 h-8 w-32 rounded bg-[var(--color-bg-muted)]" />
      <div className="mt-1 h-4 w-72 rounded bg-[var(--color-bg-muted)]" />

      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-border)]">
        <div className="h-32 bg-[var(--color-bg-soft)]" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex h-12 items-center border-t border-[var(--color-border)] px-4"
          >
            <div className="h-4 w-24 rounded bg-[var(--color-bg-muted)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
