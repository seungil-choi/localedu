import { Icon } from "@/components/Icon";
import type { Region } from "@/lib/types";

interface RegionOption {
  value: Region | "기타";
  label: string;
  ready: boolean;
}

const REGIONS: RegionOption[] = [
  { value: "강북구", label: "서울 강북구", ready: true },
  { value: "노원구", label: "서울 노원구", ready: false },
  { value: "도봉구", label: "서울 도봉구", ready: false },
  { value: "성북구", label: "서울 성북구", ready: false },
  { value: "기타",   label: "다른 지역 (준비 중)", ready: false },
];

interface Props {
  value?: Region;
  onChange: (v: Region) => void;
}

/** 온보딩 Step 1 — 거주 지역 선택. */
export function StepRegion({ value, onChange }: Props) {
  return (
    <div>
      <h1 className="text-[22px] font-bold">어디 사세요?</h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
        살고 계신 지역을 알려주시면 그 동네 학원부터 보여드려요.
      </p>
      <ul className="mt-5 flex flex-col gap-2">
        {REGIONS.map((r) => (
          <li key={r.value}>
            <RegionRow
              option={r}
              active={value === r.value}
              onClick={() => r.ready && onChange(r.value as Region)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RegionRow({
  option,
  active,
  onClick,
}: {
  option: RegionOption;
  active: boolean;
  onClick: () => void;
}) {
  const disabled = !option.ready;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
        active
          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
          : disabled
            ? "cursor-not-allowed border-[var(--color-border)] bg-[var(--color-bg-soft)] opacity-60"
            : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]"
      }`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ring-[var(--color-border)] ${
          option.ready
            ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
            : "bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)]"
        }`}
      >
        <Icon name={option.ready ? "location-filled" : "warning"} size={18} />
      </span>
      <span className="flex-1">
        <span className="block text-[14.5px] font-semibold">{option.label}</span>
        <span className="block text-[11.5px] text-[var(--color-text-tertiary)]">
          {option.ready ? "지금 데이터 제공 중" : "곧 제공 예정"}
        </span>
      </span>
      {active && <Icon name="check" size={16} color="var(--color-primary)" />}
    </button>
  );
}
