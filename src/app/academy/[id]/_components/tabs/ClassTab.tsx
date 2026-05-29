import { Icon } from "@/components/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Academy } from "@/lib/types";

const DAY_ORDER = ["월", "화", "수", "목", "금", "토", "일"];

interface Props {
  academy: Academy;
}

/**
 * 수업·커리큘럼 탭 (How it works).
 *
 * 구성:
 *   1. 주간 시간표
 *   2. 운영 정보
 *   3. 커리큘럼 (수업 과정 + 추천 학생)
 *   4. 강사진 (Phase 2 — placeholder)
 *
 * 핵심 메트릭(스타일/난이도/숙제량/정원/레벨테스트)은 IntroTab으로 이동.
 */
export function ClassTab({ academy: a }: Props) {
  return (
    <div className="space-y-6">
      <ScheduleCard academy={a} />
      <OperationsCard academy={a} />
      <CurriculumCard academy={a} />
      <FacultyCard />
    </div>
  );
}

/* ──── 주간 시간표 ──── */

function ScheduleCard({ academy: a }: { academy: Academy }) {
  if (a.class_days.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
      <h3 className="mb-3 flex items-center gap-1.5 text-[14px] font-bold">
        <Icon name="calendar-days" size={15} color="var(--color-primary)" />
        주간 시간표
      </h3>
      <div className="grid grid-cols-7 gap-1.5">
        {DAY_ORDER.map((d) => {
          const on = a.class_days.includes(d);
          return (
            <div
              key={d}
              className={`grid h-14 place-items-center rounded-lg text-[14px] font-bold ${
                on
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
                  : "bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)]"
              }`}
            >
              {d}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[13px] text-[var(--color-text-secondary)]">
        주 <b>{a.meta.class_per_week}회</b> · 회당 <b>{a.meta.class_minutes}분</b>
      </p>
    </section>
  );
}

/* ──── 운영 정보 ──── */

function OperationsCard({ academy: a }: { academy: Academy }) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
      <h3 className="mb-4 text-[14px] font-bold">운영 정보</h3>
      <dl className="grid grid-cols-[100px_1fr] gap-y-3 text-[13px]">
        <dt className="text-[var(--color-text-secondary)]">수업 시간</dt>
        <dd className="font-medium">
          주 {a.meta.class_per_week}회 / 회당 {a.meta.class_minutes}분
        </dd>
        {a.class_days.length > 0 && (
          <>
            <dt className="text-[var(--color-text-secondary)]">수업 요일</dt>
            <dd className="font-medium">{a.class_days.join(" · ")}</dd>
          </>
        )}
        <dt className="text-[var(--color-text-secondary)]">정원</dt>
        <dd className="font-medium">{a.meta.capacity}명</dd>
        <dt className="text-[var(--color-text-secondary)]">레벨 테스트</dt>
        <dd className="font-medium">{a.meta.level_test ? "있음 (무료)" : "없음"}</dd>
        {a.consultation_hours.weekday && (
          <>
            <dt className="text-[var(--color-text-secondary)]">상담 시간</dt>
            <dd className="font-medium">
              {a.consultation_hours.weekday && <>평일 {a.consultation_hours.weekday}</>}
              {a.consultation_hours.weekend && (
                <>
                  <br />토 {a.consultation_hours.weekend}
                </>
              )}
            </dd>
          </>
        )}
      </dl>
    </section>
  );
}

/* ──── 커리큘럼 ──── */

function CurriculumCard({ academy: a }: { academy: Academy }) {
  const hasFeatures = a.meta.features.length > 0;
  const hasRecommended = a.recommended_for.length > 0;

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
      <h3 className="mb-4 text-[15px] font-bold">커리큘럼</h3>

      {hasFeatures ? (
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

      {hasRecommended && (
        <div className="mt-5 border-t border-[var(--color-border)] pt-5">
          <h4 className="mb-3 text-[14px] font-bold">이런 학생에게 추천해요</h4>
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
    </section>
  );
}

/* ──── 강사진 (Phase 2 placeholder) ──── */

function FacultyCard() {
  const roles = ["학원장 / 대표 강사", "수학 담당 강사", "영어 담당 강사"];

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
      <h3 className="mb-4 text-[15px] font-bold">강사진</h3>
      <EmptyState
        variant="inline"
        icon="users"
        title="강사진 정보 준비 중"
        description="담당 선생님 정보는 상담을 통해 직접 확인하실 수 있어요."
      />
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {roles.map((role) => (
          <div
            key={role}
            className="rounded-xl border border-dashed border-[var(--color-border)] p-4 text-center"
          >
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)]">
              <Icon name="users" size={20} />
            </span>
            <p className="mt-2 text-[12.5px] text-[var(--color-text-secondary)]">{role}</p>
            <p className="text-[11.5px] text-[var(--color-text-tertiary)]">정보 준비 중</p>
          </div>
        ))}
      </div>
    </section>
  );
}
