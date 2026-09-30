"use client";

import { AnimatePresence, animate, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BetaForm } from "@/components/beta/beta-form";

export const HYP = {
  declarations: 9.4,
  reversements: 4.1,
  minDeclaration: 20,
  minReversement: 15,
  heuresVeille: 3,
  hausse: 0.18,
};

const nf = (n: number, d = 0) => n.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function compute(n: number, c: number, v: number, h: number) {
  const decl = Math.round(n * HYP.declarations);
  const rev = Math.round(n * HYP.reversements);
  const hDecl = (decl * HYP.minDeclaration) / 60;
  const hRev = (rev * HYP.minReversement) / 60;
  const hVeille = c * HYP.heuresVeille;
  const heures = hDecl + hRev + hVeille;
  const cout = heures * h;
  const risque = v * HYP.hausse;
  const remise = n >= 50 ? 0.75 : n >= 10 ? 0.85 : 1;
  const prix = Math.max(290, n * 9 * 12 * remise);
  const minutesEq = (9 * remise * 60) / h;
  const minutesParSite = (heures * 60) / n / 12;
  return { decl, rev, hDecl, hRev, hVeille, heures, cout, risque, prix, remise, minutesEq, minutesParSite };
}

function Odo({ value, d = 0, suffix = "" }: { value: number; d?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctl = animate(prev.current, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (x) => {
        el.textContent = nf(x, d) + suffix;
      },
    });
    prev.current = value;
    return () => ctl.stop();
  }, [value, d, suffix]);
  return (
    <span ref={ref} className="tabular">
      {nf(value, d) + suffix}
    </span>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block border-b-2 border-black py-4">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-[13px] font-semibold uppercase tracking-[0.04em]">{label}</span>
        <span className="font-[family-name:var(--font-v3-display)] text-[30px] font-black leading-none tabular [font-stretch:125%]">
          {format(value)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-brut mt-3 w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
    </label>
  );
}

export function CalculExperience() {
  const [n, setN] = useState(24);
  const [c, setC] = useState(14);
  const [v, setV] = useState(20000);
  const [h, setH] = useState(42);
  const r = useMemo(() => compute(n, Math.min(c, n), v, h), [n, c, v, h]);
  const lines = [
    [`${nf(r.decl)} déclarations × ${HYP.minDeclaration} min`, `${nf(r.hDecl)} h`],
    [`${nf(r.rev)} reversements × ${HYP.minReversement} min`, `${nf(r.hRev)} h`],
    [`${Math.min(c, n)} délibérations à surveiller × ${HYP.heuresVeille} h`, `${nf(r.hVeille)} h`],
  ];
  const key = `${n}-${c}-${v}-${h}`;

  return (
    <>
      <div className="grid border-2 border-black bg-white lg:grid-cols-[1fr_1fr]">
        <div className="border-b-2 border-black p-5 sm:p-7 lg:border-r-2 lg:border-b-0">
          <p className="inline-block bg-black px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#FFE500]">Votre parc</p>
          <Slider
            label="Établissements"
            value={n}
            min={2}
            max={300}
            onChange={(x) => {
              setN(x);
              if (c > x) setC(x);
            }}
            format={(x) => nf(x)}
          />
          <Slider
            label="Collecteurs différents"
            value={Math.min(c, n)}
            min={1}
            max={Math.max(2, Math.min(n, 200))}
            onChange={setC}
            format={(x) => nf(x)}
          />
          <Slider label="Nuitées par site et par an" value={v} min={2000} max={150000} step={1000} onChange={setV} format={(x) => nf(x)} />
          <Slider label="Coût horaire chargé" value={h} min={25} max={90} onChange={setH} format={(x) => `${x} €`} />
          <details className="mt-4 text-[12.5px] leading-relaxed text-black/70">
            <summary className="cursor-pointer font-semibold text-black">Nos hypothèses</summary>
            <p className="mt-2">
              {HYP.declarations} déclarations et {HYP.reversements} reversements par établissement et par an : moyenne réelle des 500
              communes les plus touristiques, selon leurs portails. {HYP.minDeclaration} minutes par déclaration, {HYP.minReversement} par
              reversement, {HYP.heuresVeille} heures par an et par collecteur pour retrouver la délibération, vérifier les catégories et les
              taxes additionnelles, mettre à jour le logiciel de réservation. Risque : la hausse réelle de Carcassonne en 2027 (+0,18 € par
              personne et par nuit en 4★).
            </p>
          </details>
        </div>

        <div className="relative overflow-hidden bg-[#FFE500] p-5 sm:p-7">
          <div className="mx-auto max-w-[400px]">
            <div className="h-3 bg-[repeating-linear-gradient(90deg,#FFE500_0_8px,transparent_8px_16px)]" />
            <AnimatePresence mode="popLayout">
              <motion.div
                key={key}
                initial={{ clipPath: "inset(0 0 100% 0)", y: -12 }}
                animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white px-5 pt-5 pb-7 font-[family-name:var(--font-v3-mono)] text-[13px] text-black shadow-[6px_6px_0_#000] [clip-path:inset(0)] [mask-image:linear-gradient(black,black)]"
              >
                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em]">Ticket · coût annuel caché</p>
                <p className="text-center text-[11px] text-black/50">taxe de séjour, gestion à la main</p>
                <div className="my-4 border-t border-dashed border-black/40" />
                {lines.map(([a, b]) => (
                  <p key={a} className="flex justify-between gap-3 py-1">
                    <span>{a}</span>
                    <span className="shrink-0">{b}</span>
                  </p>
                ))}
                <div className="my-3 border-t border-dashed border-black/40" />
                <p className="flex justify-between py-1 font-semibold">
                  <span>
                    {nf(r.heures)} h × {h} €
                  </span>
                  <span>{nf(r.cout)} €</span>
                </p>
                <p className="flex justify-between py-1">
                  <span>1 tarif oublié sur 1 site</span>
                  <span>{nf(r.risque)} €</span>
                </p>
                <div className="my-3 border-t-2 border-black" />
                <p className="flex items-baseline justify-between">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em]">Total</span>
                  <span className="font-[family-name:var(--font-v3-display)] text-[34px] font-black [font-stretch:125%]">
                    <Odo value={r.cout + r.risque} suffix=" €" />
                  </span>
                </p>
                <p className="mt-4 text-center text-[11px] text-black/50">*** merci de votre patience ***</p>
              </motion.div>
            </AnimatePresence>
            <motion.div
              key={`stamp-${key}`}
              initial={{ scale: 1.6, opacity: 0, rotate: -14 }}
              animate={{ scale: 1, opacity: 1, rotate: -8 }}
              transition={{ delay: 0.45, type: "spring", stiffness: 260, damping: 16 }}
              className="absolute right-3 bottom-5 rounded-md border-[3px] border-[#E4002B] bg-white/85 px-3 py-2 text-center font-[family-name:var(--font-v3-display)] text-[#E4002B] uppercase sm:right-6"
            >
              <span className="block text-[10px] font-bold tracking-[0.1em]">Avec Parnuit</span>
              <span className="block text-[26px] leading-none font-black [font-stretch:125%]">{nf(r.prix)} €</span>
              <span className="block text-[10px] font-bold tracking-[0.1em]">par an</span>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="grid border-x-2 border-b-2 border-black sm:grid-cols-3">
        {[
          [<Odo key="a" value={r.decl + r.rev} />, "échéances par an à ne pas manquer"],
          [<Odo key="b" value={r.minutesParSite} />, "minutes par site et par mois, aujourd'hui"],
          [<Odo key="c" value={r.minutesEq} />, "minutes de travail : le prix de Parnuit par site et par mois"],
        ].map(([val, label], i) => (
          <div
            key={String(label)}
            className={`p-5 sm:p-6 ${i < 2 ? "border-b-2 border-black sm:border-r-2 sm:border-b-0" : ""} ${i === 2 ? "bg-black text-[#FFE500]" : ""}`}
          >
            <p className="font-[family-name:var(--font-v3-display)] text-[54px] leading-none font-black [font-stretch:125%]">{val}</p>
            <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.03em]">{label}</p>
          </div>
        ))}
      </div>

      <section id="acces" className="mt-24 scroll-mt-10 border-2 border-black bg-black text-white sm:mt-32">
        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          <div className="border-b-2 border-white/20 p-6 sm:p-10 lg:border-r-2 lg:border-b-0">
            <p className="inline-block bg-[#FFE500] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-black">
              Bêta privée · gratuite
            </p>
            <h2 className="mt-6 font-[family-name:var(--font-v3-display)] text-[clamp(38px,5.4vw,78px)] leading-[0.9] font-black uppercase [font-stretch:125%]">
              Récupérez vos <span className="text-[#FFE500]">{nf(r.heures)} heures.</span>
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/70">
              Demandez l'accès : nous vous envoyons le calcul exact pour votre parc, commune par commune, dès l'ouverture de la bêta.
            </p>
          </div>
          <div className="p-6 sm:p-10">
            <BetaForm
              version="3-calcul"
              cta="Recevoir mon calcul exact →"
              prefill={`Calcul Parnuit : ${n} établissements, ${Math.min(c, n)} collecteurs, ${nf(r.heures)} h par an estimées.`}
              slots={{
                grid: "grid gap-4",
                field: "flex flex-col gap-1.5",
                label: "text-[12px] font-bold uppercase tracking-[0.08em] text-white/60",
                input:
                  "border-2 border-white bg-black px-4 py-3.5 text-[16px] text-white outline-none placeholder:text-white/30 focus:border-[#FFE500] [&>option]:text-black",
                button:
                  "mt-5 w-full bg-[#FFE500] px-5 py-4 text-[16px] font-black uppercase tracking-[0.04em] text-black transition hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-6px_6px_0_#fff] disabled:opacity-60",
                note: "mt-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-white/45",
                error: "mt-2 text-[13px] font-semibold text-[#FF8A8A]",
                success: "border-2 border-[#FFE500] p-6 text-[16px] leading-relaxed",
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
