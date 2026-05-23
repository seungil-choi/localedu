import { Icon } from "@/components/Icon";
import type { Subject } from "@/lib/types";

const SUBJECTS: Subject[] = ["국어", "영어", "수학", "과학", "사회", "예체능", "코딩"];

interface Props {
  value: Subject[];
  onToggle: (s: Subject) => void;
}

/** 온보딩 Step 3 — 관심 과목 다중 선택. */
export function StepInterests({ value, onToggle }: Props) {
  return (
    <div>
      <h2 className="text-[22px] font-bold">관심 있는 과목을 골라주세요</h2>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
        여러 개 선택할 수 있어요. 나중에 변경할 수 있어요.
      </p>
      <ul className="mt-5 grid grid-cols-2 gap-2">
        {SUBJECTS.map((s) => {
          const active = value.includes(s);
          return (
            <li key={s}>
              <button
                type="button"
                onClick={() => onToggle(s)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                    : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]"
                }`}
              >
                <span className="text-[14.5px] font-semibold">{s}</span>
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${
                    active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-border-strong)] bg-white text-transparent"
                  }`}
                >
                  <Icon name="check" size={12} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-[11.5px] text-[var(--color-text-tertiary)]">
        · 관심 과목은 추천과 알림에만 사용돼요. 나머지 학원도 다 볼 수 있어요.
      </p>
    </div>
  );
}
