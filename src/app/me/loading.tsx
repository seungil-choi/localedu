/** 마이 페이지 스켈레톤. */
export default function MeLoading() {
  return (
    <div className="mx-auto max-w-[640px] animate-pulse px-4 py-6 md:px-6">
      <div className="h-7 w-24 rounded bg-[var(--color-bg-muted)]" />

      <section className="mt-4 rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-[var(--color-bg-muted)]" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 rounded bg-[var(--color-bg-muted)]" />
            <div className="h-4 w-40 rounded bg-[var(--color-bg-muted)]" />
          </div>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--color-border)] bg-white p-4"
          >
            <div className="h-4 w-20 rounded bg-[var(--color-bg-muted)]" />
            <div className="mt-2 h-6 w-12 rounded bg-[var(--color-bg-muted)]" />
          </div>
        ))}
      </section>
    </div>
  );
}
