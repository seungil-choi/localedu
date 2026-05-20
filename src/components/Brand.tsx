export function BrandLogo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="inline-flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          background: "var(--color-primary)",
          color: "white",
        }}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C7.6 2 4 5.5 4 9.8c0 5.9 7.2 11.6 7.5 11.8.3.2.7.2 1 0 .3-.2 7.5-5.9 7.5-11.8C20 5.5 16.4 2 12 2Zm0 11.5a3.7 3.7 0 1 1 0-7.4 3.7 3.7 0 0 1 0 7.4Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="font-bold text-[18px] tracking-tight">학원지도</span>
    </span>
  );
}
