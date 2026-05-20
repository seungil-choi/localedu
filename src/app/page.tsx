import Link from "next/link";
import { ACADEMIES_WITH_RATINGS as ACADEMIES, REVIEWS, findAcademy } from "@/lib/mock";
import { MapView } from "@/components/MapView";
import { AcademyCard } from "@/components/AcademyCard";
import { Container } from "@/components/Container";
import { Icon } from "@/components/Icon";
import { HomeHero } from "./_home/HomeHero";
import { HomeSearchPanel } from "./_home/HomeSearchPanel";
import { OnboardingNudge } from "@/components/OnboardingNudge";
import { Stars } from "@/components/Stars";
import { relativeTime } from "@/lib/format";

/**
 * MVP 홈 (100명 단계):
 * - Hero (지도 + 단일 CTA)
 * - 평점 높은 학원
 * - 최근 후기
 * - 푸터: 강북구 데이터 출처 + 다른 지역 준비 안내 (한 줄)
 *
 * 비활성: 큰 통계 카드(SCOPE.homeBigStats), 근처 지역 카드(SCOPE.homeNearRegionsCards)
 */
export default function HomePage() {
  const topRated = [...ACADEMIES]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const recommended = [...ACADEMIES].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const recentReviews = REVIEWS.slice(0, 2);

  return (
    <>
      <OnboardingNudge />

      {/* ===== Desktop ===== */}
      <div className="hidden md:block">
        {/* Hero — 검색 패널 + 지도 */}
        <Container className="grid grid-cols-12 gap-6 pt-8">
          <div className="col-span-4 flex flex-col justify-center">
            <HomeSearchPanel />
          </div>
          <div className="col-span-8">
            <MapView academies={ACADEMIES} showRefreshButton height="420px" />
          </div>
        </Container>

        {/* 평점 높은 학원 + 최근 후기 */}
        <Container className="mt-10 grid grid-cols-12 gap-6 pb-12">
          <div className="col-span-8">
            <SectionHeader
              title="평점 높은 학원"
              caption="실제 학부모 후기 평점 기준"
              href="/explore"
            />
            <div className="mt-3 grid grid-cols-4 gap-3">
              {topRated.map((a) => (
                <AcademyCard key={a.id} academy={a} variant="list" />
              ))}
            </div>
          </div>

          <aside className="col-span-4">
            <SectionHeader title="최근 후기" />
            <ul className="mt-3 flex flex-col gap-3">
              {recentReviews.map((r) => {
                const a = findAcademy(r.academy_id);
                if (!a) return null;
                return (
                  <li
                    key={r.id}
                    className="rounded-xl border border-[var(--color-border)] bg-white p-3"
                  >
                    <div className="text-[12px] font-semibold text-[var(--color-primary)]">
                      {r.parent_grade}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed">
                      {r.content}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[12px]">
                      <Link
                        href={`/academy/${a.id}`}
                        className="font-semibold hover:underline"
                      >
                        {a.name}
                      </Link>
                      <Stars rating={r.rating} size={12} />
                      <span className="text-[var(--color-text-tertiary)]">
                        {relativeTime(r.created_at)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </Container>
      </div>

      {/* ===== Mobile ===== */}
      <div className="md:hidden">
        <HomeHero />

        {/* 모바일 검색 패널 */}
        <section className="mt-5 px-4">
          <HomeSearchPanel />
        </section>

        <section className="mt-7 px-4">
          <SectionHeader title="평점 높은 학원" href="/explore" />
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {recommended.map((a) => (
              <div key={a.id} className="w-[260px] shrink-0">
                <AcademyCard academy={a} showCompareButton={false} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 px-4 pb-6">
          <SectionHeader title="최근 후기" />
          <ul className="mt-3 flex flex-col gap-2">
            {recentReviews.map((r) => {
              const a = findAcademy(r.academy_id);
              if (!a) return null;
              return (
                <li
                  key={r.id}
                  className="rounded-xl border border-[var(--color-border)] bg-white p-3"
                >
                  <div className="text-[12px] font-semibold text-[var(--color-primary)]">
                    {r.parent_grade}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed">
                    {r.content}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[12px]">
                    <Link
                      href={`/academy/${a.id}`}
                      className="font-semibold hover:underline"
                    >
                      {a.name}
                    </Link>
                    <Stars rating={r.rating} size={12} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}

function SectionHeader({
  title,
  caption,
  href,
}: {
  title: string;
  caption?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-[18px] font-bold">{title}</h2>
        {caption && (
          <p className="text-[12px] text-[var(--color-text-tertiary)]">
            {caption}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-0.5 whitespace-nowrap text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          더보기
          <Icon name="forward" size={12} />
        </Link>
      )}
    </div>
  );
}
