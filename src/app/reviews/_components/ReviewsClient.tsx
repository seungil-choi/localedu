"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ACADEMIES, REVIEWS, findAcademy } from "@/lib/mock";
import { Thumb } from "@/components/Thumb";
import { Stars } from "@/components/Stars";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AgeGroup, Subject } from "@/lib/types";

type GradeTab = "전체" | AgeGroup;

const SUBJECTS: ("전체" | Subject)[] = [
  "전체",
  "수학",
  "영어",
  "국어",
  "과학",
  "사회",
  "예체능",
];

const RATINGS = [
  { v: 0, label: "전체" },
  { v: 5, label: "5점", stars: "★★★★★" },
  { v: 4, label: "4점", stars: "★★★★" },
  { v: 3, label: "3점", stars: "★★★" },
  { v: 2, label: "2점", stars: "★★" },
  { v: 1, label: "1점", stars: "★" },
];

export function ReviewsClient() {
  const [region] = useState("강북구 전체");
  const [subjects, setSubjects] = useState<Set<string>>(new Set(["전체"]));
  const [grades, setGrades] = useState<Set<GradeTab>>(new Set(["전체"]));
  const [ratings, setRatings] = useState<Set<number>>(new Set([0]));
  const [tab, setTab] = useState<GradeTab>("전체");
  const [sortKey, setSortKey] = useState<"recent" | "helpful" | "rating">("recent");
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const c: Record<GradeTab, number> = {
      전체: REVIEWS.length,
      유아: 0,
      초등: 0,
      중등: 0,
      고등: 0,
    };
    for (const r of REVIEWS) c[r.parent_age_group] = (c[r.parent_age_group] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const subjectFilter = subjects.has("전체") ? null : subjects;
    const gradeFilter = grades.has("전체") ? null : grades;
    const ratingFilter = ratings.has(0) ? null : ratings;

    let arr = REVIEWS.filter((r) => {
      const a = findAcademy(r.academy_id);
      if (!a) return false;
      if (tab !== "전체" && r.parent_age_group !== tab) return false;
      if (subjectFilter && !subjectFilter.has(a.subject)) return false;
      if (gradeFilter && !gradeFilter.has(r.parent_age_group)) return false;
      if (ratingFilter && !ratingFilter.has(Math.floor(r.rating))) return false;
      return true;
    });
    if (sortKey === "rating") arr = [...arr].sort((a, b) => b.rating - a.rating);
    else if (sortKey === "helpful")
      arr = [...arr].sort((a, b) => (helpfulMap[b.id] ? 1 : 0) - (helpfulMap[a.id] ? 1 : 0));
    else
      arr = [...arr].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    return arr;
  }, [subjects, grades, ratings, tab, sortKey, helpfulMap]);

  const TABS: { v: GradeTab; l: string }[] = [
    { v: "전체", l: "전체 후기" },
    { v: "초등", l: "초등" },
    { v: "중등", l: "중등" },
    { v: "고등", l: "고등" },
  ];

  function toggleSet<T>(set: Set<T>, value: T, all: T): Set<T> {
    const next = new Set(set);
    if (value === all) return new Set([all]);
    next.delete(all);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    if (next.size === 0) next.add(all);
    return next;
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6">
      <h1 className="text-[24px] font-bold">후기</h1>
      <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
        실제 다녀온 학부모와 학생들의 솔직한 후기를 확인해보세요.
      </p>

      <div className="mt-5 grid grid-cols-12 gap-5">
        {/* 필터 */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
            <h3 className="text-[14px] font-bold">필터</h3>
            <div className="mt-3">
              <div className="text-[12px] font-semibold text-[var(--color-text-secondary)]">
                📍 지역
              </div>
              <button className="mt-1 flex w-full items-center justify-between rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[13px]">
                {region}
                <span>▾</span>
              </button>
            </div>
            <FilterCheckGroup
              icon="📚"
              label="과목"
              options={SUBJECTS.map((s) => ({ v: s, l: s }))}
              value={subjects}
              onToggle={(v) => setSubjects((cur) => toggleSet(cur, v, "전체"))}
            />
            <FilterCheckGroup
              icon="🎓"
              label="학년"
              options={[
                { v: "전체", l: "전체" },
                { v: "초등", l: "초등" },
                { v: "중등", l: "중등" },
                { v: "고등", l: "고등" },
              ]}
              value={grades as Set<string>}
              onToggle={(v) => setGrades((cur) => toggleSet(cur, v as GradeTab, "전체"))}
            />
            <div className="mt-4">
              <div className="text-[12px] font-semibold text-[var(--color-text-secondary)]">
                ⭐ 별점
              </div>
              <div className="mt-1.5 flex flex-col gap-1">
                {RATINGS.map((r) => {
                  const active = ratings.has(r.v);
                  return (
                    <label
                      key={r.v}
                      className="flex cursor-pointer items-center gap-2 text-[12.5px]"
                    >
                      <span
                        onClick={() =>
                          setRatings((cur) => toggleSet(cur, r.v, 0))
                        }
                        className={`grid h-4 w-4 place-items-center rounded border ${
                          active
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                            : "border-[var(--color-border-strong)] bg-white text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <span>{r.label}</span>
                      {r.stars && (
                        <span className="text-yellow-500">{r.stars}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => {
                setSubjects(new Set(["전체"]));
                setGrades(new Set(["전체"]));
                setRatings(new Set([0]));
              }}
              className="mt-4 w-full rounded-lg border border-[var(--color-border)] bg-white py-2 text-[13px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-soft)]"
            >
              필터 초기화
            </button>
          </div>
        </aside>

        {/* 본문 */}
        <div className="col-span-12 lg:col-span-9">
          <div className="flex items-end justify-between border-b border-[var(--color-border)]">
            <div className="flex items-center gap-1">
              {TABS.map((t) => (
                <button
                  key={t.v}
                  onClick={() => {
                    setTab(t.v);
                    setPage(1);
                  }}
                  className={`relative px-3 py-2.5 text-[14px] font-medium ${
                    tab === t.v
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)]"
                  }`}
                >
                  {t.l}
                  <span className="ml-1 text-[12px] text-[var(--color-text-tertiary)]">
                    {counts[t.v] ?? 0}
                  </span>
                  {tab === t.v && (
                    <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[var(--color-primary)]" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pb-2">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
                className="rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-[12.5px]"
              >
                <option value="recent">최신순</option>
                <option value="helpful">도움돼요순</option>
                <option value="rating">별점순</option>
              </select>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[var(--color-primary-hover)]">
                ✏ 후기 작성하기
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                icon="search"
                title="조건에 맞는 후기가 없어요"
                description="필터를 조정해보세요."
              />
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {filtered.map((r) => {
                const a = findAcademy(r.academy_id);
                if (!a) return null;
                const helpful = helpfulMap[r.id] ?? false;
                return (
                  <li
                    key={r.id}
                    className="rounded-xl border border-[var(--color-border)] bg-white p-4"
                  >
                    <div className="flex items-start gap-4">
                      <Link
                        href={`/academy/${a.id}`}
                        className="block w-[160px] shrink-0"
                      >
                        <Thumb subject={a.subject} name={a.name} ratio="4/3" rounded="rounded-lg" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/academy/${a.id}`}
                            className="text-[15px] font-bold hover:underline"
                          >
                            {a.name}
                          </Link>
                          <span className="rounded bg-[var(--color-primary-soft)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--color-primary)]">
                            {a.subject}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[13px]">
                          <Stars rating={r.rating} size={13} />
                          <span className="text-[var(--color-text-tertiary)]">|</span>
                          <span className="text-[var(--color-text-secondary)]">
                            {r.parent_grade}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed">
                          {r.content}
                        </p>
                        <div className="mt-2.5 text-[11.5px] text-[var(--color-text-tertiary)]">
                          {r.parent_grade?.includes("학부모") ? "김민지 학부모" : "박정호 학생"}
                          <span className="mx-1.5">·</span>
                          {fmtDate(r.created_at)}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <button
                          onClick={() =>
                            setHelpfulMap((cur) => ({ ...cur, [r.id]: !cur[r.id] }))
                          }
                          className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-[12px] ${
                            helpful
                              ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                              : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-soft)]"
                          }`}
                        >
                          👍 도움돼요{" "}
                          <span className="font-semibold">
                            {(helpful ? 1 : 0) + (10 + (r.id.charCodeAt(2) % 12))}
                          </span>
                        </button>
                        <button
                          aria-label="더보기"
                          className="text-[var(--color-text-tertiary)]"
                        >
                          ⋮
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* 페이지네이션 */}
          {filtered.length > 0 && (
            <nav className="mt-6 flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`grid h-8 w-8 place-items-center rounded text-[13px] ${
                    p === page
                      ? "bg-[var(--color-primary-soft)] font-semibold text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-soft)]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <span className="px-2 text-[var(--color-text-tertiary)]">…</span>
              <button className="grid h-8 w-8 place-items-center rounded text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-soft)]">
                25
              </button>
              <button className="grid h-8 w-8 place-items-center rounded">›</button>
            </nav>
          )}

          {/* 학원별 후기 진입 */}
          <div className="mt-8">
            <h3 className="text-[15px] font-bold">학원별 후기 보기</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
              {ACADEMIES.slice(0, 8).map((a) => (
                <Link
                  key={a.id}
                  href={`/academy/${a.id}`}
                  className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white p-2 hover:bg-[var(--color-bg-soft)]"
                >
                  <span className="h-9 w-12 shrink-0 overflow-hidden rounded">
                    <Thumb subject={a.subject} name={a.name} ratio="4/3" rounded="rounded" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px] font-semibold">
                      {a.name}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-tertiary)]">
                      후기 {a.review_count}개
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterCheckGroup({
  icon,
  label,
  options,
  value,
  onToggle,
}: {
  icon: string;
  label: string;
  options: { v: string; l: string }[];
  value: Set<string>;
  onToggle: (v: string) => void;
}) {
  return (
    <div className="mt-4">
      <div className="text-[12px] font-semibold text-[var(--color-text-secondary)]">
        {icon} {label}
      </div>
      <div className="mt-1.5 flex flex-col gap-1">
        {options.map((o) => {
          const active = value.has(o.v);
          return (
            <label
              key={o.v}
              className="flex cursor-pointer items-center gap-2 text-[12.5px]"
            >
              <span
                onClick={() => onToggle(o.v)}
                className={`grid h-4 w-4 place-items-center rounded border ${
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-[var(--color-border-strong)] bg-white text-transparent"
                }`}
              >
                ✓
              </span>
              <span>{o.l}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
