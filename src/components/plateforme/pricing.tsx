"use client";

import { animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

const PLANS = [
  {
    k: "essentiel",
    name: "Essentiel",
    price: 9,
    pitch: "Tout pour ne plus rien rater.",
    features: [
      "Fiches complètes par établissement",
      "Calendrier synchronisable",
      "Rappels avant chaque échéance",
      "Alertes de changement",
      "Utilisateurs illimités",
    ],
  },
  {
    k: "groupe",
    name: "Groupe",
    price: 15,
    pitch: "Pour piloter depuis le siège.",
    features: ["Tout Essentiel", "Tour de contrôle du parc", "Rôles siège et établissements", "Justificatifs et exports"],
    best: true,
  },
  {
    k: "reseau",
    name: "Réseau",
    price: null,
    pitch: "Pour les grands réseaux et l'API.",
    features: ["Tout Groupe", "Accès API au référentiel", "Conditions adaptées aux grands parcs"],
  },
];

const remise = (n: number) => (n >= 50 ? 0.75 : n >= 10 ? 0.85 : 1);
const nf = (x: number) => Math.round(x).toLocaleString("fr-FR");

function Num({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const c = animate(prev.current, value, {
      duration: 0.5,
      onUpdate: (v) => {
        el.textContent = nf(v);
      },
    });
    prev.current = value;
    return () => c.stop();
  }, [value]);
  return <span ref={ref}>{nf(value)}</span>;
}

export function Pricing() {
  const [n, setN] = useState(30);
  const r = remise(n);
  return (
    <div>
      <div className="mx-auto max-w-xl rounded-2xl border border-[#0F1222]/8 bg-white p-5">
        <label className="flex items-center justify-between text-[14px] font-semibold text-[#0F1222]" htmlFor="v4-n">
          Nombre d'établissements
          <span className="rounded-lg bg-[#0F1222] px-2.5 py-1 font-[family-name:var(--font-v4-mono)] text-[14px] text-white">{n}</span>
        </label>
        <input
          id="v4-n"
          type="range"
          min={1}
          max={200}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="mt-4 w-full accent-[#5B5BF7]"
        />
        <p className="mt-2 text-[12.5px] text-[#0F1222]/55">
          {r < 1 ? `Remise de ${Math.round((1 - r) * 100)} % appliquée` : "Remise de 15 % dès 10 établissements, 25 % dès 50"}
        </p>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.k}
            className={`relative flex flex-col rounded-[24px] p-7 ${p.best ? "bg-[#0F1222] text-white shadow-[0_40px_80px_-30px_rgba(91,91,247,.55)]" : "border border-[#0F1222]/8 bg-white text-[#0F1222]"}`}
          >
            {p.best && (
              <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-[#5B5BF7] to-[#FF7A59] px-3 py-1 text-[11.5px] font-semibold text-white">
                Recommandé pour les groupes
              </span>
            )}
            <p className="text-[15px] font-bold">{p.name}</p>
            <p className={`mt-1 text-[13.5px] ${p.best ? "text-white/60" : "text-[#0F1222]/55"}`}>{p.pitch}</p>
            {p.price ? (
              <>
                <p className="mt-6">
                  <span className="block whitespace-nowrap text-[48px] font-bold leading-none tracking-[-0.04em]">
                    {(p.price * r).toFixed(2).replace(".", ",").replace(",00", "")} €
                  </span>
                  <span className={`mt-1 block text-[13.5px] ${p.best ? "text-white/55" : "text-[#0F1222]/50"}`}>
                    par établissement et par mois
                  </span>
                </p>
                <p className={`mt-1 text-[13px] ${p.best ? "text-white/60" : "text-[#0F1222]/55"}`}>
                  Soit{" "}
                  <strong className={p.best ? "text-white" : "text-[#0F1222]"}>
                    <Num value={Math.max(290, p.price * r * n * 12)} /> €
                  </strong>{" "}
                  par an pour {n} établissement{n > 1 ? "s" : ""}
                </p>
              </>
            ) : (
              <p className="mt-6 text-[40px] font-bold tracking-[-0.04em]">Sur devis</p>
            )}
            <ul className="mt-6 space-y-2.5 text-[14px]">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <span className={p.best ? "text-[#FF9C80]" : "text-[#5B5BF7]"}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#acces"
              className={`mt-8 rounded-xl px-4 py-3 text-center text-[14px] font-semibold transition ${p.best ? "bg-white text-[#0F1222] hover:bg-white/90" : "bg-[#F1F1F8] text-[#0F1222] hover:bg-[#E6E6F2]"}`}
            >
              {p.price ? "Essayer gratuitement pendant la bêta" : "Nous contacter"}
            </a>
          </div>
        ))}
      </div>
      <p className="mt-5 text-center text-[13px] text-[#0F1222]/50">
        Prix hors taxes, engagement annuel, utilisateurs illimités. La bêta est gratuite.
      </p>
    </div>
  );
}
