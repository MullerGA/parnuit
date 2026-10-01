"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { compute, HYP } from "@/components/calcul/calculator";

const nf = (n: number) => Math.round(n).toLocaleString("fr-FR");

export function HeroTicket() {
  const r = compute(24, 14, 20000, 42);
  const ref = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const lines = [
    [`${nf(r.decl)} déclarations × ${HYP.minDeclaration} min`, `${nf(r.hDecl)} h`],
    [`${nf(r.rev)} reversements × ${HYP.minReversement} min`, `${nf(r.hRev)} h`],
    [`14 délibérations à surveiller × ${HYP.heuresVeille} h`, `${nf(r.hVeille)} h`],
    [`${nf(r.heures)} heures × 42 €`, `${nf(r.cout)} €`],
    ["Un tarif 2027 oublié sur un seul site", `${nf(r.risque)} €`],
  ];
  useEffect(() => {
    if (!inView || !totalRef.current) return;
    const el = totalRef.current;
    const c = animate(0, r.cout + r.risque, {
      delay: 1.5,
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${nf(v)} €`;
      },
    });
    return () => c.stop();
  }, [inView, r.cout, r.risque]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[440px]">
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 2 }}
        animate={inView ? { opacity: 1, y: 0, rotate: -1.5 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="ticket relative bg-white px-7 pt-7 pb-10 shadow-[0_40px_90px_-40px_rgba(16,32,43,.55),0_0_0_1px_rgba(16,32,43,.05)]"
      >
        <div className="flex items-center justify-between font-[family-name:var(--font-v6-mono)] text-[11px] uppercase tracking-[0.16em] text-[#10202B]/50">
          <span>Coût annuel caché</span>
          <span>Exemple</span>
        </div>
        <p className="mt-2 text-[15px] font-semibold text-[#10202B]">Groupe de 24 établissements, 14 collecteurs</p>
        <div className="my-4 border-t border-dashed border-[#10202B]/20" />
        <ul className="space-y-2.5 font-[family-name:var(--font-v6-mono)] text-[13px] text-[#10202B]/80">
          {lines.map(([a, b], i) => (
            <motion.li
              key={a}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.35 + i * 0.18 }}
              className={`flex justify-between gap-4 ${i === 3 ? "border-t border-dashed border-[#10202B]/20 pt-2.5 font-semibold text-[#10202B]" : ""}`}
            >
              <span>{a}</span>
              <span className="shrink-0 tabular">{b}</span>
            </motion.li>
          ))}
        </ul>
        <div className="mt-4 border-t-2 border-[#10202B] pt-3">
          <p className="flex items-baseline justify-between">
            <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#10202B]/60">Total</span>
            <span ref={totalRef} className="text-[38px] font-extrabold tracking-[-0.03em] text-[#10202B] tabular">
              0 €
            </span>
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ scale: 1.8, opacity: 0, rotate: -20 }}
        animate={inView ? { scale: 1, opacity: 1, rotate: -9 } : {}}
        transition={{ delay: 2.4, type: "spring", stiffness: 260, damping: 15 }}
        className="absolute -bottom-14 left-4 rounded-xl border-[3px] border-[#E2694A] bg-[#FFF8F3] px-4 py-2.5 text-center text-[#E2694A] shadow-lg sm:-left-6"
      >
        <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em]">Avec Parnuit</span>
        <span className="block text-[28px] font-extrabold leading-none tracking-[-0.03em]">{nf(r.prix)} €</span>
        <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em]">par an</span>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 3 }}
        className="absolute -top-10 -left-2 hidden rotate-[-6deg] font-[family-name:var(--font-v6-hand)] text-[26px] leading-none text-[#C8456F] lg:block"
      >
        ce que personne ne budgète ↓
      </motion.p>
    </div>
  );
}
