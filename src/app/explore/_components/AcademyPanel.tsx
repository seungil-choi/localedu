"use client";

import Link from "next/link";
import { useState } from "react";
import type { Academy } from "@/lib/types";
import { Icon } from "@/components/Icon";
import { Stars } from "@/components/Stars";
import { Thumb } from "@/components/Thumb";
import { InquiryDialog } from "@/components/InquiryDialog";
import { useAppStore } from "@/store/useAppStore";
import { formatDistance, formatMonthly } from "@/lib/format";

interface Props {
  academy: Academy | null;
  onClose: () => void;
}

/**
 * 부동산 사이드 패널 — 마커 클릭 시 우측에서 슬라이드.
 * 지도가 사라지지 않고 그대로 유지됨.
 */
export function AcademyPanel({ academy, onClose }: Props) {
  const isSaved = useAppStore((s) =>
    academy ? s.savedIds.includes(academy.id) : false,
  );
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const open = Boolean(academy);
  const a = academy;
  const hasPrice = (a?.monthly_price ?? 0) > 0;

  return (
    <>
      {/* 모바일 백드롭 */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-[57px] z-30 flex w-full flex-col overflow-hidden border-l border-[var(--color-border)] bg-white shadow-xl transition-transform md:!bottom-0 md:max-w-[380px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        // 모바일: BottomTab 위로 띄움 / 데스크탑: 0으로 (md:!bottom-0)
        style={{ bottom: "var(--mobile-bottom-tab-h)" }}
      >
        {a && (
          <>
            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
              <span className="text-[12px] text-[var(--color-text-secondary)]">
                <Icon
                  name="location"
                  size={12}
                  color="var(--color-text-tertiary)"
                  className="mr-1 inline"
                />
                {a.region} · {a.dong}
              </span>
              <button
                aria-label="닫기"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-soft)]"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {/* 스크롤 본문 */}
            <div className="flex-1 overflow-y-auto">
              <div className="relative">
                <Thumb
                  subject={a.subject}
                  name={a.name}
                  ratio="16/10"
                  rounded="rounded-none"
                />
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white">
                  <Icon name="camera" size={11} />
                  {a.facility_images.length || 0}
                </span>
              </div>

              <div className="px-4 pt-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2 className="text-[18px] font-bold leading-tight">
                    {a.name}
                  </h2>
                  {a.certified && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-primary)]">
                      <Icon name="shield" size={11} /> 인증
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[12.5px]">
                  {a.rating > 0 ? (
                    <Stars
                      rating={a.rating}
                      size={13}
                      showCount
                      count={a.review_count}
                    />
                  ) : (
                    <span className="text-[var(--color-text-tertiary)]">
                      후기 준비 중
                    </span>
                  )}
                  <span className="text-[var(--color-text-tertiary)]">·</span>
                  <span className="text-[var(--color-text-secondary)]">
                    {formatDistance(a.distance_km)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {Array.from(
                    new Set([
                      ...a.age_groups,
                      `${a.subject} 전문`,
                      ...a.meta.features,
                    ]),
                  )
                    .slice(0, 4)
                    .map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-[var(--color-bg-muted)] px-2 py-0.5 text-[11.5px] text-[var(--color-text-secondary)]"
                      >
                        {t}
                      </span>
                    ))}
                </div>

                {a.judgement && (
                  <p className="mt-3 rounded-lg bg-[var(--color-bg-soft)] p-3 text-[13px] leading-relaxed">
                    &ldquo;{a.judgement}&rdquo;
                  </p>
                )}
              </div>

              {/* 한눈에 */}
              <div className="mt-3 px-4">
                <div className="rounded-xl border border-[var(--color-border)] bg-white p-3">
                  <h3 className="text-[12.5px] font-semibold text-[var(--color-text-secondary)]">
                    한눈에
                  </h3>
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                    <Row label="수업 스타일">
                      {a.meta.teaching_style.join(" / ") || "—"}
                    </Row>
                    <Row label="난이도">{a.meta.difficulty}</Row>
                    <Row label="숙제량">
                      <HomeworkBadge level={a.meta.homework_level} />
                    </Row>
                    <Row label="정원">{a.meta.capacity}명</Row>
                    <Row label="수업">
                      주 {a.meta.class_per_week}회 / {a.meta.class_minutes}분
                    </Row>
                    <Row label="학원비">
                      {hasPrice ? formatMonthly(a.monthly_price) : "문의"}
                    </Row>
                  </dl>
                </div>
              </div>

              {/* 위치 */}
              <div className="mt-3 px-4">
                <div className="rounded-xl border border-[var(--color-border)] bg-white p-3 text-[12.5px]">
                  <h3 className="text-[12.5px] font-semibold text-[var(--color-text-secondary)]">
                    위치
                  </h3>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start gap-1.5">
                      <Icon
                        name="location"
                        size={13}
                        color="var(--color-text-tertiary)"
                      />
                      <span>{a.address}</span>
                    </li>
                    {a.station && (
                      <li className="flex items-start gap-1.5">
                        <Icon
                          name="train"
                          size={13}
                          color="var(--color-text-tertiary)"
                        />
                        <span>{a.station}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* 후기 키워드 (있을 때만) */}
              {(a.pros_keywords.length > 0 || a.cons_keywords.length > 0) && (
                <div className="mt-3 px-4">
                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    {a.pros_keywords.length > 0 && (
                      <div className="rounded-lg bg-emerald-50 p-2.5">
                        <div className="font-semibold text-emerald-700">
                          장점
                        </div>
                        <ul className="mt-1 space-y-0.5">
                          {a.pros_keywords.slice(0, 3).map((k) => (
                            <li key={k.label}>· {k.label}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {a.cons_keywords.length > 0 && (
                      <div className="rounded-lg bg-rose-50 p-2.5">
                        <div className="font-semibold text-rose-700">개선점</div>
                        <ul className="mt-1 space-y-0.5">
                          {a.cons_keywords.slice(0, 3).map((k) => (
                            <li key={k.label}>· {k.label}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 보조 액션 — 저장만 (비교는 보관함에서 다중 선택으로) */}
              <div className="mt-4 px-4 pb-4">
                <button
                  onClick={() => toggleSaved(a.id)}
                  className={`inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border py-2.5 text-[13px] font-medium ${
                    isSaved
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  <Icon name={isSaved ? "bookmark-filled" : "bookmark"} size={13} />
                  {isSaved ? "저장됨" : "저장"}
                </button>
              </div>
            </div>

            {/* 하단 고정 CTA */}
            <div className="border-t border-[var(--color-border)] bg-white p-3">
              <div className="flex items-center gap-2">
                <Link
                  href={`/academy/${a.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--color-border)] py-3 text-[13px] font-semibold hover:bg-[var(--color-bg-soft)]"
                >
                  상세 보기
                  <Icon name="forward" size={13} />
                </Link>
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="inline-flex flex-[1.4] items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[var(--color-primary)] py-3 text-[14px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
                >
                  <Icon name="chat" size={14} />
                  상담 문의
                </button>
              </div>
            </div>

            <InquiryDialog
              open={inquiryOpen}
              onClose={() => setInquiryOpen(false)}
              academyIds={[a.id]}
            />
          </>
        )}
      </aside>
    </>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <dt className="text-[var(--color-text-secondary)]">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </>
  );
}

function HomeworkBadge({
  level,
}: {
  level: "적음" | "보통" | "많음";
}) {
  const color =
    level === "많음"
      ? "text-rose-500"
      : level === "적음"
        ? "text-emerald-600"
        : "";
  return <span className={`font-semibold ${color}`}>{level}</span>;
}
