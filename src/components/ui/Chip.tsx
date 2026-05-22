/**
 * 소형 태그/칩 — 학원 특징, 카테고리 라벨 등에 사용.
 *
 * variants
 *   - "muted" (default): 회색 배경 (정보용)
 *   - "primary": 브랜드 색 (강조용)
 */
interface Props {
  children: React.ReactNode;
  variant?: "muted" | "primary";
  size?: "sm" | "md";
}

export function Chip({ children, variant = "muted", size = "sm" }: Props) {
  const palette =
    variant === "primary"
      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
      : "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]";

  const sizing =
    size === "md"
      ? "px-2 py-0.5 text-[12px]"
      : "px-1.5 py-0.5 text-[11px]";

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium ${palette} ${sizing}`}
    >
      {children}
    </span>
  );
}
