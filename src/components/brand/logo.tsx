type MarkProps = {
  size?: number;
  bg?: string;
  fg?: string;
  dot?: string;
  className?: string;
};

export function LogoMark({ size = 28, bg = "#142631", fg = "#f2e9d9", dot = "#d57753", className }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <rect width="64" height="64" rx="17" fill={bg} />
      <path d="M17 45V19h13c10 0 17 4 17 13s-7 13-17 13H17Zm9-8h5c5 0 8-2 8-5s-3-5-8-5h-5v10Z" fill={fg} />
      <circle cx="48" cy="15" r="4" fill={dot} />
    </svg>
  );
}

type LogoProps = MarkProps & {
  word?: string;
  wordClassName?: string;
  dotColor?: string;
};

export function Logo({ word = "currentColor", wordClassName, dotColor, ...mark }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5" role="img" aria-label="Parnuit">
      <LogoMark {...mark} />
      <span className={wordClassName ?? "text-[22px] font-bold leading-none tracking-[-0.06em]"} style={{ color: word }} aria-hidden="true">
        parnuit<span style={{ color: dotColor ?? mark.dot ?? "#d57753" }}>.</span>
      </span>
    </span>
  );
}
