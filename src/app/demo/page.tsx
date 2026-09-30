import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BetaForm } from "@/components/beta/beta-form";
import { Logo } from "@/components/brand/logo";
import { ChangeTimeline } from "@/components/demo/change-timeline";
import { ParcDemo } from "@/components/demo/parc-demo";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { FACTS, PARIS } from "@/lib/facts";

const sans = Geist({ subsets: ["latin"], variable: "--font-v1" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-v1-mono" });

export const metadata: Metadata = {
  title: "Tapez vos communes, Parnuit fait le reste",
  description:
    "Tarif, collecteur, portail et échéances de taxe de séjour de chaque établissement, calculés depuis les sources officielles. Essayez avec votre parc.",
};

const faq = [
  [
    "Quand la bêta ouvre-t-elle ?",
    "Très prochainement. Les premiers accès sont réservés aux groupes d'au moins cinq établissements, dans l'ordre des demandes.",
  ],
  [
    "D'où viennent les données ?",
    "Du catalogue national des délibérations publié par la DGFiP, des portails et sites officiels des collectivités, et de l'annuaire de l'administration. Chaque information garde sa source et sa date de relevé.",
  ],
  [
    "Parnuit déclare-t-il ou paie-t-il à notre place ?",
    "Non. Parnuit vous dit quoi déclarer, où et quand, et vous prévient à temps. Vos équipes gardent la main sur les déclarations ; le service ne touche jamais aux fonds.",
  ],
  [
    "Et si ma commune n'est pas encore documentée ?",
    "Ses tarifs officiels sont déjà là. Son portail et son calendrier passent en priorité dès qu'un de vos établissements s'y trouve.",
  ],
  ["Combien cela coûtera-t-il ?", "La bêta est gratuite. À l'ouverture : un abonnement annuel par établissement, utilisateurs illimités."],
];

export default function DemoPage() {
  return (
    <main
      className={`${sans.variable} ${mono.variable} min-h-screen overflow-x-clip bg-[#F7F5F0] font-[family-name:var(--font-v1)] text-[#142631] [&_.font-mono]:font-[family-name:var(--font-v1-mono)]`}
    >
      <header className="sticky top-0 z-40 border-b border-[#142631]/8 bg-[#F7F5F0]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-5 sm:px-8">
          <a href="#top" aria-label="Parnuit, haut de page">
            <Logo size={28} />
          </a>
          <nav className="hidden items-center gap-7 text-[13.5px] text-[#142631]/70 md:flex">
            <a href="#essai" className="hover:text-[#142631]">
              La démo
            </a>
            <a href="#changements" className="hover:text-[#142631]">
              Les changements
            </a>
            <a href="#couverture" className="hover:text-[#142631]">
              La couverture
            </a>
            <a href="#faq" className="hover:text-[#142631]">
              Questions
            </a>
          </nav>
          <a
            href="#acces"
            className="ml-auto rounded-full bg-[#142631] px-4 py-2 text-[13px] font-medium text-[#F2E9D9] transition hover:bg-[#1f3a48]"
          >
            Accès bêta
          </a>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(20,38,49,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,38,49,.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(213,119,83,.22),transparent)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 pt-12 pb-9 text-center sm:px-8 sm:pt-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#142631]/10 bg-white/70 px-3.5 py-1.5 text-[12.5px] font-medium text-[#142631]/75">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#D57753]/60" />
                <span className="relative size-2 rounded-full bg-[#D57753]" />
              </span>
              Bêta privée · premiers accès très prochainement
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mx-auto mt-5 max-w-5xl text-[clamp(44px,7vw,88px)] font-semibold leading-[0.95] tracking-[-0.055em]">
              Tapez vos communes.
              <br />
              <span className="text-[#D57753]">Parnuit</span> fait le reste.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-[#142631]/70 sm:text-[18.5px]">
              Le tarif exact, le bon collecteur, le portail de déclaration et le calendrier de chaque établissement, calculés depuis les
              sources officielles. La démo ci-dessous tourne sur les vraies données : essayez avec votre parc.
            </p>
          </Reveal>
          <Reveal delay={0.24} className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#acces"
              className="rounded-full bg-[#142631] px-6 py-3.5 text-[15px] font-medium text-[#F2E9D9] shadow-[0_10px_30px_-10px_rgba(20,38,49,.6)] transition hover:-translate-y-0.5 hover:bg-[#1f3a48]"
            >
              Demander mon accès
            </a>
            <a href="#essai" className="rounded-full px-5 py-3.5 text-[15px] font-medium text-[#142631] hover:bg-[#142631]/5">
              Essayer la démo ↓
            </a>
          </Reveal>
        </div>
        <div id="essai" className="relative mx-auto max-w-7xl scroll-mt-20 px-3 pb-8 sm:px-8">
          <Reveal y={40} delay={0.3}>
            <ParcDemo />
          </Reveal>
          <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-[#142631]/45">
            Catalogue DGFiP des délibérations · Portails des collectivités · Annuaire de l'administration · Atout France
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <h2 className="max-w-4xl text-[clamp(32px,4.6vw,58px)] font-semibold leading-[1.02] tracking-[-0.045em]">
            Ce que vous venez de faire en trente secondes, votre équipe le refait{" "}
            <span className="text-[#142631]/40">chaque mois, à la main.</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            [
              <CountUp key="a" to={FACTS.deliberations} />,
              "grilles tarifaires",
              `Chaque commune ou intercommunalité vote la sienne, puis s'ajoutent jusqu'à trois taxes additionnelles. À Paris, ${PARIS.base4.toFixed(2).replace(".", ",")} € votés deviennent ${PARIS.total4.toFixed(2).replace(".", ",")} € collectés en 4★.`,
            ],
            [
              <CountUp key="b" to={65} suffix=" %" />,
              "collectés par l'intercommunalité",
              "Dans les 500 communes les plus touristiques, deux fois sur trois, ce n'est pas la mairie qui encaisse. Le bon interlocuteur change d'un site à l'autre.",
            ],
            [
              <CountUp key="c" to={FACTS.editeurs} />,
              "éditeurs de portails",
              "Nouveaux Territoires, 3D Ouest, Nexpublica, Aloa, sites des collectivités : autant d'identifiants, de formats et de calendriers.",
            ],
          ].map(([n, label, body], i) => (
            <Reveal key={String(label)} delay={i * 0.1} className="rounded-[22px] border border-[#142631]/8 bg-white p-7">
              <p className="font-mono text-[56px] font-semibold leading-none tracking-[-0.04em] text-[#142631] tabular">{n}</p>
              <p className="mt-2 text-[15px] font-semibold">{label}</p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-[#142631]/65">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="changements" className="border-y border-[#142631]/8 bg-[#EFEBE3]/60">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[#D57753]">Les changements</p>
            <h2 className="mt-3 max-w-4xl text-[clamp(32px,4.6vw,58px)] font-semibold leading-[1.02] tracking-[-0.045em]">
              Quand un tarif change, vous le savez avant votre tableur.
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[#142631]/65">
              {FACTS.changementPct} des communes ont changé de délibération d'un catalogue national à l'autre. Et les nouvelles
              délibérations y arrivent tard : Parnuit les cherche à la source.
            </p>
          </Reveal>
          <div className="mt-14">
            <ChangeTimeline />
          </div>
        </div>
      </section>

      <section id="couverture" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[#D57753]">La couverture</p>
          <h2 className="mt-3 max-w-3xl text-[clamp(32px,4.6vw,58px)] font-semibold leading-[1.02] tracking-[-0.045em]">
            Le terrain est déjà couvert.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-[#142631]/8 bg-[#142631]/8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              <CountUp key="1" to={FACTS.communesCatalogue} />,
              "communes au catalogue national",
              "Leurs tarifs officiels 2026, catégorie par catégorie.",
            ],
            [<CountUp key="2" to={99} suffix=" %" />, "des hébergements classés", "de France se trouvent dans ces communes."],
            [
              <>
                <CountUp key="3" to={FACTS.base500SiteRef} />
                <span className="text-[#142631]/35">/500</span>
              </>,
              "communes les plus touristiques",
              "ont déjà leur portail ou leur page officielle identifiés.",
            ],
            [<CountUp key="4" to={55} suffix=" %" />, "des lits classés", "se trouvent dans ces 500 communes."],
          ].map(([n, a, b]) => (
            <div key={String(a)} className="bg-white p-7">
              <p className="font-mono text-[44px] font-semibold leading-none tracking-[-0.04em] tabular">{n}</p>
              <p className="mt-3 text-[14.5px] font-semibold">{a}</p>
              <p className="mt-1 text-[14px] text-[#142631]/60">{b}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-[12px] leading-relaxed text-[#142631]/45">
          Sources : catalogue DGFiP publié le 10 octobre 2025, hébergements classés Atout France, capacités INSEE, relevés Parnuit au 30
          septembre 2026. Les fiches des 500 communes sont vérifiées une à une avant l'ouverture.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              "01",
              "Importez votre parc",
              "Adresses ou fichier CSV. Chaque établissement est rattaché à sa commune, à son collecteur et à sa catégorie.",
            ],
            [
              "02",
              "Recevez vos fiches",
              "Tarif, portail, contact, moyens de paiement et échéances, avec la source et la date de relevé de chaque information.",
            ],
            [
              "03",
              "Ne ratez plus rien",
              "Calendrier synchronisé avec Google ou Outlook, rappels avant chaque déclaration, même à zéro nuitée, alertes quand un tarif change.",
            ],
          ].map(([n, t, b], i) => (
            <Reveal key={n} delay={i * 0.1} className="group rounded-[22px] bg-[#142631] p-7 text-[#F2E9D9]">
              <p className="font-mono text-[12px] text-[#D57753]">{n}</p>
              <p className="mt-8 text-[22px] font-semibold tracking-[-0.02em]">{t}</p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-[#F2E9D9]/65">{b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="acces" className="scroll-mt-16 px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#142631] px-6 py-16 text-[#F2E9D9] sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -bottom-40 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(213,119,83,.35),transparent)]"
          />
          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-[clamp(34px,5vw,64px)] font-semibold leading-[0.98] tracking-[-0.05em]">Votre parc, prêt pour 2027.</h2>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-[#F2E9D9]/70">
                Les nouveaux tarifs entrent en vigueur le 1er janvier. Rejoignez la bêta privée : nous préparons la fiche de chacun de vos
                établissements.
              </p>
            </div>
            <BetaForm
              version="1-demo"
              withMessage
              slots={{
                form: "rounded-[22px] bg-white/[.06] p-5 ring-1 ring-white/10 sm:p-6",
                grid: "grid gap-3 sm:grid-cols-2",
                field: "flex flex-col gap-1.5",
                label: "text-[12px] text-[#F2E9D9]/60",
                input:
                  "rounded-xl border border-white/10 bg-white/[.07] px-3.5 py-3 text-[14.5px] text-white outline-none placeholder:text-white/30 focus:border-[#D57753] [&>option]:text-black",
                button:
                  "mt-4 w-full rounded-xl bg-[#D57753] px-5 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#c7663f] disabled:opacity-60",
                note: "mt-3 text-center text-[12px] text-[#F2E9D9]/45",
                error: "mt-2 text-[13px] text-[#fca5a5]",
                success: "rounded-[22px] bg-white/[.08] p-6 text-[15px] leading-relaxed text-[#F2E9D9]/80",
              }}
            />
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl scroll-mt-16 px-5 py-24 sm:px-8">
        <h2 className="text-[clamp(28px,3.6vw,44px)] font-semibold tracking-[-0.04em]">Questions fréquentes</h2>
        <div className="mt-8 divide-y divide-[#142631]/10 border-y border-[#142631]/10">
          {faq.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-medium">
                {q}
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[#142631]/15 text-[#142631]/60 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[#142631]/65">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#142631]/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 pb-20 text-[12.5px] text-[#142631]/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <Logo size={22} wordClassName="text-[18px] font-bold leading-none tracking-[-0.06em]" />
            <span>La taxe de séjour, établissement par établissement.</span>
          </div>
          <p className="max-w-md">
            Bêta privée. Informations documentaires issues de sources publiques, sans valeur de conseil fiscal. © 2026 Parnuit
          </p>
        </div>
      </footer>
    </main>
  );
}
