import { AcademyCard } from "@/components/AcademyCard";
import { Chip } from "@/components/ui/Chip";
import type { Academy } from "@/lib/types";
import { MatchCard } from "../MatchCard";

interface Props {
  academy: Academy;
  similar: Academy[];
}

/** 학원 소개 탭 — judgement, 특장점 태그, 매칭, 비슷한 학원. */
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
              <AcademyCard key={o.id} academy={o} variant="list" showCompareButton />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
