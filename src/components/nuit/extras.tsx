"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const briefing = [
  { tag: "Déclarer", title: "Nuitées de septembre", where: "Paris · taxedesejour.paris.fr", when: "début octobre", tone: "#E0876A" },
  { tag: "Reverser", title: "Troisième trimestre", where: "Saint-Malo · portail 3D Ouest", when: "avant le 10 octobre", tone: "#F3C77A" },
  {
    tag: "Changement",
    title: "Reversement désormais mensuel",
    where: "Carcassonne · depuis le 1er octobre",
    when: "à noter",
    tone: "#9FB4FF",
  },
  {
    tag: "Tarif 2027",
    title: "Résidence 4★ : 3,08 € → 3,26 €",
    where: "Carcassonne · délibération du 28 mai",
    when: "avant le 1er janvier",
    tone: "#F3C77A",
  },
];

export function MorningBriefing() {
  return (
    <div className="relative mx-auto w-full max-w-xl rounded-[28px] border border-white/10 bg-white/[.06] p-5 shadow-[0_40px_120px_-40px_rgba(243,199,122,.35)] backdrop-blur-xl sm:p-7">
      <div className="flex items-baseline justify-between">
        <p className="font-[family-name:var(--font-v2-mono)] text-[11px] uppercase tracking-[0.18em] text-[#F3C77A]">
          Jeudi 1er octobre · 7 h 00
        </p>
        <p className="text-[12px] text-white/50">7 établissements</p>
      </div>
      <p className="mt-3 font-[family-name:var(--font-v2-serif)] text-[34px] leading-none text-white">Bonjour. 4 choses aujourd'hui.</p>
      <ul className="mt-6 space-y-2.5">
        {briefing.map((b, i) => (
          <motion.li
            key={b.title}
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.25 + i * 0.22, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 rounded-2xl bg-black/25 px-4 py-3.5 ring-1 ring-white/5"
          >
            <span className="size-2 shrink-0 rounded-full" style={{ background: b.tone, boxShadow: `0 0 14px ${b.tone}` }} />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: b.tone }}>
                {b.tag}
              </span>
              <span className="block truncate text-[15px] font-medium text-white">{b.title}</span>
              <span className="block truncate text-[12.5px] text-white/50">{b.where}</span>
            </span>
            <span className="shrink-0 text-right text-[12px] text-white/60">{b.when}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const stack = [
  { label: "Tarif voté par Paris", value: 2.6, color: "#DCE3FF" },
  { label: "Département, +10 %", value: 0.26, color: "#9FB4FF" },
  { label: "Société des grands projets, +15 %", value: 0.39, color: "#E0876A" },
  { label: "Île-de-France Mobilités, +200 %", value: 5.2, color: "#F3C77A" },
];

export function ParisStack() {
  const total = stack.reduce((s, x) => s + x.value, 0);
  return (
    <div>
      <div className="flex h-16 w-full overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
        {stack.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ width: 0 }}
            whileInView={{ width: `${(s.value / total) * 100}%` }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.3 + i * 0.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: s.color }}
            className="h-full"
          />
        ))}
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {stack.map((s, i) => (
          <motion.li
            key={s.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.45 }}
            className="flex items-center justify-between gap-3 border-b border-white/10 pb-3"
          >
            <span className="flex items-center gap-2.5 text-[14px] text-white/75">
              <i className="size-2.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="font-[family-name:var(--font-v2-mono)] text-[15px] text-white">{s.value.toFixed(2).replace(".", ",")} €</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const TARGET = new Date("2027-01-01T00:00:00+01:00").getTime();

export function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, TARGET - (now ?? TARGET));
  const parts = [
    [Math.floor(diff / 86400000), "jours"],
    [Math.floor(diff / 3600000) % 24, "heures"],
    [Math.floor(diff / 60000) % 60, "minutes"],
    [Math.floor(diff / 1000) % 60, "secondes"],
  ] as const;
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {parts.map(([v, l]) => (
        <div key={l} className="rounded-2xl border border-white/10 bg-white/[.04] px-2 py-5 text-center">
          <p className="font-[family-name:var(--font-v2-serif)] text-[clamp(40px,7vw,88px)] leading-none text-white tabular">
            {now == null ? "··" : String(v).padStart(2, "0")}
          </p>
          <p className="mt-2 font-[family-name:var(--font-v2-mono)] text-[10.5px] uppercase tracking-[0.18em] text-white/45">{l}</p>
        </div>
      ))}
    </div>
  );
}

export function Moon({ phase }: { phase: number }) {
  const r = 26;
  const x = r * Math.cos(Math.PI * phase);
  return (
    <svg viewBox="-30 -30 60 60" className="size-14" aria-hidden="true">
      <circle r={r} fill="#1A2140" stroke="#F3C77A" strokeOpacity="0.35" />
      <path d={`M0 -${r} A ${r} ${r} 0 0 1 0 ${r} A ${Math.abs(x)} ${r} 0 0 ${x > 0 ? 0 : 1} 0 -${r}`} fill="#F3C77A" />
    </svg>
  );
}
