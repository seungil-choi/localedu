const GRADE_GROUPS: { label: string; grades: string[] }[] = [
  { label: "유아 (3~7세)", grades: ["유아"] },
  {
    label: "초등",
    grades: [
      "초등 1학년",
      "초등 2학년",
      "초등 3학년",
      "초등 4학년",
      "초등 5학년",
      "초등 6학년",
    ],
  },
  { label: "중등", grades: ["중등 1학년", "중등 2학년", "중등 3학년"] },
  { label: "고등", grades: ["고등 1학년", "고등 2학년", "고등 3학년"] },
];

interface Props {
  value?: string;
  onChange: (v: string) => void;
}

/** 온보딩 Step 2 — 자녀 학년 선택. */
export function StepGrade({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-[22px] font-bold">자녀가 몇 학년이에요?</h2>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
        학년에 맞는 학원과 후기를 우선 보여드려요.
      </p>
      <div className="mt-5 flex flex-col gap-4">
        {GRADE_GROUPS.map((g) => (
          <fieldset key={g.label}>
            <legend className="text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {g.label}
            </legend>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {g.grades.map((gr) => {
                const active = value === gr;
                return (
                  <button
                    key={gr}
                    type="button"
                    onClick={() => onChange(gr)}
                    className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
                      active
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {gr}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <p className="mt-5 text-[11.5px] text-[var(--color-text-tertiary)]">
        · 자녀가 여러 명이라면 가장 많이 검색하실 학년을 선택해주세요. 마이에서 추가/변경할 수 있어요.
      </p>
    </div>
  );
}
