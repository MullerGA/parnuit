"use client";

import { motion } from "motion/react";
import { CARCASSONNE } from "@/lib/facts";

const steps = [
  { date: CARCASSONNE.vote, title: "Le conseil municipal vote les tarifs 2027", tone: "muted" },
  { date: CARCASSONNE.publication, title: "La délibération est publiée sur le site de la ville", tone: "muted" },
  { date: CARCASSONNE.absent, title: "Elle n'apparaît toujours pas dans les fichiers nationaux de la DGFiP", tone: "warn" },
];

export function ChangeTimeline() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-6">
      <ol className="relative min-w-0 space-y-7 border-l border-[#142631]/15 pl-7">
        {steps.map((s, i) => (
          <motion.li
            key={s.date}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.18, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <span
              className={`absolute top-1.5 -left-[33px] size-3 rounded-full ring-4 ring-[#F7F5F0] ${s.tone === "warn" ? "bg-[#C2410C]" : "bg-[#142631]/35"}`}
            />
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#142631]/50">{s.date}</p>
            <p className="mt-1 text-[17px] font-medium text-[#142631]">{s.title}</p>
          </motion.li>
        ))}
        <motion.li
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <span className="absolute top-1.5 -left-[35px] size-4 rounded-full bg-[#D57753] ring-4 ring-[#F7F5F0]">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#D57753]/60" />
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#D57753]">Parnuit</p>
          <p className="mt-1 text-[17px] font-medium text-[#142631]">Vous êtes prévenu, avec la pièce officielle.</p>
        </motion.li>
      </ol>

      <div className="min-w-0 space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[22px] border border-[#142631]/10 bg-white p-5 shadow-[0_30px_70px_-35px_rgba(20,38,49,.45)]"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[12px] font-semibold text-[#D57753]">
              <span className="size-2 rounded-full bg-[#D57753]" /> Changement de tarif détecté
            </span>
            <span className="font-mono text-[10.5px] text-[#142631]/40">effet au 1er janvier 2027</span>
          </div>
          <p className="mt-3 text-[20px] font-semibold tracking-[-0.02em] text-[#142631]">Carcassonne · Résidence 4★</p>
          <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
            <div>
              <p className="text-[11px] text-[#142631]/50">2026</p>
              <p className="font-mono text-[24px] text-[#142631]/45 line-through decoration-[#142631]/30 tabular sm:text-[28px]">3,08 €</p>
            </div>
            <span className="pb-2 text-[22px] text-[#142631]/30">→</span>
            <div>
              <p className="text-[11px] text-[#142631]/50">2027</p>
              <p className="font-mono text-[34px] font-semibold leading-none text-[#142631] tabular sm:text-[40px]">3,26 €</p>
            </div>
            <span className="mb-1 ml-auto rounded-full bg-[#C2410C]/10 px-2.5 py-1 font-mono text-[12px] font-semibold text-[#C2410C]">
              +5,8 %
            </span>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-[#142631]/65">
            Par personne et par nuit, taxes additionnelles comprises. À paramétrer dans votre logiciel de réservation avant le 1er janvier :
            un tarif oublié se paie de votre poche.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={CARCASSONNE.url2027}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#142631] px-3 py-2 text-[12.5px] font-medium text-[#F2E9D9] hover:bg-[#1d3542]"
            >
              Délibération 2027 ↗
            </a>
            <a
              href={CARCASSONNE.url2026}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#142631]/15 px-3 py-2 text-[12.5px] font-medium text-[#142631] hover:border-[#142631]/35"
            >
              Délibération 2026 ↗
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start gap-3 rounded-2xl border border-[#142631]/10 bg-white/70 p-4"
        >
          <span className="mt-1 size-2 shrink-0 rounded-full bg-[#142631]" />
          <p className="text-[13.5px] leading-relaxed text-[#142631]/75">
            <strong className="font-semibold text-[#142631]">Aussi à Carcassonne : le reversement devient mensuel.</strong> Depuis le 1er
            octobre 2026, la taxe se reverse chaque mois au lieu de chaque trimestre, selon le portail de la ville.
            <span className="block pt-1 font-mono text-[10.5px] text-[#142631]/45">
              carcassonne.taxesejour.fr · relevé le 30 septembre 2026
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
