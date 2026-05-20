export function Stars({
  rating,
  size = 14,
  showCount,
  count,
}: {
  rating: number;
  size?: number;
  showCount?: boolean;
  count?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span style={{ fontSize: size, lineHeight: 1, color: "#facc15" }}>★</span>
      <span className="font-semibold" style={{ fontSize: size }}>
        {rating.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span
          className="text-[var(--color-text-tertiary)]"
          style={{ fontSize: size - 1 }}
        >
          ({count})
        </span>
      )}
    </span>
  );
}
