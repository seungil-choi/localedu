"use client";

import { useState } from "react";
import type { Academy, Review } from "@/lib/types";
import { FinalCTASection } from "./FinalCTASection";
import { LocationSection } from "./LocationSection";
import { IntroTab } from "./tabs/IntroTab";
import { ClassTab } from "./tabs/ClassTab";
import { PriceTab } from "./tabs/PriceTab";
import { ReviewTab } from "./tabs/ReviewTab";
import { QnaTab } from "./tabs/QnaTab";

const TABS = [
  { key: "intro",  label: "소개" },
  { key: "class",  label: "수업·커리큘럼" },
  { key: "price",  label: "비용" },
  { key: "review", label: "후기" },
  { key: "qna",    label: "Q&A" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

interface Props {
  academy: Academy;
  reviews: Review[];
  similar: Academy[];
}

/**
 * 학원 상세 탭 컨테이너.
 *
 * 5탭 구조:
 *   소개 (핵심메트릭/매칭) → 수업·커리큘럼 (시간표/운영/커리큘럼/강사) →
 *   비용 → 후기 → Q&A
 *
 * 위치는 별도 탭이 아닌 페이지 하단 인라인 섹션 (LocationSection).
 * Airbnb "Where you'll be" 패턴 — 모든 학원에서 핵심 결정 요인이므로
 * 어느 탭에 있든 즉시 확인 가능.
 *
 * 모든 탭 콘텐츠 하단에 LocationSection + FinalCTASection이 항상 노출.
 */
export function DetailTabsClient({ academy, reviews, similar }: Props) {
  const [active, setActive] = useState<TabKey>("intro");

  return (
    <>
      <TabBar active={active} onChange={setActive} reviewCount={academy.review_count} />

      <div className="mt-6">
        <TabContent active={active} academy={academy} reviews={reviews} similar={similar} />

        <LocationSection academy={academy} />

        <div className="mt-10">
          <FinalCTASection
            academyId={academy.id}
            consultationHours={academy.consultation_hours}
          />
        </div>
      </div>
    </>
  );
}

/* ──── 탭 바 ──── */

function TabBar({
  active,
  onChange,
  reviewCount,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
  reviewCount: number;
}) {
  return (
    <nav
      role="tablist"
      className="sticky top-[57px] z-10 mt-6 border-b border-[var(--color-border)] bg-white"
    >
      <ul className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        {TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <li key={t.key}>
              <button
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(t.key)}
                className={`relative whitespace-nowrap px-3 py-3 text-[14px] font-medium transition ${
                  isActive
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {t.label}
                {t.key === "review" && reviewCount > 0 && (
                  <span className="ml-1 text-[12px] text-[var(--color-text-tertiary)]">
                    {reviewCount}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--color-primary)]" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ──── 탭 콘텐츠 라우터 ──── */

function TabContent({
  active,
  academy,
  reviews,
  similar,
}: {
  active: TabKey;
  academy: Academy;
  reviews: Review[];
  similar: Academy[];
}) {
  switch (active) {
    case "intro":  return <IntroTab academy={academy} similar={similar} />;
    case "class":  return <ClassTab academy={academy} />;
    case "price":  return <PriceTab academy={academy} />;
    case "review": return <ReviewTab academy={academy} reviews={reviews} />;
    case "qna":    return <QnaTab />;
  }
}
