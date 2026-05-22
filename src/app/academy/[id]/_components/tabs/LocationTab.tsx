import Link from "next/link";
import { Icon } from "@/components/Icon";
import { formatDistance } from "@/lib/format";
import type { Academy } from "@/lib/types";
import { AcademyMiniMap } from "../AcademyMiniMap";

interface Props {
  academy: Academy;
}

/** 위치 탭 — 미니맵 + 주소/교통 + 길찾기. */
export function LocationTab({ academy: a }: Props) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
        <div className="h-[320px]">
          <AcademyMiniMap lat={a.lat} lng={a.lng} name={a.name} />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="mb-4 text-[14px] font-bold">주소 및 교통</h3>
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

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] py-2.5 text-[13px] font-medium hover:bg-[var(--color-bg-soft)]"
          >
            <Icon name="map" size={14} /> 지도에서 보기
          </Link>
          <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] py-2.5 text-[13px] font-medium hover:bg-[var(--color-bg-soft)]">
            <Icon name="navigate" size={14} /> 길찾기
          </button>
        </div>
      </div>
    </div>
  );
}
