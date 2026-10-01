"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";

export function CountUp({
  to,
  decimals = 0,
  duration = 1.6,
  suffix = "",
  className,
}: {
  to: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = v.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, decimals, duration, suffix]);
  return (
    <span ref={ref} className={className}>
      {(0).toLocaleString("fr-FR", { minimumFractionDigits: decimals }) + suffix}
    </span>
  );
}
