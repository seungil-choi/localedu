"use client";

import { useState } from "react";
import type { Academy, Review } from "@/lib/types";
import { FinalCTASection } from "./FinalCTASection";
import { IntroTab } from "./tabs/IntroTab";
import { ClassTab } from "./tabs/ClassTab";
import { CurriculumTab } from "./tabs/CurriculumTab";
import { FacultyTab } from "./tabs/FacultyTab";
import { PriceTab } from "./tabs/PriceTab";
import { ReviewTab } from "./tabs/ReviewTab";
import { QnaTab } from "./tabs/QnaTab";
import { LocationTab } from "./tabs/LocationTab";

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

interface Props {
  academy: Academy;
  reviews: Review[];
  similar: Academy[];
}

/**
 * 학원 상세 탭 컨테이너.
 *
 * - sticky 탭 바 (top-[57px] — MobileTopBar 높이만큼 오프셋)
 * - 활성 탭만 렌더 (탭별 컨텐츠는 ./tabs/*Tab.tsx로 분리)
 * - 모든 탭 하단에 공통 FinalCTASection
 */
export function DetailTabsClient({ academy, reviews, similar }: Props) {
  const [active, setActive] = useState<TabKey>("intro");

  return (
    <>
      <TabBar active={active} onChange={setActive} reviewCount={academy.review_count} />

      <div className="mt-6">
        <TabContent active={active} academy={academy} reviews={reviews} similar={similar} />

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
    case "intro":      return <IntroTab academy={academy} similar={similar} />;
    case "class":      return <ClassTab academy={academy} />;
    case "curriculum": return <CurriculumTab academy={academy} />;
    case "faculty":    return <FacultyTab />;
    case "price":      return <PriceTab academy={academy} />;
    case "review":     return <ReviewTab academy={academy} reviews={reviews} />;
    case "qna":        return <QnaTab />;
    case "location":   return <LocationTab academy={academy} />;
  }
}
