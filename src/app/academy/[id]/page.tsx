import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ACADEMIES_WITH_RATINGS as ACADEMIES, findAcademy, getReviewsFor } from "@/lib/mock";
import { Stars } from "@/components/Stars";
import { Thumb } from "@/components/Thumb";
import { AcademyCard } from "@/components/AcademyCard";
import { Container } from "@/components/Container";
import { Icon } from "@/components/Icon";
import { formatDistance, formatMonthly, relativeTime } from "@/lib/format";
import { DetailActions } from "./_components/DetailActions";
import { MobileStickyCTA } from "./_components/MobileStickyCTA";
import { MatchCard } from "./_components/MatchCard";
import { FinalCTASection } from "./_components/FinalCTASection";
import { AcademyMiniMap } from "./_components/AcademyMiniMap";

export function generateStaticParams() {
  return ACADEMIES.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const a = findAcademy(id);
  if (!a) return { title: "학원을 찾을 수 없어요" };
  const desc =
    a.one_line_summary ||
    a.judgement ||
    `${a.region} ${a.dong}의 ${a.subject} 학원, ${a.name}`;
  return {
    title: `${a.name} — ${a.subject} 학원`,
    description: desc,
    openGraph: {
      title: `${a.name} · ${a.subject}`,
      description: desc,
      type: "article",
    },
  };
}

const DAY_ORDER = ["월", "화", "수", "목", "금", "토", "일"];

export default async function AcademyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = findAcademy(id);
  if (!a) notFound();

  const reviews = getReviewsFor(id);
  // "비교해볼 학원" — 같은 region/dong의 같은 subject 학원 우선
  const similar = ACADEMIES.filter(
    (x) =>
      x.id !== id &&
      x.region === a.region &&
      (x.subject === a.subject || x.dong === a.dong),
  ).slice(0, 4);
  const similarFallback =
    similar.length === 0
      ? ACADEMIES.filter((x) => x.id !== id).slice(0, 4)
      : similar;

  const hasPrice = a.monthly_price > 0;
  const hasRating = a.rating > 0;
  const hasJudgement = Boolean(a.judgement);
  const hasFacilityImages = a.facility_images.length > 0;

  return (
    <>
      <Container className="pb-32 pt-4 md:pb-12">
        {/* Breadcrumbs */}
        <nav className="hidden text-[13px] text-[var(--color-text-secondary)] md:flex md:items-center md:gap-1">
          <Link
            href="/explore"
            className="inline-flex items-center gap-0.5 hover:underline"
          >
            <Icon name="back" size={14} />
            지도 탐색
          </Link>
          <span className="mx-1">·</span>
          <span>{a.region}</span>
          <span className="mx-1">·</span>
          <span>학원 상세</span>
        </nav>

        {/* ============= Hero (요약 + 동등 CTA) ============= */}
        <section className="mt-3 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl">
              <Thumb subject={a.subject} name={a.name} ratio="16/10" />
              {hasFacilityImages && (
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white">
                  <Icon name="camera" size={12} />
                  사진 더보기 ({a.facility_images.length})
                </span>
              )}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[26px] font-bold leading-tight">{a.name}</h1>
              {a.certified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary-soft)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--color-primary)]">
                  <Icon name="shield" size={12} /> 인증
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              {hasRating ? (
                <Stars
                  rating={a.rating}
                  size={16}
                  showCount
                  count={a.review_count}
                />
              ) : (
                <span className="text-[13px] text-[var(--color-text-tertiary)]">
                  후기 준비 중
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {Array.from(
                new Set([
                  ...a.age_groups,
                  `${a.subject} 전문`,
                  ...a.meta.features,
                ]),
              )
                .slice(0, 5)
                .map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-[var(--color-bg-muted)] px-2 py-0.5 text-[12px] text-[var(--color-text-secondary)]"
                  >
                    {t}
                  </span>
                ))}
            </div>

            {hasJudgement && (
              <blockquote className="mt-4 rounded-xl bg-[var(--color-bg-soft)] p-3.5 text-[14px] leading-relaxed">
                &ldquo;{a.judgement}&rdquo;
              </blockquote>
            )}

            <ul className="mt-3 space-y-1.5 text-[13px] text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-1.5">
                <Icon
                  name="location"
                  size={14}
                  color="var(--color-text-tertiary)"
                />
                <span>{a.address}</span>
              </li>
              {a.station && (
                <li className="flex items-start gap-1.5">
                  <Icon
                    name="train"
                    size={14}
                    color="var(--color-text-tertiary)"
                  />
                  <span>{a.station}</span>
                </li>
              )}
            </ul>

            {/* CTA — 저장/비교/상담 동등 비중 */}
            <DetailActions academyId={a.id} />
          </div>
        </section>

        {/* ============= 본문 (학부모 질문 순서) ============= */}
        <div className="mt-10 grid grid-cols-12 gap-6 lg:gap-8">
          <main className="col-span-12 lg:col-span-8">
            {/* 1. 우리 아이에게 맞나? */}
            <SectionHeader
              num={1}
              title="우리 아이에게 맞나요?"
              caption="자녀 학년·관심 과목 기준으로 적합도를 알려드려요"
            />
            <MatchCard
              ageGroups={a.age_groups}
              subject={a.subject}
              recommendedFor={a.recommended_for}
            />

            {/* 2. 위치와 동선 */}
            <SectionHeader
              num={2}
              title="위치와 동선이 괜찮나요?"
              caption={
                a.distance_km
                  ? `미아역 기준 ${formatDistance(a.distance_km)}`
                  : undefined
              }
            />
            <div className="grid grid-cols-12 gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-4">
              <div className="col-span-12 md:col-span-6">
                <AcademyMiniMap lat={a.lat} lng={a.lng} name={a.name} />
              </div>
              <div className="col-span-12 md:col-span-6">
                <ul className="space-y-2 text-[13px]">
                  <li className="flex items-start gap-2">
                    <Icon
                      name="location-filled"
                      size={14}
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
                    <li className="flex items-start gap-2">
                      <Icon
                        name="train"
                        size={14}
                        color="var(--color-primary)"
                        className="mt-0.5 shrink-0"
                      />
                      <span className="block font-medium">{a.station}</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <Icon
                      name="walk"
                      size={14}
                      color="var(--color-text-tertiary)"
                      className="mt-0.5 shrink-0"
                    />
                    <span className="text-[var(--color-text-secondary)]">
                      거리 {formatDistance(a.distance_km)}
                    </span>
                  </li>
                </ul>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href="/explore"
                    className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-[var(--color-border)] py-2 text-[12px] font-medium hover:bg-[var(--color-bg-soft)]"
                  >
                    <Icon name="map" size={13} /> 지도에서 보기
                  </Link>
                  <button className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-[var(--color-border)] py-2 text-[12px] font-medium hover:bg-[var(--color-bg-soft)]">
                    <Icon name="navigate" size={13} /> 길찾기
                  </button>
                </div>
              </div>
            </div>

            {/* 3. 수업 방식 */}
            <SectionHeader
              num={3}
              title="수업은 어떻게 하나요?"
              caption="시간표·수업 방식·숙제량을 한눈에"
            />
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-5">
              {[
                {
                  l: "수업 스타일",
                  v: a.meta.teaching_style.join(" / ") || "—",
                  icon: "users" as const,
                },
                {
                  l: "수업 난이도",
                  v: a.meta.difficulty,
                  icon: "sparkles" as const,
                },
                {
                  l: "숙제량",
                  v: a.meta.homework_level,
                  icon: "clipboard" as const,
                  tone:
                    a.meta.homework_level === "많음"
                      ? "text-rose-500"
                      : a.meta.homework_level === "적음"
                        ? "text-emerald-600"
                        : "",
                },
                {
                  l: "정원",
                  v: `${a.meta.capacity}명`,
                  icon: "users" as const,
                },
                {
                  l: "레벨 테스트",
                  v: a.meta.level_test ? "있음" : "없음",
                  icon: "check-circle" as const,
                },
              ].map((it) => (
                <div
                  key={it.l}
                  className="rounded-xl border border-[var(--color-border)] bg-white p-3"
                >
                  <div className="grid h-7 w-7 place-items-center rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                    <Icon name={it.icon} size={14} />
                  </div>
                  <div className="mt-2 text-[12px] text-[var(--color-text-secondary)]">
                    {it.l}
                  </div>
                  <div
                    className={`text-[13px] font-semibold leading-tight ${it.tone ?? ""}`}
                  >
                    {it.v}
                  </div>
                </div>
              ))}
            </div>

            {/* 시간표 시각화 (요일이 있을 때) */}
            {a.class_days.length > 0 && (
              <div className="mt-3 rounded-xl border border-[var(--color-border)] bg-white p-4">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold">
                  <Icon
                    name="calendar-days"
                    size={14}
                    color="var(--color-primary)"
                  />
                  주간 시간표
                </div>
                <div className="mt-3 grid grid-cols-7 gap-1">
                  {DAY_ORDER.map((d) => {
                    const active = a.class_days.includes(d);
                    return (
                      <div
                        key={d}
                        className={`grid h-12 place-items-center rounded-md text-[13px] font-semibold ${
                          active
                            ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
                            : "bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)]"
                        }`}
                      >
                        {d}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-[12px] text-[var(--color-text-secondary)]">
                  주 <b>{a.meta.class_per_week}회</b> · 회당{" "}
                  <b>{a.meta.class_minutes}분</b>
                </p>
              </div>
            )}

            {/* 4. 가격 */}
            <SectionHeader num={4} title="가격은 얼마인가요?" />
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              {hasPrice ? (
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="text-[12px] text-[var(--color-text-secondary)]">
                      월 수강료
                    </div>
                    <div className="mt-0.5 text-[28px] font-bold leading-none">
                      {formatMonthly(a.monthly_price)}
                    </div>
                    <div className="mt-1 text-[12.5px] text-[var(--color-text-tertiary)]">
                      주 {a.meta.class_per_week}회 / 회당 {a.meta.class_minutes}
                      분 기준
                    </div>
                  </div>
                  <div className="text-[11.5px] text-[var(--color-text-tertiary)]">
                    · 교재비·시험비 등은 별도일 수 있어요
                    <br />· 정확한 비용은 상담으로 확인하세요
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]">
                    <Icon name="money" size={18} />
                  </span>
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold">
                      수강료 정보가 아직 등록되지 않았어요
                    </div>
                    <p className="mt-1 text-[12.5px] text-[var(--color-text-secondary)]">
                      이 학원은 공공데이터로 등록된 학원으로, 정확한 수강료는
                      전화·상담으로 확인할 수 있어요. 학년·시간대에 따라 다를 수
                      있어요.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 5. 후기 */}
            <SectionHeader
              num={5}
              title="다른 학부모는 어떻게 평가했나요?"
              caption={
                hasRating ? `${a.review_count}명 평가 기준` : undefined
              }
            />
            {hasRating ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-4">
                    <div className="text-[13px] text-[var(--color-text-secondary)]">
                      전체 만족도
                    </div>
                    <div className="mt-1 flex items-end gap-1">
                      <span className="text-[34px] font-bold leading-none">
                        {a.rating.toFixed(1)}
                      </span>
                      <span className="pb-1 text-[14px] text-[var(--color-text-tertiary)]">
                        / 5
                      </span>
                    </div>
                    <Stars rating={a.rating} size={16} />
                    <div className="mt-1 text-[12px] text-[var(--color-text-tertiary)]">
                      {a.review_count}명 평가
                    </div>
                  </div>
                  <ul className="col-span-12 flex flex-col gap-1.5 md:col-span-8">
                    {[
                      { star: 5, pct: 66 },
                      { star: 4, pct: 23 },
                      { star: 3, pct: 8 },
                      { star: 2, pct: 2 },
                      { star: 1, pct: 1 },
                    ].map((d) => (
                      <li
                        key={d.star}
                        className="flex items-center gap-2 text-[12.5px]"
                      >
                        <span className="w-7 shrink-0 text-[var(--color-text-secondary)]">
                          {d.star}점
                        </span>
                        <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                          <span
                            className="absolute inset-y-0 left-0 bg-[var(--color-primary)]"
                            style={{ width: `${d.pct}%` }}
                          />
                        </span>
                        <span className="w-9 shrink-0 text-right text-[var(--color-text-secondary)]">
                          {d.pct}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {(a.pros_keywords.length > 0 ||
                  a.cons_keywords.length > 0) && (
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {a.pros_keywords.length > 0 && (
                      <div className="rounded-xl bg-emerald-50 p-3.5">
                        <div className="flex items-center gap-1 text-[13px] font-semibold text-emerald-700">
                          <Icon name="thumb" size={14} /> 장점 키워드
                        </div>
                        <ul className="mt-2 space-y-1 text-[13px]">
                          {a.pros_keywords.map((k) => (
                            <li
                              key={k.label}
                              className="flex items-center justify-between"
                            >
                              <span>· {k.label}</span>
                              <span className="text-[var(--color-text-tertiary)]">
                                ({k.count})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {a.cons_keywords.length > 0 && (
                      <div className="rounded-xl bg-rose-50 p-3.5">
                        <div className="flex items-center gap-1 text-[13px] font-semibold text-rose-700">
                          <Icon name="warning" size={14} /> 개선 키워드
                        </div>
                        <ul className="mt-2 space-y-1 text-[13px]">
                          {a.cons_keywords.map((k) => (
                            <li
                              key={k.label}
                              className="flex items-center justify-between"
                            >
                              <span>· {k.label}</span>
                              <span className="text-[var(--color-text-tertiary)]">
                                ({k.count})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {reviews.length > 0 && (
                  <ul className="mt-5 grid gap-3 md:grid-cols-2">
                    {reviews.slice(0, 4).map((r) => (
                      <li
                        key={r.id}
                        className="rounded-xl border border-[var(--color-border)] p-3.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-semibold text-[var(--color-primary)]">
                            {r.parent_grade}
                          </span>
                          <span className="text-[11px] text-[var(--color-text-tertiary)]">
                            {relativeTime(r.created_at)}
                          </span>
                        </div>
                        <p className="mt-1 text-[13.5px] leading-relaxed">
                          {r.content}
                        </p>
                        <div className="mt-2">
                          <Stars rating={r.rating} size={12} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              // 후기 빈 상태
              <div className="rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-soft)] p-6 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-[var(--color-text-secondary)]">
                  <Icon name="chat" size={20} />
                </span>
                <p className="mt-3 text-[14px] font-semibold">
                  아직 등록된 후기가 없어요
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--color-text-secondary)]">
                  공공데이터로 등록된 학원이라 학부모 후기는 곧 추가될 예정이에요.
                  <br />이 학원에 다녀보셨다면 첫 후기를 남겨주세요.
                </p>
                <button className="mt-4 inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-[var(--color-primary)] bg-white px-3.5 py-2 text-[13px] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]">
                  <Icon name="edit" size={13} />
                  첫 후기 남기기
                </button>
              </div>
            )}

            {/* 6. 비교해볼 학원 */}
            <SectionHeader
              num={6}
              title="다른 학원과 비교해볼까요?"
              caption={`같은 ${a.region} ${a.subject === "사회" ? "" : a.subject + " "}학원`}
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {similarFallback.map((o) => (
                <AcademyCard
                  key={o.id}
                  academy={o}
                  variant="list"
                  showCompareButton
                />
              ))}
            </div>

            {/* 7. 상담 (마지막 한번 더 — 저장/비교/상담 동등) */}
            <SectionHeader num={7} title="이 학원과 상담해볼까요?" />
            <FinalCTASection
              academyId={a.id}
              consultationHours={a.consultation_hours}
            />
          </main>

          {/* 사이드 (sticky 운영 정보만) */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 lg:sticky lg:top-20">
              <h3 className="flex items-center gap-1.5 text-[14px] font-bold">
                <Icon name="clock" size={15} color="var(--color-primary)" />
                운영 정보
              </h3>
              <dl className="mt-3 grid grid-cols-[88px_1fr] gap-y-2.5 text-[13px]">
                <Dt>수업 시간</Dt>
                <Dd>
                  주 {a.meta.class_per_week}회 / 회당 {a.meta.class_minutes}분
                </Dd>
                {a.class_days.length > 0 && (
                  <>
                    <Dt>수업 요일</Dt>
                    <Dd>{a.class_days.join(" · ")}</Dd>
                  </>
                )}
                <Dt>정원</Dt>
                <Dd>{a.meta.capacity}명</Dd>
                <Dt>레벨 테스트</Dt>
                <Dd>{a.meta.level_test ? "있음 (무료)" : "없음"}</Dd>
                {(a.consultation_hours.weekday ||
                  a.consultation_hours.weekend) && (
                  <>
                    <Dt>상담 가능</Dt>
                    <Dd>
                      {a.consultation_hours.weekday && (
                        <>평일 {a.consultation_hours.weekday}</>
                      )}
                      {a.consultation_hours.weekend && (
                        <>
                          <br />
                          토 {a.consultation_hours.weekend}
                        </>
                      )}
                    </Dd>
                  </>
                )}
              </dl>
              <p className="mt-3 text-[11.5px] text-[var(--color-text-tertiary)]">
                · 정보는 학원 등록 자료 기반이며 실제와 다를 수 있어요
              </p>
            </div>
          </aside>
        </div>
      </Container>

      <MobileStickyCTA academyId={a.id} />
    </>
  );
}

function SectionHeader({
  num,
  title,
  caption,
}: {
  num: number;
  title: string;
  caption?: string;
}) {
  return (
    <div className="mb-3 mt-10 flex items-baseline gap-2 first:mt-0">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-[12px] font-bold text-white">
        {num}
      </span>
      <div>
        <h2 className="text-[17px] font-bold leading-tight">{title}</h2>
        {caption && (
          <p className="text-[12px] text-[var(--color-text-tertiary)]">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}

function Dt({ children }: { children: React.ReactNode }) {
  return <dt className="text-[var(--color-text-secondary)]">{children}</dt>;
}
function Dd({ children }: { children: React.ReactNode }) {
  return <dd>{children}</dd>;
}
