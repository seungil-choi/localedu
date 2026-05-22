import { Icon } from "@/components/Icon";
import { EmptyState } from "@/components/ui/EmptyState";

/** 강사진 탭 — Phase 2 콘텐츠 (현재 플레이스홀더). */
export function FacultyTab() {
  const roles = ["학원장 / 대표 강사", "수학 담당 강사", "영어 담당 강사"];

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
      <EmptyState
        variant="inline"
        icon="users"
        title="강사진 정보 준비 중"
        description="담당 선생님 정보는 상담을 통해 직접 확인하실 수 있어요."
      />
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {roles.map((role) => (
          <div
            key={role}
            className="rounded-xl border border-dashed border-[var(--color-border)] p-4 text-center"
          >
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)]">
              <Icon name="users" size={20} />
            </span>
            <p className="mt-2 text-[12.5px] text-[var(--color-text-secondary)]">{role}</p>
            <p className="text-[11.5px] text-[var(--color-text-tertiary)]">정보 준비 중</p>
          </div>
        ))}
      </div>
    </div>
  );
}
