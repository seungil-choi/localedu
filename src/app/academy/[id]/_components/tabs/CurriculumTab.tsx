import { Icon } from "@/components/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Academy } from "@/lib/types";

interface Props {
  academy: Academy;
}

/** 커리큘럼 탭 — 수업 과정 + 추천 학생. */
export function CurriculumTab({ academy: a }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <h3 className="mb-4 text-[15px] font-bold">수업 과정</h3>
        {a.meta.features.length > 0 ? (
          <ul className="space-y-3">
            {a.meta.features.map((f, i) => (
              <li key={f} className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-primary-soft)] text-[11px] font-bold text-[var(--color-primary)]">
                  {i + 1}
                </span>
                <span className="text-[14px] leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            variant="inline"
            icon="clipboard"
            title="커리큘럼 정보 준비 중"
            description="학원에 직접 문의하시면 자세한 교육 과정을 안내받을 수 있어요."
          />
        )}
      </div>

      {a.recommended_for.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <h3 className="mb-3 text-[14px] font-bold">이런 학생에게 추천해요</h3>
          <ul className="space-y-2">
            {a.recommended_for.map((r) => (
              <li key={r} className="flex items-center gap-2 text-[13.5px]">
                <Icon name="check-circle" size={14} color="var(--color-primary)" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
