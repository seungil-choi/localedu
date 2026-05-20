export type Subject =
  | "국어"
  | "영어"
  | "수학"
  | "과학"
  | "사회"
  | "예체능"
  | "코딩";

export type AgeGroup = "유아" | "초등" | "중등" | "고등";

export type TeachingStyle = "소수 정예" | "개별 맞춤" | "그룹 수업" | "1:1 수업";

export type HomeworkLevel = "적음" | "보통" | "많음";

export type Difficulty = "기초" | "기초~심화" | "심화";

export type Region = "강북구" | "노원구" | "도봉구" | "성북구";

export interface AcademyMeta {
  homework_level: HomeworkLevel;
  teaching_style: TeachingStyle[];
  difficulty: Difficulty;
  features: string[]; // 핵심 특징 칩 (예: "내신 전문", "독서 논술")
  class_minutes: number; // 1회 수업 시간(분)
  class_per_week: number; // 주당 수업 횟수
  capacity: number; // 정원
  level_test: boolean; // 레벨 테스트 유무
}

export interface Review {
  id: string;
  academy_id: string;
  parent_age_group: AgeGroup;
  parent_grade?: string; // "초등 2학년 학부모"
  rating: number; // 1~5
  content: string;
  created_at: string; // ISO
  pros?: string[];
  cons?: string[];
}

export interface Academy {
  id: string;
  name: string;
  subject: Subject;
  age_groups: AgeGroup[];
  region: Region;
  dong: string; // 동
  address: string;
  lat: number;
  lng: number;

  rating: number; // 평균 평점
  review_count: number;
  compare_count: number; // 많이 비교됨

  monthly_price: number; // 원 단위
  distance_km?: number; // 사용자 위치 기준 (mock에서는 미아역 기준)

  judgement: string; // 판단 문장
  one_line_summary: string; // 학부모 한 줄 요약
  recommended_for: string[]; // 이 학원은 이런 아이에게

  image: string; // 대표 이미지 (placeholder)
  facility_images: string[];
  facility_labels: string[]; // 강의실 / 1:1 학습실 등

  station: string; // 가까운 역 + 도보 시간
  hours: { weekday: string; weekend: string };
  class_days: string[]; // ["월","수","금"]
  consultation_hours: { weekday: string; weekend: string };

  certified: boolean; // 인증 학원
  meta: AcademyMeta;
  reasons: string[]; // 이 학원이 좋은 이유
  pros_keywords: { label: string; count: number }[];
  cons_keywords: { label: string; count: number }[];
}

export interface FilterState {
  region: Region | "전체";
  ageGroup: AgeGroup | "전체";
  subject: Subject | "전체";
  distanceKm: 0 | 0.5 | 1 | 2 | 3; // 0 = 전체
  priceMax: number; // 원 단위, 0 = 무제한
  teachingStyle: TeachingStyle | "전체";
  homework: HomeworkLevel | "전체";
}

export const DEFAULT_FILTER: FilterState = {
  region: "강북구",
  ageGroup: "전체",
  subject: "전체",
  distanceKm: 0,
  priceMax: 0,
  teachingStyle: "전체",
  homework: "전체",
};
