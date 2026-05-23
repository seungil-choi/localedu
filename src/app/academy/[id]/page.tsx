import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ACADEMIES_WITH_RATINGS as ACADEMIES, findAcademy, getReviewsFor } from "@/lib/mock";
import { Stars } from "@/components/Stars";
import { Thumb } from "@/components/Thumb";
import { Container } from "@/components/Container";
import { Icon } from "@/components/Icon";
import { DetailActions } from "./_components/DetailActions";
import { MobileStickyCTA } from "./_components/MobileStickyCTA";
import { DetailTabsClient } from "./_components/DetailTabsClient";
import { AcademyJsonLd } from "./_components/AcademyJsonLd";

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
  const canonicalPath = `/academy/${a.id}`;
  return {
    title: `${a.name} — ${a.subject} 학원`,
    description: desc,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${a.name} · ${a.subject}`,
      description: desc,
      type: "article",
      url: canonicalPath,
      locale: "ko_KR",
    },
    twitter: {
      card: "summary",
      title: `${a.name} · ${a.subject}`,
      description: desc,
    },
  };
}

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

  const hasRating = a.rating > 0;
  const hasJudgement = Boolean(a.judgement);
  const hasFacilityImages = a.facility_images.length > 0;

  return (
    <>
      <AcademyJsonLd academy={a} />
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

        {/* ============= 탭 본문 ============= */}
        <DetailTabsClient academy={a} reviews={reviews} similar={similarFallback} />
      </Container>

      <MobileStickyCTA academyId={a.id} />
    </>
  );
}

