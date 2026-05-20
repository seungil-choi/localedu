import type { Academy, Review, Region } from "./types";
import academiesData from "@/data/academies.json";

/** 자치구별 기준점 (대표 지하철역) — 지도 초기 중심 + 거리 계산 기준 */
export const REGION_CENTERS: Record<Region, { lat: number; lng: number; landmark: string }> = {
  강북구: { lat: 37.6266, lng: 127.0254, landmark: "미아역" },
  노원구: { lat: 37.6543, lng: 127.0608, landmark: "노원역" },
  도봉구: { lat: 37.6533, lng: 127.0476, landmark: "창동역" },
  성북구: { lat: 37.5928, lng: 127.0166, landmark: "성신여대입구역" },
};

/** 기본 진입 시 강북구 기준. 사용자가 region 바꾸면 그에 맞춰 panTo. */
export const USER_LOCATION = REGION_CENTERS.강북구;

/**
 * ACADEMIES 데이터 출처:
 * - 시드: src/data/academies.json (시연용 큐레이션 데이터)
 * - 실데이터: scripts/import-academies.mjs 실행 시 같은 파일을 덮어씀
 *   (서울 열린데이터 + 카카오 좌표 변환)
 */
export const ACADEMIES: Academy[] = academiesData as Academy[];

const _RAW_REVIEWS: Review[] = [
  {
    id: "r-1",
    academy_id: "a-eng",
    parent_age_group: "초등",
    parent_grade: "초등 2학년 학부모",
    rating: 5.0,
    content:
      "선생님이 친절하시고 수업 방식이 아이에게 잘 맞았어요. 소수 정예라 아이 케어가 잘 되는 것 같아 만족합니다.",
    created_at: "2026-05-06T08:00:00.000Z",
    pros: ["꼼꼼한 관리", "소수 정예"],
  },
  {
    id: "r-2",
    academy_id: "b-math",
    parent_age_group: "중등",
    parent_grade: "중등 1학년 학부모",
    rating: 4.0,
    content:
      "개별 지도를 잘 해주셔서 수학 실력이 많이 늘었어요. 숙제 관리도 꼼꼼하게 해주십니다.",
    created_at: "2026-05-03T08:00:00.000Z",
    pros: ["개별 지도", "숙제 관리"],
  },
  {
    id: "r-3",
    academy_id: "c-kor",
    parent_age_group: "고등",
    parent_grade: "고등 2학년 학생",
    rating: 4.5,
    content: "문학 분석 수업이 특히 도움이 되었어요. 내신 대비 커리큘럼이 체계적입니다.",
    created_at: "2026-04-29T08:00:00.000Z",
    pros: ["내신 대비", "체계적"],
  },
  {
    id: "r-4",
    academy_id: "e-sci",
    parent_age_group: "중등",
    parent_grade: "중등 2학년 학부모",
    rating: 3.5,
    content: "실험 수업이 재미있고 선생님 설명도 이해하기 쉬워요. 다만 숙제가 조금 많은 편이에요.",
    created_at: "2026-04-25T08:00:00.000Z",
    pros: ["실험", "친절한 설명"],
    cons: ["숙제량"],
  },
  {
    id: "r-5",
    academy_id: "a-eng",
    parent_age_group: "초등",
    parent_grade: "초등 4학년 학부모",
    rating: 4.7,
    content: "개별로 잘 봐주셔서 아이가 스스로 공부하는 습관이 생겼어요.",
    created_at: "2026-04-22T08:00:00.000Z",
    pros: ["개별 관리"],
  },
  {
    id: "r-6",
    academy_id: "g-math",
    parent_age_group: "고등",
    parent_grade: "고등 1학년 학부모",
    rating: 4.6,
    content: "내신 자료가 풍부해서 시험 대비가 수월합니다. 주간 모의고사도 좋아요.",
    created_at: "2026-04-18T08:00:00.000Z",
    pros: ["내신 자료", "모의고사"],
  },
  {
    id: "r-7",
    academy_id: "f-eng",
    parent_age_group: "초등",
    parent_grade: "초등 1학년 학부모",
    rating: 4.4,
    content: "원어민 회화가 처음엔 낯설었는데 두 달 지나니 발음이 좋아졌어요.",
    created_at: "2026-04-15T08:00:00.000Z",
    pros: ["원어민 회화"],
  },
  {
    id: "r-8",
    academy_id: "i-code",
    parent_age_group: "초등",
    parent_grade: "초등 5학년 학부모",
    rating: 4.6,
    content: "프로젝트 결과물이 나와서 아이가 성취감을 느끼는 게 좋아요.",
    created_at: "2026-04-12T08:00:00.000Z",
    pros: ["프로젝트", "성취감"],
  },
];

/**
 * 시드 후기는 시드 학원 ID(`a-eng` 등)를 참조한다.
 * import 후엔 그 ID들이 사라지므로, 매핑 안 되는 후기를
 * 살아있는 학원에 라운드로빈으로 자동 재할당한다 (시연 목적).
 */
const _liveAcademyIds = ACADEMIES.map((a) => a.id);
const _idIsLive = (id: string) => ACADEMIES.some((a) => a.id === id);

export const REVIEWS: Review[] = _RAW_REVIEWS.map((r, i) => {
  if (_idIsLive(r.academy_id)) return r;
  // 살아있는 학원 중 하나에 매핑 (라운드로빈)
  const fallback = _liveAcademyIds[i % _liveAcademyIds.length];
  return { ...r, academy_id: fallback ?? r.academy_id };
});

/**
 * 시드 후기를 기반으로 ACADEMIES의 rating / review_count 패치.
 * 실제 DB 연동 전까지 mock 평점을 UI에 반영하기 위해 사용.
 */
const _reviewMap = REVIEWS.reduce(
  (acc, r) => {
    if (!acc[r.academy_id]) acc[r.academy_id] = [];
    acc[r.academy_id].push(r.rating);
    return acc;
  },
  {} as Record<string, number[]>,
);

/** ACADEMIES with mock ratings applied */
export const ACADEMIES_WITH_RATINGS = ACADEMIES.map((a) => {
  const ratings = _reviewMap[a.id];
  if (!ratings?.length) return a;
  const avg = ratings.reduce((s, v) => s + v, 0) / ratings.length;
  return {
    ...a,
    rating: Math.round(avg * 10) / 10,
    review_count: ratings.length,
  };
});

/**
 * 학원별 5축 점수 — 비교함 우측 추천 사이드바에 사용.
 * 점수 = 100점 만점, 데이터로 유도한 휴리스틱.
 */
export const ACADEMY_SCORES: Record<
  string,
  {
    curriculum: number;
    style: number;
    price: number;
    review: number;
    location: number;
  }
> = ACADEMIES.reduce(
  (acc, a) => {
    const priceScore = Math.max(40, Math.round(100 - (a.monthly_price - 180000) / 2500));
    const distScore = Math.max(40, Math.round(100 - (a.distance_km ?? 1) * 25));
    const reviewScore = Math.round(a.rating * 18 + Math.min(20, a.review_count / 6));
    const styleBoost = a.meta.teaching_style.includes("소수 정예") ? 8 : 0;
    const curriculumScore = Math.min(
      100,
      60 + a.meta.features.length * 6 + styleBoost + (a.meta.level_test ? 5 : 0),
    );
    const styleScore = Math.min(
      100,
      55 + a.meta.teaching_style.length * 10 + (a.meta.difficulty === "기초~심화" ? 8 : 0),
    );
    acc[a.id] = {
      curriculum: curriculumScore,
      style: styleScore,
      price: priceScore,
      review: reviewScore,
      location: distScore,
    };
    return acc;
  },
  {} as Record<
    string,
    {
      curriculum: number;
      style: number;
      price: number;
      review: number;
      location: number;
    }
  >,
);

export const SCORE_AXES = [
  { key: "curriculum", label: "커리큘럼 적합도" },
  { key: "style", label: "수업 방식" },
  { key: "price", label: "가격 만족도" },
  { key: "review", label: "후기 만족도" },
  { key: "location", label: "위치 / 접근성" },
] as const;

export type ScoreAxisKey = (typeof SCORE_AXES)[number]["key"];

export const NEAR_REGIONS: { region: Region; count: number }[] = [
  { region: "노원구", count: 156 },
  { region: "도봉구", count: 98 },
  { region: "성북구", count: 132 },
];

export function findAcademy(id: string) {
  return ACADEMIES_WITH_RATINGS.find((a) => a.id === id);
}
export function getReviewsFor(id: string) {
  return REVIEWS.filter((r) => r.academy_id === id);
}
