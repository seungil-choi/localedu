export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-primary)]" />
        <span className="text-[13px] text-[var(--color-text-secondary)]">불러오는 중…</span>
      </div>
    </div>
  );
}
