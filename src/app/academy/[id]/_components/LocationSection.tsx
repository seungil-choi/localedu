import Link from "next/link";
import { Icon } from "@/components/Icon";
import { formatDistance } from "@/lib/format";
import type { Academy } from "@/lib/types";
import { AcademyMiniMap } from "./AcademyMiniMap";

interface Props {
  academy: Academy;
}

/**
 * 학원 상세 페이지 하단 위치 섹션 (탭 하단에 항상 노출).
 *
 * Airbnb의 "Where you'll be" 패턴 — 위치는 모든 학원에서 핵심 결정 요인이므로
 * 별도 탭으로 분리하지 않고 페이지 하단에 인라인으로 항상 노출한다.
 *
 * 구성:
 *   - 풀너비 인터랙티브 지도
 *   - 주소 / 가까운 역 / 거리
 *   - 지도에서 보기 + 길찾기 액션
 */
export function LocationSection({ academy: a }: Props) {
  return (
    <section className="mt-10 border-t border-[var(--color-border)] pt-8">
      <h2 className="mb-1 text-[18px] font-bold">오시는 길</h2>
      <p className="mb-5 text-[13px] text-[var(--color-text-secondary)]">
        {a.region} {a.dong}
        {a.station && ` · ${a.station}`}
      </p>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
        <div className="h-[360px] md:h-[420px]">
          <AcademyMiniMap lat={a.lat} lng={a.lng} name={a.name} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ul className="space-y-3 text-[13.5px]">
          <li className="flex items-start gap-2.5">
            <Icon
              name="location-filled"
              size={16}
              color="var(--color-primary)"
              className="mt-0.5 shrink-0"
            />
            <span>
              <span className="block font-medium">{a.address}</span>
              <span className="block text-[12px] text-[var(--color-text-tertiary)]">
                {a.region} {a.dong}
              </span>
            </span>
          </li>
          {a.station && (
            <li className="flex items-center gap-2.5">
              <Icon name="train" size={16} color="var(--color-primary)" className="shrink-0" />
              <span className="font-medium">{a.station}</span>
            </li>
          )}
          {a.distance_km !== undefined && (
            <li className="flex items-center gap-2.5">
              <Icon
                name="walk"
                size={16}
                color="var(--color-text-tertiary)"
                className="shrink-0"
              />
              <span className="text-[var(--color-text-secondary)]">
                미아역 기준 {formatDistance(a.distance_km)}
              </span>
            </li>
          )}
        </ul>

        <div className="grid grid-cols-2 gap-2 md:items-start">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] py-2.5 text-[13px] font-medium hover:bg-[var(--color-bg-soft)]"
          >
            <Icon name="map" size={14} /> 지도에서 보기
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] py-2.5 text-[13px] font-medium hover:bg-[var(--color-bg-soft)]"
          >
            <Icon name="navigate" size={14} /> 길찾기
          </button>
        </div>
      </div>
    </section>
  );
}
