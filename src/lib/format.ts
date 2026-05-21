import type { AgeGroup, Subject } from "./types";

const MARKER_COLORS: Record<Subject, string> = {
  영어: "#2563eb",
  수학: "#7c3aed",
  국어: "#16a34a",
  과학: "#0ea5e9",
  사회: "#f59e0b",
  예체능: "#ec4899",
  코딩: "#14b8a6",
};

export function subjectColor(subject: Subject) {
  return MARKER_COLORS[subject];
}

function toMan(won: number) {
  return Math.round(won / 10000);
}

export function formatPriceMan(won: number) {
  return `₩${toMan(won)}만`;
}

export function formatMonthly(won: number) {
  return `월 ${toMan(won)}만원`;
}

export function formatDistance(km?: number) {
  if (km === undefined) return "";
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

/**
 * "초등 2학년" / "유아" / "고등 3학년" 등 자녀 학년 문자열에서
 * AgeGroup 카테고리를 추출.
 */
export function ageGroupFromGrade(grade?: string): AgeGroup | undefined {
  if (!grade) return undefined;
  if (grade.includes("유아")) return "유아";
  if (grade.includes("초등")) return "초등";
  if (grade.includes("중등") || grade.includes("중학")) return "중등";
  if (grade.includes("고등") || grade.includes("고교")) return "고등";
  return undefined;
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const day = Math.floor(diff / 86_400_000);
  if (day < 0) return "방금";  // 미래 타임스탬프 방어
  if (day === 0) return "오늘";
  if (day === 1) return "1일 전";
  if (day < 7) return `${day}일 전`;
  if (day < 30) return `${Math.floor(day / 7)}주 전`;
  return `${Math.floor(day / 30)}개월 전`;
}
