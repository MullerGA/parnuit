import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { versions } from "@/lib/versions";

const sans = Geist({ subsets: ["latin"], variable: "--font-hub" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-hub-mono" });

export const metadata: Metadata = {
  title: "Six pages produit",
  description: "Six angles de vente pour la page produit de Parnuit, construits sur les vraies données de taxe de séjour.",
};

const facts = [
  ["32 310 communes au catalogue national", "Catalogue DGFiP des délibérations publié le 10 octobre 2025 (tarifs 2026)."],
  [
    "99 % des hébergements classés couverts",
    "20 350 des 20 557 hôtels, résidences, campings et villages classés Atout France sont dans une commune du catalogue.",
  ],
  [
    "488 portails ou pages officielles sur 500",
    "Base de travail des 500 communes prioritaires au 30 septembre 2026 ; 455 portails de déclaration.",
  ],
  ["55 % des lits classés dans ces 500 communes", "Capacité Atout France des quatre types d'hébergement."],
  ["65 % collectés par l'intercommunalité", "324 des 500 communes : le collecteur n'est pas la commune."],
  ["30 % des communes changent de délibération", "9 688 communes sur 31 989 entre les catalogues d'octobre 2024 et d'octobre 2025."],
  [
    "Paris 4★ : 2,60 € votés, 8,45 € collectés",
    "Open Data DELTA 2026 ; formule des taxes additionnelles vérifiée sur 3 225 tarifs officiels.",
  ],
  ["Carcassonne 2027 : 3,08 € → 3,26 €", "Délibération du 28 mai 2026 publiée le 8 juin, absente des fichiers DGFiP au 29 septembre."],
  [
    "9,4 déclarations et 4,1 reversements par an",
    "Moyenne des rythmes relevés sur les portails des 500 communes (calculateur de la version 3).",
  ],
];

const decide = [
  "La version 6 est publiée sur parnuit.vercel.app : c'est le lien à envoyer. Les autres versions restent ici pour comparaison.",
  "Les demandes de la version 6 sont enregistrées dans un stockage privé à Paris et consultables sur /demandes (mot de passe). L'alerte par email s'activera avec une clé Resend valide.",
  "Le diagnostic 2027 offert engage à renvoyer, pour chaque établissement, tarif, collecteur, portail et calendrier : la base de travail le permet, à préparer à la main pour les premiers groupes.",
  "Les prix (9 € et 15 € par établissement et par mois, −15 % dès 10, −25 % dès 50), la gratuité de la bêta et l'éditeur du site (mentions légales) restent à confirmer.",
];

export default function Home() {
  return (
    <main className={`${sans.variable} ${mono.variable} min-h-screen bg-[#F4F2EE] font-[family-name:var(--font-hub)] text-[#142631]`}>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Logo size={28} />
        <span className="font-[family-name:var(--font-hub-mono)] text-[11.5px] uppercase tracking-[0.14em] text-[#142631]/50">
          Studio · 1er octobre 2026
        </span>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-10 pb-14 sm:px-8 sm:pt-16">
        <p className="font-[family-name:var(--font-hub-mono)] text-[12px] uppercase tracking-[0.16em] text-[#D57753]">
          Récapitulatif · 6 versions
        </p>
        <h1 className="mt-4 max-w-4xl text-[clamp(40px,6vw,80px)] font-semibold leading-[0.98] tracking-[-0.05em]">
          Six pages produit pour vendre Parnuit.
        </h1>
        <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-[#142631]/70">
          La version 6 reprend le meilleur des cinq premières et peut être envoyée aux groupes dès maintenant. Toutes reposent sur les
          vraies données de la base : les tarifs officiels de 32 310 communes et les 500 communes les plus touristiques documentées. Le nom
          et le logo sont conservés.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 sm:px-8 lg:grid-cols-2">
        {versions.map((v, i) => (
          <Link
            key={v.slug}
            href={`/${v.slug}`}
            className={`group flex flex-col overflow-hidden rounded-[26px] border border-[#142631]/10 bg-white transition hover:-translate-y-1 hover:shadow-[0_40px_80px_-40px_rgba(20,38,49,.45)] ${i === 0 ? "lg:col-span-2 lg:grid lg:grid-cols-[1.3fr_1fr]" : ""}`}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#142631]/5">
              <Image
                src={`/recap/${v.slug}.jpg`}
                alt={`Aperçu de la version ${v.n} : ${v.name}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                priority={i < 2}
              />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-[family-name:var(--font-hub-mono)] text-[12px] uppercase tracking-[0.14em] text-[#D57753]">
                  Version {v.n}
                </p>
                <p className="font-[family-name:var(--font-hub-mono)] text-[11.5px] text-[#142631]/45">/{v.slug}</p>
              </div>
              <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.03em]">{v.name}</h2>
              <p className="mt-1 text-[16px] italic text-[#142631]/60">« {v.pitch} »</p>
              <p className="mt-4 text-[15px] leading-relaxed text-[#142631]/80">{v.angle}</p>
              <dl className="mt-5 grid gap-3 border-t border-[#142631]/10 pt-5 text-[13.5px]">
                {[
                  ["Levier", v.lever],
                  ["Style", v.style],
                  ["Animations", v.motion],
                  ["Pour", v.audience],
                ].map(([k, val]) => (
                  <div key={k} className="grid grid-cols-[92px_1fr] gap-3">
                    <dt className="font-[family-name:var(--font-hub-mono)] text-[11px] uppercase tracking-[0.1em] text-[#142631]/45">
                      {k}
                    </dt>
                    <dd className="text-[#142631]/75">{val}</dd>
                  </div>
                ))}
              </dl>
              {v.n === 6 && (
                <span className="mt-5 self-start rounded-full bg-[#D57753]/12 px-3 py-1 text-[12.5px] font-semibold text-[#B4532F]">
                  Recommandée · à envoyer aux groupes
                </span>
              )}
              <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-[#142631] px-4 py-2.5 text-[14px] font-medium text-[#F2E9D9] transition group-hover:bg-[#D57753]">
                Ouvrir la version {v.n} <span className="transition group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="border-t border-[#142631]/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-[34px] font-semibold leading-tight tracking-[-0.03em]">Des arguments forts, tous vérifiables.</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[#142631]/65">
              Chaque chiffre des cinq pages vient de la base de travail ou des sources publiques, recalculé par le script de données du
              projet. Aucun client, témoignage ou taux de couverture n'est inventé.
            </p>
          </div>
          <dl className="divide-y divide-[#142631]/10 border-y border-[#142631]/10">
            {facts.map(([a, b]) => (
              <div key={a} className="grid gap-1 py-3.5 sm:grid-cols-[1fr_1.3fr] sm:gap-6">
                <dt className="text-[14.5px] font-semibold">{a}</dt>
                <dd className="text-[13.5px] leading-relaxed text-[#142631]/60">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <h2 className="text-[34px] font-semibold tracking-[-0.03em]">À trancher avant la mise en ligne</h2>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {decide.map((d) => (
            <li key={d} className="rounded-2xl border border-[#142631]/10 bg-white p-5 text-[14.5px] leading-relaxed text-[#142631]/75">
              {d}
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-[#142631]/10 px-5 py-8 text-center text-[12.5px] text-[#142631]/45 sm:px-8">
        Parnuit · studio de pages produit · non indexé
      </footer>
    </main>
  );
}
