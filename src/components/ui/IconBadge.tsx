import { Icon, type IconName } from "../Icon";

/**
 * 원형/사각 아이콘 배지 — 빈 상태, 메뉴, 카드 헤더 등에 사용.
 *
 * 사이즈는 디자인 시스템 표준 4단계:
 *   - sm: 28px (메뉴 항목)
 *   - md: 36px (카드 한 줄)
 *   - lg: 56px (빈 상태)
 *   - xl: 80px (히어로/온보딩 환영 화면)
 */
type Size = "sm" | "md" | "lg" | "xl";

interface Props {
  name: IconName;
  size?: Size;
  /** "soft" (default): primary-soft 배경 / "muted": bg-soft 배경 / "ghost": 투명 */
  tone?: "soft" | "muted" | "ghost";
  /** 원형 vs 둥근 사각형 */
  shape?: "circle" | "rounded";
  className?: string;
}

const BOX: Record<Size, string> = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-14 w-14",
  xl: "h-20 w-20",
};

const ICON_SIZE: Record<Size, number> = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 36,
};

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  soft: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  muted: "bg-[var(--color-bg-soft)] text-[var(--color-text-secondary)]",
  ghost: "bg-transparent text-[var(--color-text-secondary)]",
};

export function IconBadge({
  name,
  size = "md",
  tone = "soft",
  shape = "rounded",
  className,
}: Props) {
  const radius = shape === "circle" ? "rounded-full" : "rounded-xl";
  return (
    <span
      className={`grid shrink-0 place-items-center ${BOX[size]} ${radius} ${TONE[tone]} ${className ?? ""}`}
    >
      <Icon name={name} size={ICON_SIZE[size]} />
    </span>
  );
}
