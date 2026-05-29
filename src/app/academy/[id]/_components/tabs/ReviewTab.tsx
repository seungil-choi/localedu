import { Icon } from "@/components/Icon";
import { Stars } from "@/components/Stars";
import { EmptyState } from "@/components/ui/EmptyState";
import { relativeTime } from "@/lib/format";
import type { Academy, Review } from "@/lib/types";

// 평점 분포 — 후기 데이터 누적 전까지 디자인용 더미 분포
const RATING_DIST = [
  { star: 5, pct: 66 },
  { star: 4, pct: 23 },
  { star: 3, pct: 8 },
  { star: 2, pct: 2 },
  { star: 1, pct: 1 },
];

interface Props {
  academy: Academy;
  reviews: Review[];
}

/** 후기 탭 — 별점 요약 + 키워드 + 후기 목록. */
export function ReviewTab({ academy: a, reviews }: Props) {
  const hasRating = a.rating > 0;

  if (!hasRating) {
    return (
      <EmptyState
        variant="section"
        icon="chat"
        title="아직 등록된 후기가 없어요"
        description="이 학원에 다녀보셨다면 첫 후기를 남겨주세요."
        action={
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-primary)] px-4 py-2 text-[13px] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]">
            <Icon name="edit" size={13} /> 첫 후기 남기기
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 text-center md:col-span-4 md:text-left">
            <div className="text-[13px] text-[var(--color-text-secondary)]">전체 만족도</div>
            <div className="mt-1 flex items-end justify-center gap-1 md:justify-start">
              <span className="text-[36px] font-bold leading-none sm:text-[44px]">{a.rating.toFixed(1)}</span>
              <span className="pb-0.5 text-[15px] text-[var(--color-text-tertiary)] sm:text-[16px]">/ 5</span>
            </div>
            <div className="mt-1 flex justify-center md:justify-start">
              <Stars rating={a.rating} size={18} />
            </div>
            <div className="mt-1.5 text-[12px] text-[var(--color-text-tertiary)]">
              {a.review_count}명 평가
            </div>
          </div>
          <ul className="col-span-12 space-y-2 md:col-span-8">
            {RATING_DIST.map(({ star, pct }) => (
              <li key={star} className="flex items-center gap-3 text-[13px]">
                <span className="w-8 shrink-0 text-right text-[var(--color-text-secondary)]">
                  {star}점
                </span>
                <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-primary)]"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="w-10 shrink-0 text-[var(--color-text-secondary)]">{pct}%</span>
              </li>
            ))}
          </ul>
        </div>

        {(a.pros_keywords.length > 0 || a.cons_keywords.length > 0) && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {a.pros_keywords.length > 0 && (
              <KeywordCard
                tone="pros"
                title="장점"
                icon="thumb"
                items={a.pros_keywords}
              />
            )}
            {a.cons_keywords.length > 0 && (
              <KeywordCard
                tone="cons"
                title="아쉬운 점"
                icon="warning"
                items={a.cons_keywords}
              />
            )}
          </div>
        )}
      </div>

      {reviews.length > 0 && (
        <ul className="grid gap-3 md:grid-cols-2">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </ul>
      )}
    </div>
  );
}

function KeywordCard({
  tone,
  title,
  icon,
  items,
}: {
  tone: "pros" | "cons";
  title: string;
  icon: "thumb" | "warning";
  items: { label: string; count: number }[];
}) {
  const palette = tone === "pros" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700";
  return (
    <div className={`rounded-xl p-4 ${palette.split(" ")[0]}`}>
      <div className={`mb-2 flex items-center gap-1.5 text-[13px] font-semibold ${palette.split(" ")[1]}`}>
        <Icon name={icon} size={14} /> {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((k) => (
          <li key={k.label} className="flex items-center justify-between text-[13px]">
            <span>· {k.label}</span>
            <span className="text-[11px] text-[var(--color-text-tertiary)]">({k.count}명)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReviewCard({ review: r }: { review: Review }) {
  return (
    <li className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-semibold text-[var(--color-primary)]">
          {r.parent_grade}
        </span>
        <span className="text-[11.5px] text-[var(--color-text-tertiary)]">
          {relativeTime(r.created_at)}
        </span>
      </div>
      <p className="mt-2 text-[14px] leading-relaxed">{r.content}</p>
      <div className="mt-2.5 flex items-center gap-2">
        <Stars rating={r.rating} size={13} />
        {r.pros && r.pros.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {r.pros.map((p) => (
              <span
                key={p}
                className="rounded-full bg-[var(--color-bg-soft)] px-2 py-0.5 text-[11px] text-[var(--color-text-secondary)]"
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
