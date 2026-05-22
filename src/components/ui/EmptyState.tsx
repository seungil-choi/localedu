import type { ReactNode } from "react";
import { IconBadge } from "./IconBadge";
import type { IconName } from "../Icon";

/**
 * 빈 상태/플레이스홀더 카드.
 *
 * 사용:
 *   <EmptyState
 *     icon="bookmark"
 *     title="저장한 학원이 없어요"
 *     description="지도에서 마음에 드는 학원을 저장해보세요."
 *     action={<Link href="/explore">지도 탐색으로 가기</Link>}
 *   />
 *
 * variants
 *   - "card" (default): 점선 보더 + 패딩 + 둥근 모서리 — 페이지 안에 배치
 *   - "section": 안내 박스, 보더 없는 강조 카드 — 큰 빈 영역
 *   - "inline": 보더 없음 — 다른 카드 안에 배치
 */
interface Props {
  icon: IconName;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: "card" | "section" | "inline";
  /** action 외 보조 CTA (텍스트 링크) */
  secondaryAction?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "card",
}: Props) {
  const wrapper =
    variant === "card"
      ? "rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-white p-8"
      : variant === "section"
        ? "rounded-2xl bg-[var(--color-bg-soft)] p-8"
        : "py-8";

  return (
    <div className={`flex flex-col items-center text-center ${wrapper}`}>
      <IconBadge name={icon} size="lg" tone="muted" shape="circle" />
      <h3 className="mt-3 text-[15px] font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-[320px] text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
      {secondaryAction && <div className="mt-2">{secondaryAction}</div>}
    </div>
  );
}
