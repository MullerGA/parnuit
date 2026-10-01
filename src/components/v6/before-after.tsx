"use client";

import { useRef, useState } from "react";

const avant = [
  ["Hôtel Rivage", "Nice", "2,28 ?", "#N/A", "mensuel ? quadri ?", "mdp sur post-it"],
  ["Rés. Remparts", "Carcassonne", "2,14 (hors taxes ?)", "vu passer un PDF", "trimestriel", "carcassonne.taxe…"],
  ["Hôtel Intra-Muros", "St-Malo", "1,35", "=C4*1,1 ???", "avant le 10 ou 15 ?", "voir mail Karine"],
  ["Camping Albères", "Argelès", "0,86", "", "tous les mois", "?"],
  ["Hôtel Opéra", "Paris", "2,60", "8,45 ?? vérifier", "début de mois", "taxedesejour.paris.fr"],
];
const apres = [
  ["Hôtel Rivage", "Métropole Nice Côte d'Azur", "2,28 €", "Quadrimestrielle", "30 janv."],
  ["Résidence Remparts", "Carcassonne", "3,08 € → 3,26 €", "Mensuelle", "courant oct."],
  ["Hôtel Intra-Muros", "CA du Pays de Saint-Malo", "1,35 €", "Trimestrielle", "10 oct."],
  ["Camping Albères", "Argelès-sur-Mer", "0,86 €", "Mensuelle", "courant oct."],
  ["Hôtel Opéra", "Ville de Paris", "8,45 €", "Mensuelle", "courant oct."],
];

export function BeforeAfter() {
  const [pos, setPos] = useState(52);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const move = (x: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setPos(Math.min(96, Math.max(4, ((x - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={box}
      className="relative h-[460px] touch-pan-y overflow-hidden rounded-[28px] border border-[#10202B]/10 bg-white shadow-[0_30px_80px_-50px_rgba(16,32,43,.5)] select-none"
      onPointerDown={(e) => {
        drag.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => drag.current && move(e.clientX)}
      onPointerUp={() => {
        drag.current = false;
      }}
    >
      <div className="absolute inset-0 overflow-hidden bg-[#FBF7F2] p-5 sm:p-7">
        <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#10202B]/50">
          <span className="rounded-full bg-[#10202B] px-2.5 py-0.5 text-white">Avec Parnuit</span> Vue du parc
        </p>
        <div className="mt-4 min-w-[640px] overflow-hidden rounded-2xl border border-[#10202B]/10 bg-white">
          <div className="grid grid-cols-[1.2fr_1.5fr_1.1fr_1fr_0.8fr] bg-[#10202B] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
            <span>Établissement</span>
            <span>Collecteur</span>
            <span>Tarif / nuit</span>
            <span>Déclaration</span>
            <span>Prochaine</span>
          </div>
          {apres.map((r) => (
            <div
              key={r[0]}
              className="grid grid-cols-[1.2fr_1.5fr_1.1fr_1fr_0.8fr] items-center border-t border-[#10202B]/6 px-4 py-3 text-[13.5px]"
            >
              <span className="font-semibold text-[#10202B]">{r[0]}</span>
              <span className="text-[#10202B]/65">{r[1]}</span>
              <span className="font-semibold text-[#10202B]">{r[2]}</span>
              <span>
                <span className="rounded-full bg-[#FBF1EA] px-2 py-0.5 text-[12px] font-semibold text-[#C2502F]">{r[3]}</span>
              </span>
              <span className="font-semibold text-[#E2694A]">{r[4]}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-[#10202B]/55">
          ✓ Taxes additionnelles comprises · ✓ Collecteur réel · ✓ Sources datées · ✓ Rappels activés
        </p>
      </div>
      <div className="absolute inset-0 overflow-hidden bg-[#F2F2F2] p-5 sm:p-7" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#10202B]/50">
          <span className="rounded-full bg-[#C8456F] px-2.5 py-0.5 text-white">Avant</span> suivi_TS_2026_v7_FINAL.xlsx
        </p>
        <div className="mt-4 min-w-[640px] border border-[#BDBDBD] bg-white font-mono text-[12.5px]">
          <div className="grid grid-cols-[1.1fr_1fr_1.2fr_1.2fr_1.2fr_1.2fr] border-b border-[#BDBDBD] bg-[#DDEBF7] font-bold">
            {["Site", "Ville", "Tarif 26", "Tarif 27", "Déclar.", "Portail"].map((c) => (
              <span key={c} className="truncate border-r border-[#BDBDBD] px-2 py-1.5">
                {c}
              </span>
            ))}
          </div>
          {avant.map((r) => (
            <div key={r[0]} className="grid grid-cols-[1.1fr_1fr_1.2fr_1.2fr_1.2fr_1.2fr] border-b border-[#BDBDBD] last:border-b-0">
              {r.map((c, j) => (
                <span
                  key={`${r[0]}-${j}`}
                  className={`truncate border-r border-[#BDBDBD] px-2 py-2 ${c.includes("?") ? "bg-[#FFF2CC]" : ""} ${c.includes("#N/A") ? "bg-[#F8CBAD] text-[#C00000]" : ""}`}
                >
                  {c}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-6 rotate-[-2deg] font-[family-name:var(--font-v6-hand)] text-[26px] leading-tight text-[#C00000]">
          qui a changé la colonne D ??
        </p>
        <p className="mt-3 ml-36 rotate-[1.5deg] font-[family-name:var(--font-v6-hand)] text-[22px] text-[#10202B]/55">
          → relancer la métropole (encore)
        </p>
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-[3px] bg-[#10202B]" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#10202B] text-[18px] text-white shadow-[0_10px_30px_-5px_rgba(16,32,43,.6)] ring-4 ring-white">
          ⇆
        </span>
      </div>
      <label className="sr-only" htmlFor="v6-ba">
        Comparer avant et après
      </label>
      <input id="v6-ba" type="range" min={4} max={96} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="sr-only" />
    </div>
  );
}
