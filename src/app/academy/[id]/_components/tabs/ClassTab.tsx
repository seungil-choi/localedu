import { Icon, type IconName } from "@/components/Icon";
import type { Academy } from "@/lib/types";

const DAY_ORDER = ["월", "화", "수", "목", "금", "토", "일"];

interface Props {
  academy: Academy;
}

/** 수업 정보 탭 — 메트릭 카드 5종 + 주간 시간표 + 운영 정보. */
export function ClassTab({ academy: a }: Props) {
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
    <div className="space-y-6">
      {/* 핵심 지표 카드 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* 주간 시간표 */}
      {a.class_days.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <div className="mb-3 flex items-center gap-1.5 text-[14px] font-bold">
            <Icon name="calendar-days" size={15} color="var(--color-primary)" />
            주간 시간표
          </div>
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
        </div>
      )}

      {/* 운영 정보 */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
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
      </div>
    </div>
  );
}

interface Metric {
  label: string;
  value: string;
  icon: IconName;
  tone?: string;
}

function MetricCard({ label, value, icon, tone }: Metric) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
      <div className="grid h-8 w-8 place-items-center rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <Icon name={icon} size={16} />
      </div>
      <div className="mt-2.5 text-[12px] text-[var(--color-text-secondary)]">{label}</div>
      <div className={`text-[14px] font-bold ${tone ?? ""}`}>{value}</div>
    </div>
  );
}
