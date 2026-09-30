import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Logo } from "@/components/brand/logo";
import { CalculExperience } from "@/components/calcul/calculator";
import { Strike } from "@/components/calcul/strike";
import { Reveal } from "@/components/motion/reveal";

const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-v3-display" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-v3-mono" });

export const metadata: Metadata = {
  title: "Combien vous coûte vraiment la taxe de séjour ?",
  description:
    "Calculez le temps et le risque que représente la gestion à la main de la taxe de séjour de votre parc. Parnuit : à partir de 9 € par établissement et par mois.",
};

const ticker = [
  "Paris 4★ : 2,60 € votés, 8,45 € collectés",
  "Nice : c'est la Métropole qui collecte",
  "Carcassonne 2027 : +5,8 % en résidence 4★",
  "30 % des communes ont changé de délibération en un an",
  "455 portails de déclaration identifiés",
  "273 des 500 communes les plus touristiques : déclaration mensuelle",
  "Carcassonne : reversement mensuel depuis le 1er octobre 2026",
  "32 310 communes au catalogue national",
];

const pains = [
  ["30 %", "des communes ont changé de délibération entre deux catalogues nationaux."],
  ["12", "déclarations par an et par site dans 273 des 500 communes les plus touristiques."],
  ["65 %", "de ces communes ne collectent pas elles-mêmes : c'est l'intercommunalité."],
  ["2 500 €", "d'amende possible en cas de non-paiement, selon le portail de l'agglomération de Vannes."],
];

const swaps = [
  ["Chercher les délibérations sur quatorze sites", "Une alerte avec la pièce officielle"],
  ["Recalculer les taxes additionnelles à la main", "Le tarif total, par catégorie"],
  ["Tenir les dates dans un tableur", "Un calendrier synchronisé et des rappels"],
  ["Retrouver le bon portail et ses identifiants", "Portail et collecteur dans chaque fiche"],
  ["Découvrir un changement trop tard", "Une alerte dès la publication"],
];

export default function CalculPage() {
  return (
    <main
      className={`${display.variable} ${mono.variable} min-h-screen overflow-x-clip bg-white font-[family-name:var(--font-v3-display)] text-black selection:bg-[#FFE500]`}
    >
      <div className="overflow-hidden border-b-2 border-black bg-black py-2.5 text-[#FFE500]">
        <div className="marquee flex w-max gap-10 whitespace-nowrap text-[12.5px] font-bold uppercase tracking-[0.06em]">
          {[...ticker, ...ticker].map((t, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: ruban dupliqué
            <span key={i} className="flex items-center gap-10">
              {t} <span aria-hidden="true">■</span>
            </span>
          ))}
        </div>
      </div>
      <header className="border-b-2 border-black">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <Logo
            size={28}
            bg="#000"
            fg="#FFE500"
            dot="#FFE500"
            word="#000"
            dotColor="#000"
            wordClassName="text-[23px] font-black leading-none tracking-[-0.05em]"
          />
          <a
            href="#acces"
            className="border-2 border-black bg-[#FFE500] px-4 py-2 text-[13px] font-black uppercase tracking-[0.04em] transition hover:bg-black hover:text-[#FFE500]"
          >
            Accès bêta gratuit
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 pt-12 pb-10 sm:px-8 sm:pt-16">
        <Reveal>
          <h1 className="text-[clamp(44px,8.2vw,132px)] leading-[0.86] font-black uppercase tracking-[-0.02em] [font-stretch:125%]">
            Combien vous coûte <span className="bg-[#FFE500] px-2 [box-decoration-break:clone]">vraiment</span> la taxe de séjour ?
          </h1>
        </Reveal>
        <div className="mt-8 grid gap-6 border-t-2 border-black pt-6 md:grid-cols-[1fr_1fr]">
          <p className="max-w-xl text-[19px] leading-snug font-medium">
            Pas la taxe elle-même : le temps pour la suivre, la déclarer et la reverser, site par site, commune par commune. Réglez les
            curseurs sur votre parc.
          </p>
          <p className="text-[13px] leading-relaxed font-semibold uppercase tracking-[0.04em] text-black/60 md:text-right">
            Calcul fondé sur les calendriers réels
            <br />
            des 500 communes les plus touristiques
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <CalculExperience />
      </div>

      <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:mt-32 sm:px-8">
        <h2 className="text-[clamp(34px,5vw,72px)] leading-[0.9] font-black uppercase [font-stretch:125%]">Les chiffres qui font mal.</h2>
        <div className="mt-10 grid border-2 border-black sm:grid-cols-2 lg:grid-cols-4">
          {pains.map(([n, t], i) => (
            <Reveal
              key={n}
              delay={i * 0.08}
              className={`border-black p-6 sm:p-7 ${i % 2 === 1 ? "bg-[#FFE500]" : ""} ${i < 3 ? "border-b-2 lg:border-r-2 lg:border-b-0" : ""} ${i === 1 ? "sm:border-r-0 lg:border-r-2" : ""} ${i === 0 ? "sm:border-r-2" : ""} ${i === 2 ? "sm:border-r-2 sm:border-b-0" : ""}`}
            >
              <p className="text-[clamp(52px,6vw,88px)] leading-none font-black [font-stretch:125%]">{n}</p>
              <p className="mt-4 text-[15px] leading-snug font-semibold">{t}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:mt-32 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-[clamp(34px,5vw,72px)] leading-[0.9] font-black uppercase [font-stretch:125%]">
            Ce qui <span className="bg-black px-2 text-[#FFE500]">disparaît</span> de votre mois.
          </h2>
          <ul className="border-t-2 border-black">
            {swaps.map(([a, b], i) => (
              <li key={a} className="grid gap-2 border-b-2 border-black py-5 sm:grid-cols-2 sm:gap-6">
                <Strike delay={i * 0.12}>{a}</Strike>
                <span className="text-[18px] font-bold">→ {b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:mt-32 sm:px-8">
        <div className="grid border-2 border-black lg:grid-cols-3">
          <div className="border-b-2 border-black bg-[#FFE500] p-7 lg:border-r-2 lg:border-b-0">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em]">À l'ouverture</p>
            <p className="mt-4 text-[96px] leading-[0.8] font-black [font-stretch:125%]">9 €</p>
            <p className="mt-3 text-[15px] font-bold uppercase">par établissement et par mois</p>
          </div>
          <div className="border-b-2 border-black p-7 lg:border-r-2 lg:border-b-0">
            <p className="text-[24px] leading-tight font-black uppercase [font-stretch:115%]">Tout compris</p>
            <p className="mt-3 text-[15px] leading-relaxed">
              Fiches complètes, calendrier synchronisable, rappels avant chaque échéance, alertes de changement, utilisateurs illimités.
            </p>
          </div>
          <div className="p-7">
            <p className="text-[24px] leading-tight font-black uppercase [font-stretch:115%]">Dégressif</p>
            <p className="mt-3 text-[15px] leading-relaxed">
              −15 % dès 10 établissements, −25 % dès 50. Et la bêta est gratuite : aucun paiement avant l'ouverture.
            </p>
          </div>
        </div>
        <a
          href="#acces"
          className="group flex items-center justify-between border-x-2 border-b-2 border-black bg-black px-7 py-6 text-[clamp(22px,3vw,40px)] font-black uppercase text-[#FFE500] [font-stretch:125%]"
        >
          Je réserve mon accès bêta
          <span className="transition group-hover:translate-x-2">→</span>
        </a>
      </section>

      <footer className="mx-auto mt-24 max-w-[1400px] border-t-2 border-black px-5 pt-8 pb-24 sm:px-8">
        <div className="flex flex-col gap-4 text-[12px] font-semibold uppercase tracking-[0.04em] text-black/55 sm:flex-row sm:justify-between">
          <span>© 2026 Parnuit · La taxe de séjour, établissement par établissement</span>
          <span className="max-w-xl normal-case tracking-normal">
            Estimation indicative fondée sur les hypothèses affichées. Sources : portails des collectivités, catalogue DGFiP, relevés
            Parnuit au 30 septembre 2026. Sans valeur de conseil fiscal.
          </span>
        </div>
      </footer>
    </main>
  );
}
