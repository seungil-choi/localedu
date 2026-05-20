"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { findAcademy } from "@/lib/mock";
import { relativeTime } from "@/lib/format";

export function MyInquiries() {
  const inquiries = useAppStore((s) => s.inquiries);

  if (inquiries.length === 0) return null;

  return (
    <section className="mt-5 rounded-xl border border-[var(--color-border)] bg-white">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <h3 className="text-[14px] font-bold">
          내 문의 내역{" "}
          <span className="text-[var(--color-primary)]">({inquiries.length})</span>
        </h3>
        <span className="text-[11.5px] text-[var(--color-text-tertiary)]">
          이 기기에 저장된 문의
        </span>
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {inquiries.slice(0, 5).map((q) => {
          const academies = q.academyIds
            .map((id) => findAcademy(id))
            .filter((x): x is NonNullable<ReturnType<typeof findAcademy>> => Boolean(x));
          return (
            <li key={q.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1">
                    {academies.slice(0, 2).map((a, i) => (
                      <Link
                        key={a.id}
                        href={`/academy/${a.id}`}
                        className="text-[13.5px] font-semibold hover:underline"
                      >
                        {a.name}
                        {i < Math.min(academies.length, 2) - 1 && (
                          <span className="text-[var(--color-text-tertiary)]">,</span>
                        )}
                      </Link>
                    ))}
                    {academies.length > 2 && (
                      <span className="text-[12px] text-[var(--color-text-secondary)]">
                        외 {academies.length - 2}개
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-[var(--color-text-tertiary)]">
                    {q.childGrade} · 상담 희망: {q.timing} · {relativeTime(q.createdAt)}
                  </div>
                  {q.message && (
                    <p className="mt-1 line-clamp-1 text-[12.5px] text-[var(--color-text-secondary)]">
                      “{q.message}”
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                    q.status === "응답 완료"
                      ? "bg-emerald-50 text-emerald-700"
                      : q.status === "응답 대기"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  }`}
                >
                  {q.status}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      {inquiries.length > 5 && (
        <div className="border-t border-[var(--color-border)] px-4 py-2 text-center text-[12px] text-[var(--color-text-secondary)]">
          + {inquiries.length - 5}건 더 있어요
        </div>
      )}
    </section>
  );
}
