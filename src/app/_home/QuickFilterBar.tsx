import Link from "next/link";

const ITEMS = [
  { label: "연령", value: "초등", icon: "🧒" },
  { label: "과목", value: "영어", icon: "🅰" },
  { label: "거리", value: "1km 이내", icon: "📍" },
  { label: "가격", value: "30만원 이하", icon: "₩" },
  { label: "수업 스타일", value: "소수 정예", icon: "👥" },
  { label: "숙제량", value: "적당함", icon: "🏠" },
];

export function QuickFilterBar() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold">빠른 조건 선택</h3>
        <Link
          href="/explore"
          className="text-[12px] text-[var(--color-primary)]"
        >
          ⇅ 필터 더보기
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-6 gap-2">
        {ITEMS.map((it) => (
          <button
            key={it.label}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-3 py-2.5 text-left hover:bg-white"
          >
            <span className="grid h-7 w-7 place-items-center rounded-md bg-white text-[12px]">
              {it.icon}
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] text-[var(--color-text-secondary)]">
                {it.label}
              </span>
              <span className="block truncate text-[13px] font-semibold">
                {it.value}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
