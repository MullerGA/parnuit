"use client";

import { motion } from "motion/react";

export function Strike({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="relative inline-block justify-self-start self-start text-[18px] font-medium text-black/55">
      {children}
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.3 + delay, duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
        className="absolute top-1/2 left-0 h-[3px] w-full origin-left bg-[#E4002B]"
      />
    </span>
  );
}
