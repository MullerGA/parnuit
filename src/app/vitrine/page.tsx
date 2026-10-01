import type { Metadata } from "next";
import { Caveat, DM_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Logo } from "@/components/brand/logo";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { Announcement } from "@/components/v6/announcement";
import { BeforeAfter } from "@/components/v6/before-after";
import { Bento } from "@/components/v6/bento";
import { Calculator } from "@/components/v6/calculator";
import { Dashboard } from "@/components/v6/dashboard";
import { DiagnosticForm } from "@/components/v6/diagnostic-form";
import { HeroTicket } from "@/components/v6/hero-ticket";
import { Lookup } from "@/components/v6/lookup";
import { Pricing } from "@/components/v6/pricing";
import { CONTACT, isVitrine, SITE_URL } from "@/lib/site";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-v6" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-v6-mono" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-v6-hand" });

const TITLE = "Parnuit — La taxe de séjour vous coûte plus cher que la taxe";
const DESCRIPTION =
  "Tarifs, collecteurs, portails et échéances de taxe de séjour pour chaque établissement de votre parc, depuis les sources officielles. Diagnostic 2027 offert pour les groupes d'hébergement.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: isVitrine ? "/" : "/vitrine" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: isVitrine ? SITE_URL : `${SITE_URL}/vitrine`,
    siteName: "Parnuit",
    title: "La taxe de séjour vous coûte plus cher que la taxe.",
    description: "Diagnostic 2027 offert : tarifs, collecteurs, portails et échéances de chaque établissement de votre parc.",
    images: [{ url: "/og-parnuit.png", width: 1200, height: 630, alt: "Parnuit — La taxe de séjour de tout votre parc" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-parnuit.png"] },
};

const COSTS = [
  {
    k: "Le temps",
    n: <CountUp to={13.5} decimals={1} />,
    u: "échéances par établissement et par an",
    b: "9,4 déclarations et 4,1 reversements en moyenne dans les 500 communes les plus touristiques, sur 455 portails tenus par cinq éditeurs différents.",
  },
  {
    k: "Les écarts",
    n: (
      <>
        ×<CountUp to={3.25} decimals={2} />
      </>
    ),
    u: "entre le tarif voté et le tarif collecté",
    b: "À Paris, un hôtel 4★ : 2,60 € votés, 8,45 € collectés, avec trois taxes additionnelles. Un tarif mal paramétré se paie sur votre marge.",
  },
  {
    k: "Les changements",
    n: <CountUp to={30} suffix={"\u00a0%"} />,
    u: "des communes changent de délibération d'un catalogue à l'autre",
    b: "Et le catalogue national arrive tard : les tarifs 2027 de Carcassonne, votés le 28 mai, n'y figuraient toujours pas le 29 septembre.",
  },
  {
    k: "Les sanctions",
    n: <CountUp to={2500} suffix={"\u00a0€"} />,
    u: "d'amende possible en cas de non-paiement",
    b: "Et une taxation d'office en cas de retard, selon le portail de l'agglomération de Vannes. Même une déclaration à zéro nuitée compte.",
  },
];

const COMPARE = [
  ["Tarif total par catégorie, taxes additionnelles comprises", "À recalculer", "Selon la personne", "Automatique"],
  ["Collecteur réel de chaque établissement", "À chercher", "Souvent", "Oui"],
  ["Portail, moyens de paiement, contact", "Dispersés", "Dans les mails", "Dans chaque fiche"],
  ["Calendrier consolidé du parc", "À tenir", "Non", "Synchronisé"],
  ["Rappels avant échéance, même à zéro nuitée", "Non", "Non", "Oui"],
  ["Alerte quand un tarif change", "Non", "Au hasard", "Dès la publication"],
  ["Source et date de chaque information", "Rarement", "Non", "Toujours"],
];

const FAQ = [
  [
    "Que contient le diagnostic 2027 ?",
    "Pour chaque établissement : le tarif 2026 applicable, taxes additionnelles comprises, et la délibération qui le fixe ; les tarifs 2027 déjà votés ou publiés ; le collecteur réel, son portail et ses moyens de paiement ; le rythme de déclaration et de reversement de la collectivité.",
  ],
  [
    "Que faut-il vous envoyer ?",
    "La liste de vos établissements avec leur commune et leur catégorie : un export de votre logiciel ou un simple tableau suffit. À défaut, la liste des communes où vous êtes présents.",
  ],
  [
    "Quand la bêta ouvre-t-elle ?",
    "Très prochainement. Les groupes qui demandent leur diagnostic ont un accès prioritaire, et la bêta est gratuite.",
  ],
  [
    "D'où viennent les données ?",
    "Du catalogue national des délibérations publié par la DGFiP, des portails et sites officiels des collectivités et de l'annuaire de l'administration. Chaque information garde son document et sa date de relevé.",
  ],
  [
    "Parnuit déclare-t-il ou paie-t-il à notre place ?",
    "Non. Parnuit vous dit quoi déclarer, où et quand, et vous prévient. Vos équipes déclarent sur le portail de la collectivité ; le service ne touche jamais aux fonds.",
  ],
  [
    "Combien coûtera Parnuit ?",
    "La bêta est gratuite. À l'ouverture : à partir de 9 € par établissement et par mois, utilisateurs illimités, avec une remise dès 10 établissements.",
  ],
  [
    "Que deviennent nos informations ?",
    "Elles servent uniquement à préparer votre diagnostic et à vous recontacter. Elles sont stockées dans l'Union européenne et ne sont jamais revendues.",
  ],
];

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#E2694A]">{children}</p>;
}
function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`mt-3 text-[clamp(32px,4.4vw,56px)] font-extrabold leading-[1.02] tracking-[-0.04em] ${className}`}>{children}</h2>;
}

export default function VitrinePage() {
  return (
    <main
      className={`${sans.variable} ${mono.variable} ${hand.variable} min-h-screen overflow-x-clip bg-[#FAF8F4] font-[family-name:var(--font-v6)] text-[#10202B]`}
    >
      <Announcement />
      <header className="sticky top-0 z-40 border-b border-[#10202B]/6 bg-[#FAF8F4]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-5 sm:px-8">
          <a href="#top" aria-label="Parnuit, haut de page">
            <Logo size={28} bg="#10202B" dot="#E2694A" word="#10202B" dotColor="#E2694A" />
          </a>
          <nav className="hidden items-center gap-6 text-[14px] font-medium text-[#10202B]/65 lg:flex">
            <a href="#cout" className="hover:text-[#10202B]">
              Le coût caché
            </a>
            <a href="#plateforme" className="hover:text-[#10202B]">
              La plateforme
            </a>
            <a href="#communes" className="hover:text-[#10202B]">
              Vos communes
            </a>
            <a href="#tarifs" className="hover:text-[#10202B]">
              Tarifs
            </a>
            <a href="#faq" className="hover:text-[#10202B]">
              Questions
            </a>
          </nav>
          <a
            href="#diagnostic"
            className="ml-auto rounded-xl bg-[#10202B] px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(16,32,43,.6)] transition hover:bg-[#1c3442]"
          >
            <span className="sm:hidden">Diagnostic offert</span>
            <span className="hidden sm:inline">Recevoir mon diagnostic 2027</span>
          </a>
        </div>
      </header>

      <section id="top" className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[760px] overflow-hidden">
          <div className="aurora absolute -top-24 left-[4%] size-[520px] rounded-full bg-[#F4A27C]/35 blur-[100px]" />
          <div className="aurora absolute top-20 right-[4%] size-[480px] rounded-full bg-[#C8456F]/18 blur-[100px] [animation-delay:-7s]" />
          <div className="aurora absolute top-80 left-[40%] size-[420px] rounded-full bg-[#F2C27A]/30 blur-[100px] [animation-delay:-12s]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 pt-14 pb-20 sm:px-8 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#10202B]/10 bg-white/70 py-1 pr-3 pl-1 text-[13px] font-medium text-[#10202B]/75 backdrop-blur">
                <span className="rounded-full bg-[#10202B] px-2 py-0.5 text-[11.5px] font-semibold text-white">Bêta</span>
                Ouverture très prochainement
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-6 text-[clamp(44px,6.4vw,84px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
                La taxe de séjour vous coûte{" "}
                <span className="bg-gradient-to-r from-[#E2694A] to-[#C8456F] bg-clip-text text-transparent">plus cher que la taxe.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-[#10202B]/68">
                Des déclarations sur des dizaines de portails, des tarifs qui changent chaque année, des taxes additionnelles à recalculer,
                et chaque écart payé sur votre marge. Parnuit réunit tout, établissement par établissement, depuis les sources officielles.
              </p>
            </Reveal>
            <Reveal delay={0.18} className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#diagnostic"
                className="rounded-xl bg-gradient-to-r from-[#E2694A] to-[#C8456F] px-6 py-4 text-[15.5px] font-bold text-white shadow-[0_16px_34px_-14px_rgba(200,69,111,.85)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Recevoir mon diagnostic 2027
              </a>
              <a
                href="#calcul"
                className="rounded-xl border border-[#10202B]/12 bg-white/70 px-6 py-4 text-[15.5px] font-semibold text-[#10202B] backdrop-blur transition hover:bg-white"
              >
                Calculer mon coût caché
              </a>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="mt-5 text-[13.5px] text-[#10202B]/55">
                Offert et sans engagement · Hôtels, résidences de tourisme, campings, villages de vacances
              </p>
            </Reveal>
          </div>
          <HeroTicket />
        </div>
        <div className="relative mx-auto max-w-7xl border-t border-[#10202B]/8 px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[14px] font-bold text-[#10202B]/40">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#10202B]/40">
              Construit sur les sources officielles
            </span>
            <span>DGFiP</span>
            <span>Atout France</span>
            <span>INSEE</span>
            <span>Annuaire de l'administration</span>
            <span>Portails des collectivités</span>
          </div>
        </div>
      </section>

      <section id="cout" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <Kicker>Le coût caché</Kicker>
          <H2>Quatre coûts qui n'apparaissent dans aucun budget.</H2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {COSTS.map((c, i) => (
            <Reveal key={c.k} delay={i * 0.08} className="flex flex-col rounded-[24px] border border-[#10202B]/8 bg-white p-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#10202B]/45">{c.k}</p>
              <p className="mt-5 text-[46px] font-extrabold leading-none tracking-[-0.04em] text-[#10202B]">{c.n}</p>
              <p className="mt-2 text-[14.5px] font-semibold leading-snug">{c.u}</p>
              <p className="mt-4 text-[14px] leading-relaxed text-[#10202B]/60">{c.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="calcul" className="scroll-mt-20 bg-gradient-to-b from-[#F4EDE4] to-[#FAF8F4] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-3xl">
            <Kicker>Votre parc</Kicker>
            <H2>Combien vous coûte la taxe de séjour de votre parc ?</H2>
            <p className="mt-4 text-[17px] leading-relaxed text-[#10202B]/60">
              Réglez les curseurs. Les rythmes de déclaration sont ceux, réels, des communes les plus touristiques.
            </p>
          </Reveal>
          <div className="mt-12">
            <Calculator />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <Reveal className="max-w-3xl">
            <Kicker>Avant, après</Kicker>
            <H2>Du tableur que personne n'ose toucher à une vue claire.</H2>
          </Reveal>
          <p className="rotate-[-3deg] font-[family-name:var(--font-v6-hand)] text-[30px] leading-none text-[#C8456F]">
            glissez la poignée ⇆
          </p>
        </div>
        <div className="mt-12">
          <BeforeAfter />
        </div>
      </section>

      <section id="plateforme" className="relative scroll-mt-20 overflow-hidden bg-[#10202B] py-24 text-white sm:py-28">
        <div
          aria-hidden="true"
          className="aurora pointer-events-none absolute -top-40 right-0 size-[600px] rounded-full bg-[#E2694A]/20 blur-[120px]"
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-3xl">
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#F4A27C]">La plateforme</p>
            <H2>Le poste de pilotage de tout votre parc.</H2>
            <p className="mt-4 text-[17px] leading-relaxed text-white/60">
              Chaque établissement rattaché à son collecteur, son tarif et son calendrier. Une vue pour le siège, des rappels pour les
              équipes.
            </p>
          </Reveal>
          <div className="mt-14">
            <Dashboard />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <Kicker>Fonctions</Kicker>
          <H2>Tout ce que votre tableur ne fait pas.</H2>
        </Reveal>
        <div className="mt-12">
          <Bento />
        </div>
      </section>

      <section id="communes" className="scroll-mt-20 bg-gradient-to-b from-[#F4EDE4] to-[#FAF8F4] py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="max-w-3xl">
            <Kicker>Vos communes</Kicker>
            <H2>Vérifiez avec une de vos communes.</H2>
            <p className="mt-4 text-[17px] leading-relaxed text-[#10202B]/60">
              Ce sont les données qui alimentent Parnuit : les tarifs officiels de toutes les communes, le collecteur, le portail et le
              calendrier des plus touristiques.
            </p>
          </Reveal>
          <div className="mt-10">
            <Lookup />
          </div>
          <div className="mt-6 grid gap-px overflow-hidden rounded-[24px] bg-[#10202B]/8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [<CountUp key="a" to={32310} />, "communes au catalogue national, avec leurs tarifs officiels"],
              [<CountUp key="b" to={99} suffix={"\u00a0%"} />, "des hébergements classés de France se trouvent dans ces communes"],
              [
                <span key="c">
                  <CountUp to={488} />
                  <span className="text-[#10202B]/30">/500</span>
                </span>,
                "communes les plus touristiques : portail ou page officielle identifiés",
              ],
              [<CountUp key="d" to={55} suffix={"\u00a0%"} />, "des lits classés se trouvent dans ces 500 communes"],
            ].map(([n, t]) => (
              <div key={String(t)} className="bg-white p-6">
                <p className="text-[38px] font-extrabold tracking-[-0.04em]">{n}</p>
                <p className="mt-1 text-[13.5px] leading-snug text-[#10202B]/60">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="comparatif" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="text-center">
          <Kicker>Comparatif</Kicker>
          <H2>Ce qui change, ligne par ligne.</H2>
        </Reveal>
        <div className="mt-12 overflow-x-auto rounded-[24px] border border-[#10202B]/8 bg-white">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#10202B]/8 text-[13px] text-[#10202B]/50">
                <th className="p-4 font-semibold sm:p-5">
                  <span className="sr-only">Critère</span>
                </th>
                <th className="p-4 font-semibold sm:p-5">Tableur interne</th>
                <th className="p-4 font-semibold sm:p-5">Veille manuelle</th>
                <th className="bg-[#FBF1EA] p-4 font-bold text-[#10202B] sm:p-5">Parnuit</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([a, b, c, d]) => (
                <tr key={a} className="border-b border-[#10202B]/6 last:border-b-0">
                  <td className="p-4 font-semibold sm:p-5">{a}</td>
                  <td className="p-4 text-[#10202B]/50 sm:p-5">{b}</td>
                  <td className="p-4 text-[#10202B]/50 sm:p-5">{c}</td>
                  <td className="bg-[#FBF1EA] p-4 font-semibold text-[#C2502F] sm:p-5">✓ {d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="tarifs" className="scroll-mt-20 bg-gradient-to-b from-[#FBF1EA] to-[#FAF8F4] py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center">
            <Kicker>Tarifs</Kicker>
            <H2>Moins cher que le temps qu'il vous rend.</H2>
            <p className="mx-auto mt-4 max-w-xl text-[17px] text-[#10202B]/60">
              Un prix par établissement, des utilisateurs illimités. Et la bêta est gratuite.
            </p>
          </Reveal>
          <div className="mt-12">
            <Pricing />
          </div>
        </div>
      </section>

      <section id="diagnostic" className="scroll-mt-16 px-3 py-3 sm:px-5 sm:py-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#10202B] px-6 py-16 text-white sm:px-14 sm:py-20">
          <div aria-hidden="true" className="aurora absolute -top-40 -left-20 size-[520px] rounded-full bg-[#E2694A]/30 blur-[110px]" />
          <div
            aria-hidden="true"
            className="aurora absolute -right-20 -bottom-40 size-[520px] rounded-full bg-[#C8456F]/30 blur-[110px] [animation-delay:-8s]"
          />
          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#F4A27C]">Offert</p>
              <h2 className="mt-3 text-[clamp(36px,5vw,64px)] font-extrabold leading-[1] tracking-[-0.045em]">Votre diagnostic 2027.</h2>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-white/65">
                Envoyez-nous la liste de vos établissements. Nous vous renvoyons, pour chacun :
              </p>
              <ul className="mt-6 space-y-3 text-[15.5px] text-white/85">
                {[
                  "le tarif 2026 applicable, taxes additionnelles comprises, et la délibération qui le fixe ;",
                  "les tarifs 2027 déjà votés ou publiés, et ce qu'il faut changer avant le 1er janvier ;",
                  "le vrai collecteur, son portail et ses moyens de paiement ;",
                  "le rythme de déclaration et de reversement de la collectivité.",
                ].map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#E2694A] text-[11px] font-bold">
                      ✓
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-md text-[15px] text-white/60">Et votre accès prioritaire à la bêta de Parnuit, gratuite.</p>
              <p className="mt-8 rotate-[-2deg] font-[family-name:var(--font-v6-hand)] text-[28px] leading-none text-[#F4A27C]">
                un tableau suffit, on s'occupe du reste →
              </p>
            </div>
            <DiagnosticForm />
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-24 sm:px-8">
        <h2 className="text-center text-[clamp(30px,3.8vw,46px)] font-extrabold tracking-[-0.04em]">Questions fréquentes</h2>
        <div className="mt-10 space-y-3">
          {FAQ.map(([q, a]) => (
            <details
              key={q}
              className="group rounded-2xl border border-[#10202B]/8 bg-white px-5 py-4 open:shadow-[0_20px_40px_-30px_rgba(16,32,43,.4)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold">
                {q}
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#F3ECE4] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-[#10202B]/60">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="#diagnostic"
            className="inline-block rounded-xl bg-[#10202B] px-6 py-4 text-[15.5px] font-semibold text-white transition hover:bg-[#1c3442]"
          >
            Recevoir mon diagnostic 2027
          </a>
        </div>
      </section>

      <footer className="border-t border-[#10202B]/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 pb-20 sm:flex-row sm:justify-between sm:px-8">
          <div>
            <Logo
              size={24}
              bg="#10202B"
              dot="#E2694A"
              word="#10202B"
              dotColor="#E2694A"
              wordClassName="text-[19px] font-bold leading-none tracking-[-0.06em]"
            />
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-[#10202B]/50">
              La taxe de séjour, établissement par établissement. Bêta privée, ouverture très prochainement.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-[13.5px] text-[#10202B]/60 sm:grid-cols-3">
            <div className="space-y-2">
              <p className="font-semibold text-[#10202B]">Produit</p>
              <a href="#cout" className="block hover:text-[#10202B]">
                Le coût caché
              </a>
              <a href="#plateforme" className="block hover:text-[#10202B]">
                La plateforme
              </a>
              <a href="#tarifs" className="block hover:text-[#10202B]">
                Tarifs
              </a>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-[#10202B]">Ressources</p>
              <a href="#communes" className="block hover:text-[#10202B]">
                Vos communes
              </a>
              <a href="#faq" className="block hover:text-[#10202B]">
                Questions
              </a>
              <a href="/confidentialite" className="block hover:text-[#10202B]">
                Confidentialité
              </a>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-[#10202B]">Contact</p>
              <a href={`mailto:${CONTACT}`} className="block break-all hover:text-[#10202B]">
                {CONTACT}
              </a>
            </div>
          </div>
        </div>
        <p className="mx-auto max-w-7xl px-5 pb-10 text-[12px] leading-relaxed text-[#10202B]/40 sm:px-8">
          © 2026 Parnuit. Sources : catalogue DGFiP des délibérations (octobre 2025), Open Data DELTA, Atout France, INSEE, portails des
          collectivités, relevés Parnuit au 30 septembre 2026. Informations documentaires, sans valeur de conseil fiscal. Établissements
          d'exemple fictifs.
        </p>
      </footer>
    </main>
  );
}
