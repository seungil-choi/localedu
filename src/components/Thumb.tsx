import { subjectColor } from "@/lib/format";
import type { Subject } from "@/lib/types";

/** 과목별 아이콘 SVG (path만) */
const SUBJECT_ICONS: Record<Subject, string> = {
  수학: `<path d="M12 6h-6m3-3v6M6 18h6m0 0 3-3m-3 3 3 3M18 6l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  영어: `<path d="M4 6h16M4 12h10M4 18h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  국어: `<path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  과학: `<path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  사회: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" stroke-width="2"/>`,
  예체능: `<circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  코딩: `<path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
};

/** 과목별 배경 그라데이션 (밝고 온화한 톤) */
const SUBJECT_BG: Record<Subject, { from: string; to: string }> = {
  수학: { from: "#4f46e5", to: "#7c3aed" },
  영어: { from: "#1d4ed8", to: "#2563eb" },
  국어: { from: "#15803d", to: "#16a34a" },
  과학: { from: "#0369a1", to: "#0ea5e9" },
  사회: { from: "#b45309", to: "#f59e0b" },
  예체능: { from: "#be185d", to: "#ec4899" },
  코딩: { from: "#0f766e", to: "#14b8a6" },
};

/**
 * 학원 대표 이미지 placeholder.
 * 과목별 브랜드 컬러 + 아이콘으로 실제 학원처럼 보이게.
 * 실제 사진 업로드 후 next/image로 교체.
 */
export function Thumb({
  subject,
  name,
  ratio = "16/9",
  rounded = "rounded-xl",
}: {
  subject: Subject;
  name: string;
  ratio?: string;
  rounded?: string;
}) {
  const bg = SUBJECT_BG[subject] ?? { from: "#374151", to: "#6b7280" };
  const icon = SUBJECT_ICONS[subject] ?? "";
  const short = name.length > 12 ? name.slice(0, 12) + "…" : name;

  return (
    <div
      className={`relative overflow-hidden ${rounded}`}
      style={{
        aspectRatio: ratio,
        background: `linear-gradient(135deg, ${bg.from} 0%, ${bg.to} 100%)`,
      }}
    >
      {/* 미묘한 패턴 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* 중앙 아이콘 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="opacity-20"
          style={{ width: "45%", height: "45%" }}
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      </div>

      {/* 하단 그라데이션 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }}
      />

      {/* 학원명 + 과목 */}
      <div className="absolute bottom-3 left-3 right-3">
        <p className="truncate text-[13px] font-bold leading-tight text-white drop-shadow">
          {short}
        </p>
        <span className="mt-0.5 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
          {subject}
        </span>
      </div>
    </div>
  );
}
