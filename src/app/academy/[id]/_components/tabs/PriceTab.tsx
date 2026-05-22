import { Icon } from "@/components/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatMonthly } from "@/lib/format";
import type { Academy } from "@/lib/types";

const CHECKLIST = [
  "월 수강료 및 납부 방법",
  "교재비 포함 여부",
  "레벨 테스트 비용",
  "환불 정책",
  "형제 할인 여부",
];

interface Props {
  academy: Academy;
}

/** 비용 탭 — 월 수강료 + 비용 확인 체크리스트. */
export function PriceTab({ academy: a }: Props) {
  const hasPrice = a.monthly_price > 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
        {hasPrice ? (
          <>
            <div>
              <div className="text-[13px] text-[var(--color-text-secondary)]">월 수강료</div>
              <div className="mt-1 text-[36px] font-bold leading-none">
                {formatMonthly(a.monthly_price)}
              </div>
              <div className="mt-1.5 text-[12.5px] text-[var(--color-text-tertiary)]">
                주 {a.meta.class_per_week}회 / 회당 {a.meta.class_minutes}분 기준
              </div>
            </div>
            <div className="mt-5 rounded-xl bg-amber-50 p-3.5 text-[12.5px] text-amber-800">
              · 교재비·시험비·재료비 등은 별도 청구될 수 있어요
              <br />· 형제·자매 할인, 장기 등록 할인이 있을 수 있으니 상담 시 확인하세요
            </div>
          </>
        ) : (
          <EmptyState
            variant="inline"
            icon="money"
            title="수강료 정보가 등록되지 않았어요"
            description="공공데이터 기반 학원으로 정확한 수강료는 전화·상담으로 확인할 수 있어요. 학년·시간대에 따라 달라질 수 있어요."
          />
        )}
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="mb-3 text-[14px] font-bold">비용 확인 체크리스트</h3>
        <ul className="space-y-2 text-[13px]">
          {CHECKLIST.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-[var(--color-text-secondary)]"
            >
              <Icon name="check" size={13} color="var(--color-primary)" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
