"use client";

import { useState } from "react";
import Link from "next/link";
import { Stars } from "@/components/Stars";
import { Icon } from "@/components/Icon";
import { AcademyCard } from "@/components/AcademyCard";
import { AcademyMiniMap } from "./AcademyMiniMap";
import { MatchCard } from "./MatchCard";
import { FinalCTASection } from "./FinalCTASection";
import { formatDistance, formatMonthly, relativeTime } from "@/lib/format";
import type { Academy, Review } from "@/lib/types";

const TABS = [
  { key: "intro",       label: "소개" },
  { key: "class",       label: "수업 정보" },
  { key: "curriculum",  label: "커리큘럼" },
  { key: "faculty",     label: "강사진" },
  { key: "price",       label: "비용" },
  { key: "review",      label: "후기" },
  { key: "qna",         label: "Q&A" },
  { key: "location",    label: "위치" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const DAY_ORDER = ["월", "화", "수", "목", "금", "토", "일"];

interface Props {
  academy: Academy;
  reviews: Review[];
  similar: Academy[];
}

export function DetailTabsClient({ academy: a, reviews, similar }: Props) {
  const [active, setActive] = useState<TabKey>("intro");

  const hasPrice  = a.monthly_price > 0;
  const hasRating = a.rating > 0;

  return (
    <>
      {/* 탭 바 */}
      <div className="sticky top-[57px] z-10 mt-6 border-b border-[var(--color-border)] bg-white">
        <ul className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {TABS.map((t) => (
            <li key={t.key}>
              <button
                onClick={() => setActive(t.key)}
                className={`relative whitespace-nowrap px-3 py-3 text-[14px] font-medium transition ${
                  active === t.key
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {t.label}
                {t.key === "review" && a.review_count > 0 && (
                  <span className="ml-1 text-[12px] text-[var(--color-text-tertiary)]">
                    {a.review_count}
                  </span>
                )}
                {active === t.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--color-primary)]" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="mt-6">

        {/* ── 소개 ── */}
        {active === "intro" && (
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

            {/* 특장점 태그 */}
            <div>
              <h3 className="mb-3 text-[15px] font-bold">특장점</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  ...a.meta.features,
                  ...a.meta.teaching_style,
                  ...a.recommended_for.slice(0, 3),
                ].filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-[13px] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 우리 아이에게 맞나? */}
            <div>
              <h3 className="mb-3 text-[15px] font-bold">우리 아이에게 맞나요?</h3>
              <MatchCard
                ageGroups={a.age_groups}
                subject={a.subject}
                recommendedFor={a.recommended_for}
              />
            </div>

            {/* 다른 학원 비교 */}
            {similar.length > 0 && (
              <div>
                <h3 className="mb-3 text-[15px] font-bold">비슷한 학원</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {similar.map((o) => (
                    <AcademyCard key={o.id} academy={o} variant="list" showCompareButton />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 수업 정보 ── */}
        {active === "class" && (
          <div className="space-y-6">
            {/* 핵심 지표 카드 */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {[
                { l: "수업 스타일", v: a.meta.teaching_style.join(" / ") || "—", icon: "users" as const },
                { l: "수업 난이도", v: a.meta.difficulty, icon: "sparkles" as const },
                { l: "숙제량",      v: a.meta.homework_level, icon: "clipboard" as const,
                  tone: a.meta.homework_level === "많음" ? "text-rose-500" : a.meta.homework_level === "적음" ? "text-emerald-600" : "" },
                { l: "정원",        v: `${a.meta.capacity}명`, icon: "users" as const },
                { l: "레벨 테스트", v: a.meta.level_test ? "있음" : "없음", icon: "check-circle" as const },
              ].map((it) => (
                <div key={it.l} className="rounded-xl border border-[var(--color-border)] bg-white p-4">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                    <Icon name={it.icon} size={16} />
                  </div>
                  <div className="mt-2.5 text-[12px] text-[var(--color-text-secondary)]">{it.l}</div>
                  <div className={`text-[14px] font-bold ${it.tone ?? ""}`}>{it.v}</div>
                </div>
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

            {/* 운영 상세 */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <h3 className="mb-4 text-[14px] font-bold">운영 정보</h3>
              <dl className="grid grid-cols-[100px_1fr] gap-y-3 text-[13px]">
                <dt className="text-[var(--color-text-secondary)]">수업 시간</dt>
                <dd className="font-medium">주 {a.meta.class_per_week}회 / 회당 {a.meta.class_minutes}분</dd>
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
                      {a.consultation_hours.weekend && <><br />토 {a.consultation_hours.weekend}</>}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        )}

        {/* ── 커리큘럼 ── */}
        {active === "curriculum" && (
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
                <EmptyPlaceholder
                  icon="clipboard"
                  title="커리큘럼 정보 준비 중"
                  desc="학원에 직접 문의하시면 자세한 교육 과정을 안내받을 수 있어요."
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
        )}

        {/* ── 강사진 ── */}
        {active === "faculty" && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <EmptyPlaceholder
              icon="users"
              title="강사진 정보 준비 중"
              desc="담당 선생님 정보는 상담을 통해 직접 확인하실 수 있어요."
            />
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {["학원장 / 대표 강사", "수학 담당 강사", "영어 담당 강사"].map((role) => (
                <div key={role} className="rounded-xl border border-dashed border-[var(--color-border)] p-4 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)]">
                    <Icon name="users" size={20} />
                  </div>
                  <p className="mt-2 text-[12.5px] text-[var(--color-text-secondary)]">{role}</p>
                  <p className="text-[11.5px] text-[var(--color-text-tertiary)]">정보 준비 중</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 비용 ── */}
        {active === "price" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              {hasPrice ? (
                <>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <div className="text-[13px] text-[var(--color-text-secondary)]">월 수강료</div>
                      <div className="mt-1 text-[36px] font-bold leading-none">{formatMonthly(a.monthly_price)}</div>
                      <div className="mt-1.5 text-[12.5px] text-[var(--color-text-tertiary)]">
                        주 {a.meta.class_per_week}회 / 회당 {a.meta.class_minutes}분 기준
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 rounded-xl bg-amber-50 p-3.5 text-[12.5px] text-amber-800">
                    · 교재비·시험비·재료비 등은 별도 청구될 수 있어요<br />
                    · 형제·자매 할인, 장기 등록 할인이 있을 수 있으니 상담 시 확인하세요
                  </div>
                </>
              ) : (
                <EmptyPlaceholder
                  icon="money"
                  title="수강료 정보가 등록되지 않았어요"
                  desc="공공데이터 기반 학원으로 정확한 수강료는 전화·상담으로 확인할 수 있어요. 학년·시간대에 따라 달라질 수 있어요."
                />
              )}
            </div>

            {/* 비용 관련 안내 */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <h3 className="mb-3 text-[14px] font-bold">비용 확인 체크리스트</h3>
              <ul className="space-y-2 text-[13px]">
                {["월 수강료 및 납부 방법", "교재비 포함 여부", "레벨 테스트 비용", "환불 정책", "형제 할인 여부"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <Icon name="check" size={13} color="var(--color-primary)" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── 후기 ── */}
        {active === "review" && (
          <div className="space-y-5">
            {hasRating ? (
              <>
                {/* 별점 요약 */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
                  <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12 md:col-span-4 text-center md:text-left">
                      <div className="text-[13px] text-[var(--color-text-secondary)]">전체 만족도</div>
                      <div className="mt-1 flex items-end justify-center gap-1 md:justify-start">
                        <span className="text-[44px] font-bold leading-none">{a.rating.toFixed(1)}</span>
                        <span className="pb-1 text-[16px] text-[var(--color-text-tertiary)]">/ 5</span>
                      </div>
                      <div className="mt-1 flex justify-center md:justify-start">
                        <Stars rating={a.rating} size={18} />
                      </div>
                      <div className="mt-1.5 text-[12px] text-[var(--color-text-tertiary)]">{a.review_count}명 평가</div>
                    </div>
                    <div className="col-span-12 md:col-span-8">
                      <ul className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const pct = star === 5 ? 66 : star === 4 ? 23 : star === 3 ? 8 : star === 2 ? 2 : 1;
                          return (
                            <li key={star} className="flex items-center gap-3 text-[13px]">
                              <span className="w-8 shrink-0 text-right text-[var(--color-text-secondary)]">{star}점</span>
                              <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                                <span className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-primary)]" style={{ width: `${pct}%` }} />
                              </span>
                              <span className="w-10 shrink-0 text-[var(--color-text-secondary)]">{pct}%</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  {/* 키워드 */}
                  {(a.pros_keywords.length > 0 || a.cons_keywords.length > 0) && (
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {a.pros_keywords.length > 0 && (
                        <div className="rounded-xl bg-emerald-50 p-4">
                          <div className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700">
                            <Icon name="thumb" size={14} /> 장점
                          </div>
                          <ul className="space-y-1.5">
                            {a.pros_keywords.map((k) => (
                              <li key={k.label} className="flex items-center justify-between text-[13px]">
                                <span>· {k.label}</span>
                                <span className="text-[11px] text-[var(--color-text-tertiary)]">({k.count}명)</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {a.cons_keywords.length > 0 && (
                        <div className="rounded-xl bg-rose-50 p-4">
                          <div className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-rose-700">
                            <Icon name="warning" size={14} /> 아쉬운 점
                          </div>
                          <ul className="space-y-1.5">
                            {a.cons_keywords.map((k) => (
                              <li key={k.label} className="flex items-center justify-between text-[13px]">
                                <span>· {k.label}</span>
                                <span className="text-[11px] text-[var(--color-text-tertiary)]">({k.count}명)</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 후기 목록 */}
                {reviews.length > 0 && (
                  <ul className="grid gap-3 md:grid-cols-2">
                    {reviews.map((r) => (
                      <li key={r.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[12.5px] font-semibold text-[var(--color-primary)]">{r.parent_grade}</span>
                          <span className="text-[11.5px] text-[var(--color-text-tertiary)]">{relativeTime(r.created_at)}</span>
                        </div>
                        <p className="mt-2 text-[14px] leading-relaxed">{r.content}</p>
                        <div className="mt-2.5 flex items-center gap-2">
                          <Stars rating={r.rating} size={13} />
                          {r.pros && r.pros.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {r.pros.map((p) => (
                                <span key={p} className="rounded-full bg-[var(--color-bg-soft)] px-2 py-0.5 text-[11px] text-[var(--color-text-secondary)]">{p}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-soft)] p-8 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[var(--color-text-secondary)]">
                  <Icon name="chat" size={24} />
                </span>
                <p className="mt-3 text-[15px] font-semibold">아직 등록된 후기가 없어요</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                  이 학원에 다녀보셨다면 첫 후기를 남겨주세요.
                </p>
                <button className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-primary)] px-4 py-2 text-[13px] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]">
                  <Icon name="edit" size={13} /> 첫 후기 남기기
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Q&A ── */}
        {active === "qna" && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <EmptyPlaceholder
              icon="chat"
              title="Q&A 준비 중"
              desc="궁금한 점은 상담 문의로 직접 질문해보세요."
            />
            <div className="mt-5 space-y-3">
              {[
                "수업 시작 전 레벨 테스트가 있나요?",
                "무료 체험 수업이 가능한가요?",
                "결석 시 보충 수업이 가능한가요?",
              ].map((q) => (
                <div key={q} className="rounded-xl border border-dashed border-[var(--color-border)] p-4">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-primary-soft)] text-[11px] font-bold text-[var(--color-primary)]">Q</span>
                    <p className="text-[13.5px] text-[var(--color-text-secondary)]">{q}</p>
                  </div>
                  <div className="mt-2 flex items-start gap-2">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-bg-muted)] text-[11px] font-bold text-[var(--color-text-tertiary)]">A</span>
                    <p className="text-[13px] text-[var(--color-text-tertiary)] italic">상담을 통해 확인해주세요.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 위치 ── */}
        {active === "location" && (
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
                  <Icon name="location-filled" size={16} color="var(--color-primary)" className="mt-0.5 shrink-0" />
                  <span>
                    <span className="block font-medium">{a.address}</span>
                    <span className="block text-[12px] text-[var(--color-text-tertiary)]">{a.region} {a.dong}</span>
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
                    <Icon name="walk" size={16} color="var(--color-text-tertiary)" className="shrink-0" />
                    <span className="text-[var(--color-text-secondary)]">미아역 기준 {formatDistance(a.distance_km)}</span>
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
        )}

        {/* 마지막 CTA — 모든 탭 하단 */}
        <div className="mt-10">
          <FinalCTASection
            academyId={a.id}
            consultationHours={a.consultation_hours}
          />
        </div>
      </div>
    </>
  );
}

function EmptyPlaceholder({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-text-secondary)]">
        <Icon name={icon as Parameters<typeof Icon>[0]["name"]} size={24} />
      </span>
      <p className="mt-3 text-[14px] font-semibold">{title}</p>
      <p className="mt-1.5 max-w-[300px] text-[12.5px] leading-relaxed text-[var(--color-text-secondary)]">{desc}</p>
    </div>
  );
}
