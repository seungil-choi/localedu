import { type HTMLAttributes } from "react";

/**
 * 페이지 폭 시스템 (네이버 메인 / 부동산 표준 차용).
 *
 * - narrow (640px): 폼 위주 페이지. 마이, 인증, 모달 안.
 * - base   (1280px): 컨텐츠 표준. 홈·비교함·저장함·학원 상세·후기.
 * - wide   (1440px): 광활 — 큰 표·대시보드 페이지에서만 예외적으로.
 * - full   (max-w-none): 풀폭 — 지도 탐색 같은 페이지.
 *
 * 좌우 패딩: 모바일 16px / 데스크톱 24px (네이버와 동일 톤).
 */

const WIDTHS = {
  narrow: "max-w-[640px]",
  base: "max-w-[1280px]",
  wide: "max-w-[1440px]",
  full: "max-w-none",
} as const;

export type ContainerVariant = keyof typeof WIDTHS;

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: ContainerVariant;
  /** 좌우 padding 제거 (이미 부모가 padding 주는 경우) */
  flush?: boolean;
}

export function Container({
  variant = "base",
  flush = false,
  className = "",
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={`mx-auto w-full ${WIDTHS[variant]} ${flush ? "" : "px-4 md:px-6"} ${className}`}
    />
  );
}
