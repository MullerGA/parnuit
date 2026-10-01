"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

function Card({
  title,
  body,
  children,
  className = "",
  horizontal = false,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
  className?: string;
  horizontal?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-[24px] border border-[#0F1222]/8 bg-white p-6 shadow-[0_1px_2px_rgba(15,18,34,.04)] transition hover:shadow-[0_30px_60px_-30px_rgba(46,38,120,.3)] ${horizontal ? "grid gap-6 md:grid-cols-[360px_1fr] md:items-center md:gap-12" : "flex flex-col"} ${className}`}
    >
      <div className={`relative flex-1 ${horizontal ? "min-h-[200px]" : "min-h-[170px]"}`}>{children}</div>
      <div>
        <h3
          className={`text-[#0F1222] ${horizontal ? "text-[26px] font-extrabold tracking-[-0.03em]" : "mt-6 text-[18px] font-bold tracking-[-0.02em]"}`}
        >
          {title}
        </h3>
        <p className={`mt-2 leading-relaxed text-[#0F1222]/60 ${horizontal ? "max-w-xl text-[16px]" : "text-[14.5px]"}`}>{body}</p>
      </div>
    </motion.div>
  );
}

function useLoop(ms: number, steps: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % steps), ms);
    return () => window.clearInterval(id);
  }, [ms, steps]);
  return i;
}

function Rattachement() {
  const i = useLoop(2600, 3);
  const cases = [
    ["Promenade des Anglais, Nice", "Métropole Nice Côte d'Azur"],
    ["Intra-muros, Saint-Malo", "CA du Pays de Saint-Malo"],
    ["Vallée de Chamonix", "CC de la Vallée de Chamonix"],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <motion.div
        key={`a${i}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="self-start rounded-xl border border-[#0F1222]/10 bg-[#F7F7FB] px-3.5 py-2.5 text-[13px] text-[#0F1222]"
      >
        📍 {cases[i][0]}
      </motion.div>
      <svg viewBox="0 0 200 30" className="h-7 w-40 self-center" aria-hidden="true">
        <motion.path
          key={`p${i}`}
          d="M10 2 C 60 30, 140 0, 190 28"
          stroke="url(#g4)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        />
        <defs>
          <linearGradient id="g4">
            <stop offset="0" stopColor="#5B5BF7" />
            <stop offset="1" stopColor="#FF7A59" />
          </linearGradient>
        </defs>
      </svg>
      <motion.div
        key={`b${i}`}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        className="self-end rounded-xl bg-[#0F1222] px-3.5 py-2.5 text-[13px] font-semibold text-white"
      >
        {cases[i][1]}
      </motion.div>
    </div>
  );
}

function Tarif() {
  const parts = [
    ["Voté", 2.14, "#5B5BF7"],
    ["Département +10 %", 0.21, "#A35BF7"],
    ["LGV +34 %", 0.73, "#FF7A59"],
  ] as const;
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="text-[12px] text-[#0F1222]/50">Carcassonne · résidence 4★ · 2026</p>
      <p className="mt-1 text-[42px] font-bold tracking-[-0.04em] text-[#0F1222]">3,08 €</p>
      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-[#F1F1F7]">
        {parts.map(([l, v, c], i) => (
          <motion.span
            key={l}
            initial={{ width: 0 }}
            whileInView={{ width: `${(v / 3.08) * 100}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.35, duration: 0.7 }}
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#0F1222]/55">
        {parts.map(([l, v, c]) => (
          <span key={l} className="flex items-center gap-1">
            <i className="size-1.5 rounded-full" style={{ background: c }} /> {l} · {v.toFixed(2).replace(".", ",")} €
          </span>
        ))}
      </div>
    </div>
  );
}

function Calendrier() {
  const days = Array.from({ length: 35 }, (_, k) => k);
  const marks: Record<number, string> = { 3: "#FF7A59", 9: "#5B5BF7", 14: "#FF7A59", 19: "#5B5BF7", 24: "#A35BF7", 29: "#FF7A59" };
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => (
          <motion.span
            key={d}
            initial={{ opacity: 0.4 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-md bg-[#F4F4F9]"
          >
            {marks[d] && (
              <motion.i
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + d * 0.03, type: "spring", stiffness: 400, damping: 18 }}
                className="absolute inset-1.5 rounded-full"
                style={{ background: marks[d] }}
              />
            )}
          </motion.span>
        ))}
      </div>
      <div className="mt-3 flex gap-2 text-[11px] font-semibold text-[#0F1222]/60">
        {["Google Agenda", "Outlook", "Fichier .ics"].map((x) => (
          <span key={x} className="rounded-full border border-[#0F1222]/10 px-2 py-0.5">
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}

function Rappel() {
  return (
    <div className="flex h-full items-center">
      <motion.div
        initial={{ y: 20, opacity: 0, rotate: 2 }}
        whileInView={{ y: 0, opacity: 1, rotate: -1.5 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
        className="w-full rounded-2xl border border-[#0F1222]/8 bg-white p-4 shadow-[0_20px_40px_-20px_rgba(15,18,34,.35)]"
      >
        <p className="text-[11px] text-[#0F1222]/45">De : Parnuit · À : compta@groupe-horizon.fr</p>
        <p className="mt-1.5 text-[14px] font-bold text-[#0F1222]">J-3 · Déclaration de septembre, Saint-Malo</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-[#0F1222]/60">
          À faire avant le 10 octobre sur le portail de l'agglomération, même à zéro nuitée.
        </p>
        <span className="mt-3 inline-block rounded-lg bg-[#0F1222] px-3 py-1.5 text-[11.5px] font-semibold text-white">
          Ouvrir le portail →
        </span>
      </motion.div>
    </div>
  );
}

function Alerte() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 font-[family-name:var(--font-v4-mono)] text-[12.5px]">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-lg bg-red-50 px-3 py-2 text-red-700"
      >
        − résidence 4★ · 2026 · 3,08 €
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700"
      >
        + résidence 4★ · 2027 · 3,26 €
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="px-1 text-[11.5px] text-[#0F1222]/50"
      >
        Délibération du 28 mai 2026 · absente du catalogue national au 29 septembre
      </motion.p>
    </div>
  );
}

function Sources() {
  return (
    <div className="relative flex h-full items-center justify-center">
      {[0, 1, 2].map((k) => (
        <motion.div
          key={k}
          initial={{ rotate: 0, y: 0 }}
          whileInView={{ rotate: (k - 1) * 7, y: k * -6, x: (k - 1) * 18 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + k * 0.1, type: "spring", stiffness: 120, damping: 14 }}
          className="absolute h-36 w-28 rounded-lg border border-[#0F1222]/10 bg-white p-3 shadow-md"
        >
          <p className="text-[9px] font-bold uppercase text-[#0F1222]/40">Délibération</p>
          <div className="mt-2 space-y-1.5">
            {[80, 95, 60, 90, 70].map((w) => (
              <i key={w} className="block h-1 rounded bg-[#0F1222]/10" style={{ width: `${w}%` }} />
            ))}
          </div>
          {k === 2 && (
            <p className="absolute right-2 bottom-2 left-2 rounded bg-emerald-50 px-1.5 py-1 text-[8.5px] font-semibold text-emerald-700">
              ✓ relevé le 30/09/2026
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export function Bento() {
  return (
    <div className="grid gap-4 md:grid-cols-6">
      <Card
        className="md:col-span-3"
        title="Chaque site rattaché à son vrai collecteur"
        body="Commune, intercommunalité ou métropole : Parnuit retrouve l'organisme qui perçoit la taxe, même quand ce n'est pas la mairie."
      >
        <Rattachement />
      </Card>
      <Card
        className="md:col-span-3"
        title="Le tarif total, par catégorie"
        body="Tarif voté et taxes additionnelles, catégorie par catégorie, avec la délibération qui les fixe."
      >
        <Tarif />
      </Card>
      <Card
        className="md:col-span-2"
        title="Un calendrier pour tout le parc"
        body="Chaque déclaration et chaque reversement, synchronisés avec Google Agenda ou Outlook."
      >
        <Calendrier />
      </Card>
      <Card
        className="md:col-span-2"
        title="Des rappels qui arrivent à temps"
        body="Avant chaque échéance, avec le lien du portail. Y compris pour les déclarations à zéro nuitée."
      >
        <Rappel />
      </Card>
      <Card
        className="md:col-span-2"
        title="Les changements, dès leur publication"
        body="Nouveau tarif, nouveau rythme de reversement, nouvelle délibération : vous êtes prévenu."
      >
        <Alerte />
      </Card>
      <Card
        horizontal
        className="md:col-span-6"
        title="Une source derrière chaque chiffre"
        body="Chaque information garde son document, son adresse et sa date de relevé. En cas de contrôle, vous savez d'où vient le tarif appliqué."
      >
        <Sources />
      </Card>
    </div>
  );
}
