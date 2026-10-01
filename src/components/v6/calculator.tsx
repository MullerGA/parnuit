"use client";

import { animate, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { compute, HYP } from "@/components/calcul/calculator";

const nf = (n: number) => Math.round(n).toLocaleString("fr-FR");

function Num({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const c = animate(prev.current, value, {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = nf(v) + suffix;
      },
    });
    prev.current = value;
    return () => c.stop();
  }, [value, suffix]);
  return (
    <span ref={ref} className="tabular">
      {nf(value) + suffix}
    </span>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-[14px] font-semibold text-[#10202B]">{label}</span>
        <span className="rounded-lg bg-[#10202B] px-2.5 py-1 font-[family-name:var(--font-v6-mono)] text-[14px] text-white tabular">
          {nf(value)}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-v6 mt-3 w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
    </label>
  );
}

export function Calculator() {
  const [n, setN] = useState(24);
  const [c, setC] = useState(14);
  const [v, setV] = useState(20000);
  const [h, setH] = useState(42);
  const cc = Math.min(c, n);
  const r = useMemo(() => compute(n, cc, v, h), [n, cc, v, h]);
  const total = r.cout + r.risque;
  const parts = [
    { label: "Déclarations", value: r.hDecl * h, color: "#E2694A" },
    { label: "Reversements", value: r.hRev * h, color: "#E89A4A" },
    { label: "Veille des délibérations", value: r.hVeille * h, color: "#C8456F" },
    { label: "Un tarif oublié", value: r.risque, color: "#10202B" },
  ];
  const ratio = total / r.prix;

  const send = () => {
    window.dispatchEvent(
      new CustomEvent("pn:calc", {
        detail: `Calcul : ${n} établissements, ${cc} collecteurs, ${nf(r.heures)} h par an, coût caché estimé ${nf(total)} €.`,
      }),
    );
  };

  return (
    <div className="grid overflow-hidden rounded-[28px] border border-[#10202B]/8 bg-white shadow-[0_30px_80px_-50px_rgba(16,32,43,.5)] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-7 border-b border-[#10202B]/8 p-6 sm:p-8 lg:border-r lg:border-b-0">
        <Range
          label="Établissements"
          value={n}
          min={2}
          max={300}
          onChange={(x) => {
            setN(x);
            if (c > x) setC(x);
          }}
        />
        <Range label="Collecteurs différents" value={cc} min={1} max={Math.max(2, Math.min(n, 200))} onChange={setC} />
        <Range label="Nuitées par établissement et par an" value={v} min={2000} max={150000} step={1000} onChange={setV} />
        <Range label="Coût horaire chargé" value={h} min={25} max={90} onChange={setH} unit=" €" />
        <details className="text-[13px] leading-relaxed text-[#10202B]/60">
          <summary className="cursor-pointer font-semibold text-[#10202B]">D'où viennent ces hypothèses ?</summary>
          <p className="mt-2">
            {HYP.declarations} déclarations et {HYP.reversements} reversements par établissement et par an : moyenne des rythmes relevés sur
            les portails des 500 communes les plus touristiques. {HYP.minDeclaration} minutes par déclaration, {HYP.minReversement} par
            reversement, {HYP.heuresVeille} heures par an et par collecteur pour retrouver la délibération, vérifier les catégories et les
            taxes additionnelles et mettre à jour le logiciel de réservation. Risque : la hausse votée à Carcassonne pour 2027, 0,18 € par
            personne et par nuit en 4★, appliquée aux nuitées d'un seul établissement.
          </p>
        </details>
      </div>
      <div className="relative bg-[#FBF7F2] p-6 sm:p-8">
        <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#10202B]/50">Votre coût caché annuel</p>
        <p className="mt-2 text-[clamp(48px,7vw,76px)] font-extrabold leading-none tracking-[-0.045em] text-[#10202B]">
          <Num value={total} suffix=" €" />
        </p>
        <p className="mt-2 text-[14.5px] text-[#10202B]/60">
          soit{" "}
          <strong className="text-[#10202B]">
            <Num value={r.heures} /> heures
          </strong>{" "}
          par an et{" "}
          <strong className="text-[#10202B]">
            <Num value={r.decl + r.rev} /> échéances
          </strong>{" "}
          à ne pas manquer.
        </p>
        <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-[#10202B]/5">
          {parts.map((p) => (
            <motion.span
              key={p.label}
              animate={{ width: `${(p.value / total) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: p.color }}
            />
          ))}
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {parts.map((p) => (
            <li key={p.label} className="flex items-center justify-between gap-3 text-[13.5px]">
              <span className="flex items-center gap-2 text-[#10202B]/70">
                <i className="size-2.5 rounded-full" style={{ background: p.color }} />
                {p.label}
              </span>
              <span className="font-[family-name:var(--font-v6-mono)] text-[#10202B]">{nf(p.value)} €</span>
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#10202B] p-5 text-white">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/50">Parnuit, à l'ouverture</p>
            <p className="mt-1 text-[30px] font-extrabold leading-none tracking-[-0.03em]">
              <Num value={r.prix} suffix=" €" /> <span className="text-[14px] font-medium text-white/50">par an</span>
            </p>
          </div>
          <p className="text-right text-[14px] leading-snug text-white/70">
            <span className="block text-[34px] font-extrabold leading-none text-[#F4A27C]">
              ×<Num value={Math.max(1, ratio)} />
            </span>
            moins cher que la gestion à la main
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            send();
            document.getElementById("diagnostic")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#10202B]/15 bg-white px-5 py-3.5 text-[15px] font-semibold text-[#10202B] transition hover:border-[#E2694A] hover:text-[#E2694A]"
        >
          Recevoir le calcul exact pour mon parc →
        </button>
        <p className="pointer-events-none absolute top-6 right-6 hidden rotate-[4deg] font-[family-name:var(--font-v6-hand)] text-[22px] leading-none text-[#C8456F] xl:block">
          rythmes réels de 500 communes
        </p>
      </div>
    </div>
  );
}
