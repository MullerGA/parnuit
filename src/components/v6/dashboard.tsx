"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const rows = [
  {
    site: "Hôtel Rivage",
    commune: "Nice",
    coll: "Métropole Nice Côte d'Azur",
    tarif: "2,28 €",
    statut: "À déclarer",
    tone: "amber",
    next: "30 janv.",
  },
  {
    site: "Résidence Les Remparts",
    commune: "Carcassonne",
    coll: "Carcassonne",
    tarif: "3,08 €",
    statut: "Tarif 2027",
    tone: "violet",
    next: "courant oct.",
  },
  {
    site: "Hôtel Intra-Muros",
    commune: "Saint-Malo",
    coll: "CA du Pays de Saint-Malo",
    tarif: "1,35 €",
    statut: "À reverser",
    tone: "coral",
    next: "10 oct.",
  },
  {
    site: "Camping Les Albères",
    commune: "Argelès-sur-Mer",
    coll: "Argelès-sur-Mer",
    tarif: "0,86 €",
    statut: "À jour",
    tone: "green",
    next: "courant oct.",
  },
  {
    site: "Résidence Aiguille",
    commune: "Chamonix-Mont-Blanc",
    coll: "CC Vallée de Chamonix",
    tarif: "1,70 €",
    statut: "À jour",
    tone: "green",
    next: "courant oct.",
  },
  {
    site: "Hôtel Opéra",
    commune: "Paris",
    coll: "Ville de Paris",
    tarif: "8,45 €",
    statut: "À déclarer",
    tone: "amber",
    next: "courant oct.",
  },
];

const tones: Record<string, string> = {
  amber: "bg-amber-100 text-amber-800",
  violet: "bg-orange-100 text-orange-800",
  coral: "bg-orange-100 text-orange-800",
  green: "bg-emerald-100 text-emerald-800",
};

const feed = [
  { t: "Tarif 2027 publié", d: "Carcassonne · résidence 4★ : 3,26 €", c: "#E2694A" },
  { t: "Rappel J-3", d: "Saint-Malo · reverser le 3e trimestre", c: "#C8456F" },
  { t: "Reversement mensuel", d: "Carcassonne · depuis le 1er octobre", c: "#3B82F6" },
  { t: "Déclaration envoyée", d: "Argelès-sur-Mer · septembre", c: "#10B981" },
];

export function Dashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const [n, setN] = useState(1);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setN((x) => (x % feed.length) + 1), 2400);
    const s = window.setTimeout(() => setSynced(true), 2600);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(s);
    };
  }, []);

  return (
    <div ref={ref} className="[perspective:1600px]">
      <motion.div
        style={{ rotateX, scale }}
        className="relative origin-top overflow-hidden rounded-[20px] border border-white/10 bg-white shadow-[0_50px_120px_-40px_rgba(0,0,0,.6),0_0_0_1px_rgba(15,18,34,.04)] backdrop-blur-xl"
      >
        <div className="flex">
          <aside className="hidden w-[190px] shrink-0 border-r border-[#10202B]/6 bg-[#F7F3EE] p-4 md:block">
            <p className="flex items-center gap-2 text-[13px] font-bold text-[#10202B]">
              <span className="grid size-6 place-items-center rounded-md bg-[#10202B] text-[10px] text-white">P</span> Groupe Horizon
            </p>
            <ul className="mt-6 space-y-1 text-[12.5px] text-[#10202B]/65">
              {["Vue du parc", "Calendrier", "Alertes", "Fiches collectivités", "Sources", "Réglages"].map((x, i) => (
                <li key={x} className={`rounded-lg px-2.5 py-1.5 ${i === 0 ? "bg-white font-semibold text-[#10202B] shadow-sm" : ""}`}>
                  {x}
                  {x === "Alertes" && <span className="ml-2 rounded-full bg-[#E2694A] px-1.5 text-[10px] text-white">3</span>}
                </li>
              ))}
            </ul>
          </aside>
          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-[#10202B]/50">Jeudi 1er octobre 2026</p>
                <p className="text-[18px] font-bold tracking-[-0.02em] text-[#10202B]">Vue du parc · 38 établissements</p>
              </div>
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {synced && (
                    <motion.span
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200"
                    >
                      ✓ Synchronisé avec Google Agenda
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="rounded-lg bg-[#10202B] px-3 py-1.5 text-[11.5px] font-semibold text-white">Exporter .ics</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["12", "échéances ce mois-ci"],
                ["27", "collecteurs"],
                ["3", "alertes de changement"],
                ["100 %", "fiches sourcées"],
              ].map(([a, b]) => (
                <div key={b} className="rounded-xl border border-[#10202B]/6 bg-white p-3">
                  <p className="text-[20px] font-bold tracking-[-0.03em] text-[#10202B]">{a}</p>
                  <p className="text-[11px] text-[#10202B]/50">{b}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_240px]">
              <div className="overflow-hidden rounded-xl border border-[#10202B]/6 bg-white">
                <div className="grid grid-cols-[1.4fr_1fr_0.6fr_0.8fr] gap-2 border-b border-[#10202B]/6 px-3 py-2 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#10202B]/40">
                  <span>Établissement</span>
                  <span className="hidden sm:block">Collecteur</span>
                  <span>Tarif</span>
                  <span>Statut</span>
                </div>
                {rows.map((r, i) => (
                  <motion.div
                    key={r.site}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="grid grid-cols-[1.4fr_1fr_0.6fr_0.8fr] items-center gap-2 border-b border-[#10202B]/5 px-3 py-2.5 text-[12px] last:border-b-0"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-[#10202B]">{r.site}</span>
                      <span className="block truncate text-[11px] text-[#10202B]/45">{r.commune}</span>
                    </span>
                    <span className="hidden truncate text-[#10202B]/60 sm:block">{r.coll}</span>
                    <span className="font-[family-name:var(--font-v6-mono)] text-[#10202B]">{r.tarif}</span>
                    <span className={`justify-self-start rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${tones[r.tone]}`}>
                      {r.statut}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="rounded-xl border border-[#10202B]/6 bg-white p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#10202B]/45">Fil d'alertes</p>
                <ul className="mt-2 space-y-2">
                  <AnimatePresence initial={false}>
                    {feed.slice(0, n).map((f) => (
                      <motion.li
                        key={f.t}
                        layout
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-lg bg-[#F7F3EE] p-2.5"
                      >
                        <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#10202B]">
                          <i className="size-1.5 rounded-full" style={{ background: f.c }} />
                          {f.t}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#10202B]/55">{f.d}</p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <p className="mt-4 text-center text-[12px] text-[#10202B]/45">
        Interface de la bêta. Établissements fictifs, tarifs et calendriers réels des communes citées.
      </p>
    </div>
  );
}
