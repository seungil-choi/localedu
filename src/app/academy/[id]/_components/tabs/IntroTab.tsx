import { AcademyCard } from "@/components/AcademyCard";
import { Icon, type IconName } from "@/components/Icon";
import { Chip } from "@/components/ui/Chip";
import type { Academy } from "@/lib/types";
import { MatchCard } from "../MatchCard";

interface Props {
  academy: Academy;
  similar: Academy[];
}

/**
 * 소개 탭 (Overview).
 *
 * 구성 (학부모 1차 의사결정에 필요한 모든 정보):
 *   - judgement / one_line_summary (학원 인상)
 *   - 핵심 메트릭 5종 (수업스타일/난이도/숙제량/정원/레벨테스트)
 *   - 특장점 태그
 *   - 매칭 (MatchCard)
 *   - 비슷한 학원
 */
export function IntroTab({ academy: a, similar }: Props) {
  const tags = [
    ...a.meta.features,
    ...a.meta.teaching_style,
    ...a.recommended_for.slice(0, 3),
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {a.judgement && (
        <blockquote className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] p-5 text-[15px] leading-relaxed">
          &ldquo;{a.judgement}&rdquo;
        </blockquote>
      )}

      {a.one_line_summary && (
        <p className="text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
          {a.one_line_summary}
        </p>
      )}

      <KeyMetrics academy={a} />

      <section>
        <h3 className="mb-3 text-[15px] font-bold">특장점</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Chip key={tag} size="md">
              {tag}
            </Chip>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-[15px] font-bold">우리 아이에게 맞나요?</h3>
        <MatchCard
          ageGroups={a.age_groups}
          subject={a.subject}
          recommendedFor={a.recommended_for}
        />
      </section>

      {similar.length > 0 && (
        <section>
          <h3 className="mb-3 text-[15px] font-bold">비슷한 학원</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {similar.map((o) => (
              <AcademyCard key={o.id} academy={o} variant="list" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ──── 핵심 메트릭 5종 ──── */

interface Metric {
  label: string;
  value: string;
  icon: IconName;
  tone?: string;
}

function KeyMetrics({ academy: a }: { academy: Academy }) {
  const metrics: Metric[] = [
    {
      label: "수업 스타일",
      value: a.meta.teaching_style.join(" / ") || "—",
      icon: "users",
    },
    { label: "수업 난이도", value: a.meta.difficulty, icon: "sparkles" },
    {
      label: "숙제량",
      value: a.meta.homework_level,
      icon: "clipboard",
      tone:
        a.meta.homework_level === "많음"
          ? "text-rose-500"
          : a.meta.homework_level === "적음"
            ? "text-emerald-600"
            : undefined,
    },
    { label: "정원", value: `${a.meta.capacity}명`, icon: "users" },
    {
      label: "레벨 테스트",
      value: a.meta.level_test ? "있음" : "없음",
      icon: "check-circle",
    },
  ];

  return (
    <section>
      <h3 className="mb-3 text-[15px] font-bold">핵심 정보</h3>
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-5">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>
    </section>
  );
}

function MetricCard({ label, value, icon, tone }: Metric) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-3.5">
      <div className="grid h-8 w-8 place-items-center rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <Icon name={icon} size={16} />
      </div>
      <div className="mt-2.5 text-[12px] text-[var(--color-text-secondary)]">{label}</div>
      <div className={`text-[14px] font-bold ${tone ?? ""}`}>{value}</div>
    </div>
  );
}
