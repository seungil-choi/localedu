import { Icon, type IconName } from "@/components/Icon";
import { IconBadge } from "@/components/ui/IconBadge";

const FEATURES: { icon: IconName; label: string; desc: string }[] = [
  { icon: "map",     label: "지역·거리 기준 발견", desc: "내 위치에서 가까운 학원부터" },
  { icon: "compare", label: "최대 3곳 비교",     desc: "수업 방식·가격·후기 한눈에" },
  { icon: "chat",    label: "한 번에 여러 곳 문의", desc: "상담 신청을 일괄로" },
];

/** 온보딩 Step 0 — 서비스 환영 + 주요 기능 소개. */
export function StepWelcome() {
  return (
    <div className="text-center">
      <IconBadge name="map" size="xl" tone="soft" shape="rounded" className="mx-auto" />
      <h1 className="mt-5 text-[24px] font-bold leading-tight">
        학원지도에 오신 걸<br />환영해요
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
        지도에서 우리 동네 학원을 발견하고
        <br />
        2~3곳을 비교해 빠르게 선택할 수 있어요.
      </p>
      <ul className="mt-6 flex flex-col gap-2 text-left">
        {FEATURES.map((m) => (
          <li
            key={m.label}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Icon name={m.icon} size={18} />
            </span>
            <span>
              <span className="block text-[14px] font-semibold">{m.label}</span>
              <span className="block text-[12px] text-[var(--color-text-tertiary)]">
                {m.desc}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[12px] text-[var(--color-text-tertiary)]">
        1분이면 끝나요. 로그인 없이 시작할 수 있어요.
      </p>
    </div>
  );
}
