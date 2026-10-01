"use client";

import { useRef, useState } from "react";

const avant = [
  ["Hôtel Rivage", "Nice", "2,28 ?", "#N/A", "mensuel ? quadri ?", "mdp sur post-it"],
  ["Rés. Remparts", "Carcassonne", "2,14 (hors taxes ?)", "vu passer un PDF", "trimestriel", "carcassonne.taxe…"],
  ["Hôtel Intra-Muros", "St-Malo", "1,35", "=C4*1,1 ???", "avant le 10 ou 15 ?", "voir mail Karine"],
  ["Camping Albères", "Argelès", "0,86", "", "tous les mois", "?"],
  ["Hôtel Opéra", "Paris", "2,60", "8,45 ?? vérifier", "début de mois", "taxedesejour.paris.fr"],
];
const apres = [
  ["Hôtel Rivage", "Métropole Nice Côte d'Azur", "2,28 €", "Quadrimestrielle", "30 janv."],
  ["Résidence Remparts", "Carcassonne", "3,08 € → 3,26 €", "Mensuelle", "courant oct."],
  ["Hôtel Intra-Muros", "CA du Pays de Saint-Malo", "1,35 €", "Trimestrielle", "10 oct."],
  ["Camping Albères", "Argelès-sur-Mer", "0,86 €", "Mensuelle", "courant oct."],
  ["Hôtel Opéra", "Ville de Paris", "8,45 €", "Mensuelle", "courant oct."],
];

export function BeforeAfter() {
  const [pos, setPos] = useState(55);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={box}
      className="relative h-[520px] touch-pan-y overflow-hidden rounded-[26px] border-[2.5px] border-[#1B1B1B] bg-white shadow-[8px_8px_0_#1B1B1B] select-none sm:h-[480px]"
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
      <div className="absolute inset-0 overflow-auto bg-[#FFFDF8] p-5 sm:p-7">
        <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1B1B1B]/50">
          <span className="rounded-full bg-[#B8F0C2] px-2 py-0.5 text-[#1B1B1B]">Avec Parnuit</span> Vue du parc
        </p>
        <div className="mt-4 min-w-[620px] overflow-hidden rounded-2xl border-2 border-[#1B1B1B]">
          <div className="grid grid-cols-[1.2fr_1.5fr_1.1fr_1fr_0.8fr] bg-[#1B1B1B] px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.06em] text-white">
            <span>Site</span>
            <span>Collecteur</span>
            <span>Tarif / nuit</span>
            <span>Déclaration</span>
            <span>Prochaine</span>
          </div>
          {apres.map((r) => (
            <div
              key={r[0]}
              className="grid grid-cols-[1.2fr_1.5fr_1.1fr_1fr_0.8fr] items-center border-t-2 border-[#1B1B1B]/10 px-4 py-3 text-[13.5px]"
            >
              <span className="font-bold">{r[0]}</span>
              <span className="text-[#1B1B1B]/70">{r[1]}</span>
              <span className="font-semibold">{r[2]}</span>
              <span>
                <span className="rounded-full bg-[#A9D4FF]/60 px-2 py-0.5 text-[12px] font-semibold">{r[3]}</span>
              </span>
              <span className="font-semibold text-[#FF6B3D]">{r[4]}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-[#1B1B1B]/55">
          ✓ Tarifs taxes additionnelles comprises · ✓ Collecteur réel · ✓ Sources datées · ✓ Rappels activés
        </p>
      </div>

      <div className="absolute inset-0 overflow-hidden bg-[#F3F3F3] p-5 sm:p-7" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1B1B1B]/50">
          <span className="rounded-full bg-[#FFB3C7] px-2 py-0.5 text-[#1B1B1B]">Avant</span> suivi_TS_2026_v7.xlsx
        </p>
        <div className="mt-4 min-w-[620px] border border-[#BDBDBD] bg-white font-mono text-[12.5px]">
          <div className="grid grid-cols-[1.1fr_1fr_1.2fr_1.2fr_1.2fr_1.2fr] bg-[#E8E8E8] text-[11px] text-[#555]">
            {["A", "B", "C", "D", "E", "F"].map((c) => (
              <span key={c} className="border-r border-[#BDBDBD] px-2 py-1 text-center">
                {c}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-[1.1fr_1fr_1.2fr_1.2fr_1.2fr_1.2fr] border-t border-[#BDBDBD] bg-[#DDEBF7] font-bold">
            {["Site", "Ville", "Tarif 26", "Tarif 27", "Déclar.", "Portail"].map((c) => (
              <span key={c} className="truncate border-r border-[#BDBDBD] px-2 py-1.5">
                {c}
              </span>
            ))}
          </div>
          {avant.map((r, i) => (
            <div key={r[0]} className="grid grid-cols-[1.1fr_1fr_1.2fr_1.2fr_1.2fr_1.2fr] border-t border-[#BDBDBD]">
              {r.map((c, j) => (
                <span
                  key={`${r[0]}-${j}`}
                  className={`truncate border-r border-[#BDBDBD] px-2 py-2 ${c.includes("?") ? "bg-[#FFF2CC]" : ""} ${c.includes("#N/A") ? "bg-[#F8CBAD] text-[#C00000]" : ""} ${i === 2 && j === 3 ? "text-[#C00000]" : ""}`}
                >
                  {c}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-5 rotate-[-2deg] font-[family-name:var(--font-v5-hand)] text-[26px] leading-tight text-[#C00000]">
          qui a changé la colonne D ??
        </p>
        <p className="mt-4 ml-40 rotate-[1.5deg] font-[family-name:var(--font-v5-hand)] text-[22px] text-[#1B1B1B]/60">
          → relancer la métropole (encore)
        </p>
      </div>

      <div className="pointer-events-none absolute inset-y-0 w-[3px] bg-[#1B1B1B]" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[2.5px] border-[#1B1B1B] bg-[#FFE066] text-[20px] font-black shadow-[3px_3px_0_#1B1B1B]">
          ⇆
        </span>
      </div>
      <label className="sr-only" htmlFor="ba-range">
        Comparer avant et après
      </label>
      <input id="ba-range" type="range" min={4} max={96} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="sr-only" />
    </div>
  );
}
