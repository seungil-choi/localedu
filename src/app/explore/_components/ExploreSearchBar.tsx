"use client";

import { useRef } from "react";
import { Icon } from "@/components/Icon";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  size?: "md" | "sm";
}

/**
 * Explore 페이지 검색 입력 폼.
 * - 좌측 검색 아이콘 + 우측 클리어 버튼 + 검색 제출 버튼
 * - 데스크탑(md) / 모바일(sm) 크기 분기
 */
export function ExploreSearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "학원명, 과목, 동네 검색",
  size = "md",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function clear() {
    onChange("");
    inputRef.current?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  const inputPadding = size === "md" ? "py-2 pl-9 pr-3 text-[13.5px]" : "py-2 pl-8 pr-3 text-[13px]";
  const btnPadding = size === "md" ? "px-3.5 py-2 text-[13px]" : "px-3 text-[13px]";
  const iconLeft = size === "md" ? "left-3" : "left-2.5";
  const iconSize = size === "md" ? 15 : 14;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Icon
          name="search"
          size={iconSize}
          color="var(--color-text-tertiary)"
          className={`pointer-events-none absolute ${iconLeft} top-1/2 -translate-y-1/2`}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-soft)] ${inputPadding} outline-none focus:border-[var(--color-primary)] focus:bg-white`}
        />
        {value && (
          <button
            type="button"
            onClick={clear}
            aria-label="검색어 지우기"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
          >
            <Icon name="close" size={14} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className={`shrink-0 rounded-lg bg-[var(--color-primary)] ${btnPadding} font-semibold text-white hover:bg-[var(--color-primary-hover)]`}
      >
        검색
      </button>
    </form>
  );
}
