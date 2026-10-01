import type { Metadata } from "next";
import { DM_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { BetaForm } from "@/components/beta/beta-form";
import { Logo } from "@/components/brand/logo";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { Bento } from "@/components/plateforme/bento";
import { Dashboard } from "@/components/plateforme/dashboard";
import { Pricing } from "@/components/plateforme/pricing";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-v4" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-v4-mono" });

export const metadata: Metadata = {
  title: "La plateforme de la taxe de séjour multi-sites",
  description:
    "Rattachement, tarifs, calendrier synchronisé, rappels, alertes et sources : le poste de pilotage de la taxe de séjour pour les groupes d'hébergement.",
};

const compare = [
  ["Tarif total par catégorie, taxes additionnelles comprises", "À recalculer", "Selon la personne", "Automatique"],
  ["Collecteur réel de chaque établissement", "À chercher", "Souvent", "Oui"],
  ["Portail, moyens de paiement, contact", "Dispersés", "Dans les mails", "Dans chaque fiche"],
  ["Calendrier consolidé du parc", "À tenir", "Non", "Synchronisé"],
  ["Rappels avant échéance, même à zéro nuitée", "Non", "Non", "Oui"],
  ["Alerte quand un tarif change", "Non", "Au hasard", "Dès la publication"],
  ["Source et date de chaque information", "Rarement", "Non", "Toujours"],
];

const faq = [
  [
    "Quand la bêta ouvre-t-elle ?",
    "Très prochainement. Les premiers accès vont aux groupes d'au moins cinq établissements, dans l'ordre des demandes. La bêta est gratuite.",
  ],
  [
    "Comment importer notre parc ?",
    "Par adresses ou par fichier CSV. Chaque établissement est rattaché à sa commune, à son collecteur et à sa catégorie ; vous validez le rattachement.",
  ],
  [
    "D'où viennent les données ?",
    "Du catalogue national des délibérations de la DGFiP, des portails et sites officiels des collectivités, de l'annuaire de l'administration. Chaque information garde son document et sa date de relevé.",
  ],
  [
    "Parnuit déclare-t-il à notre place ?",
    "Non. Parnuit vous dit quoi déclarer, où et quand, et vous prévient. Vos équipes déclarent sur le portail de la collectivité ; le service ne touche jamais aux fonds.",
  ],
  [
    "Nos données sont-elles protégées ?",
    "Les données de votre parc sont hébergées dans l'Union européenne et ne sont jamais partagées. Les tarifs et calendriers viennent de sources publiques.",
  ],
  [
    "Est-ce un conseil fiscal ?",
    "Non : une information documentaire, sourcée et datée, pour que vos équipes appliquent la bonne règle en connaissance de cause.",
  ],
];

export default function PlateformePage() {
  return (
    <main
      className={`${sans.variable} ${mono.variable} min-h-screen overflow-x-clip bg-[#FBFBFE] font-[family-name:var(--font-v4)] text-[#0F1222]`}
    >
      <header className="sticky top-0 z-40 border-b border-[#0F1222]/6 bg-[#FBFBFE]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-5 sm:px-8">
          <Logo size={28} bg="#0F1222" dot="#FF7A59" word="#0F1222" dotColor="#FF7A59" />
          <nav className="hidden items-center gap-6 text-[14px] font-medium text-[#0F1222]/65 lg:flex">
            <a href="#fonctions" className="hover:text-[#0F1222]">
              Fonctions
            </a>
            <a href="#comparatif" className="hover:text-[#0F1222]">
              Comparatif
            </a>
            <a href="#tarifs" className="hover:text-[#0F1222]">
              Tarifs
            </a>
            <a href="#securite" className="hover:text-[#0F1222]">
              Sécurité
            </a>
            <a href="#faq" className="hover:text-[#0F1222]">
              Questions
            </a>
          </nav>
          <a
            href="#acces"
            className="ml-auto rounded-xl bg-[#0F1222] px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(15,18,34,.6)] transition hover:bg-[#23284a]"
          >
            Demander un accès
          </a>
        </div>
      </header>

      <section className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-20 h-[760px] overflow-hidden">
          <div className="aurora absolute top-0 left-[8%] size-[520px] rounded-full bg-[#7C7CFF]/35 blur-[90px]" />
          <div className="aurora absolute top-24 right-[6%] size-[480px] rounded-full bg-[#FF9C80]/35 blur-[90px] [animation-delay:-6s]" />
          <div className="aurora absolute top-72 left-[38%] size-[420px] rounded-full bg-[#FFD27A]/30 blur-[90px] [animation-delay:-11s]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 pt-16 text-center sm:px-8 sm:pt-24">
          <Reveal>
            <a
              href="#acces"
              className="inline-flex items-center gap-2 rounded-full border border-[#0F1222]/10 bg-white/70 py-1 pr-3 pl-1 text-[13px] font-medium text-[#0F1222]/75 backdrop-blur"
            >
              <span className="rounded-full bg-[#0F1222] px-2 py-0.5 text-[11.5px] font-semibold text-white">Bêta</span>
              Premiers accès très prochainement →
            </a>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mx-auto mt-6 max-w-5xl text-[clamp(42px,6.6vw,86px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
              Le poste de pilotage de la{" "}
              <span className="bg-gradient-to-r from-[#5B5BF7] via-[#A35BF7] to-[#FF7A59] bg-clip-text text-transparent">
                taxe de séjour
              </span>{" "}
              multi-sites.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-[#0F1222]/65">
              Rattachez chaque établissement à son collecteur, appliquez le bon tarif, tenez toutes les échéances du parc et soyez prévenu à
              chaque changement. Depuis les sources officielles.
            </p>
          </Reveal>
          <Reveal delay={0.24} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#acces"
              className="rounded-xl bg-[#0F1222] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(15,18,34,.7)] transition hover:-translate-y-0.5"
            >
              Demander un accès bêta
            </a>
            <a
              href="#tarifs"
              className="rounded-xl border border-[#0F1222]/12 bg-white/70 px-6 py-3.5 text-[15px] font-semibold text-[#0F1222] backdrop-blur transition hover:bg-white"
            >
              Voir les tarifs
            </a>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-10 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0F1222]/40">
              Construit sur les sources officielles
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[15px] font-bold text-[#0F1222]/45">
              <span>DGFiP</span>
              <span>Atout France</span>
              <span>INSEE</span>
              <span>Annuaire de l'administration</span>
              <span>Portails des collectivités</span>
            </div>
          </Reveal>
        </div>
        <div className="relative mx-auto mt-14 max-w-6xl px-3 sm:px-8">
          <Dashboard />
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-px overflow-hidden rounded-[24px] bg-[#0F1222]/8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [<CountUp key="a" to={32310} />, "communes au catalogue national, tarifs officiels à jour"],
            [<CountUp key="b" to={99} suffix={"\u00a0%"} />, "des hébergements classés de France dans ces communes"],
            [<CountUp key="c" to={455} />, "portails de déclaration déjà identifiés"],
            [<CountUp key="d" to={2051} />, "délibérations suivies, publication après publication"],
          ].map(([n, t]) => (
            <div key={String(t)} className="bg-white p-7">
              <p className="bg-gradient-to-r from-[#5B5BF7] to-[#FF7A59] bg-clip-text text-[44px] font-extrabold tracking-[-0.04em] text-transparent">
                {n}
              </p>
              <p className="mt-1 text-[14px] leading-snug text-[#0F1222]/60">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="fonctions" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-28 sm:px-8">
        <Reveal className="max-w-3xl">
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#5B5BF7]">Fonctions</p>
          <h2 className="mt-3 text-[clamp(32px,4.4vw,56px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
            Tout ce que votre tableur ne fait pas.
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[#0F1222]/60">
            Une fiche par établissement, un calendrier pour tout le parc, et une veille qui ne dort jamais.
          </p>
        </Reveal>
        <div className="mt-12">
          <Bento />
        </div>
      </section>

      <section className="bg-[#0F1222] py-28 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-3xl">
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#FF9C80]">Mise en route</p>
            <h2 className="mt-3 text-[clamp(32px,4.4vw,56px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Opérationnel en une matinée.
            </h2>
          </Reveal>
          <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
            <span
              aria-hidden="true"
              className="absolute top-6 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-[#5B5BF7] via-[#A35BF7] to-[#FF7A59] md:block"
            />
            {[
              [
                "Importez",
                "Un fichier CSV ou une liste d'adresses. Parnuit propose le rattachement de chaque établissement ; vous validez.",
              ],
              [
                "Vérifiez",
                "Chaque fiche affiche le tarif, le portail, le calendrier et les sources. Vous voyez d'un coup d'œil ce qui reste à confirmer.",
              ],
              [
                "Synchronisez",
                "Ajoutez le calendrier du parc à Google Agenda ou Outlook, choisissez qui reçoit les rappels et les alertes.",
              ],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 0.12} className="relative">
                <span className="relative z-10 grid size-12 place-items-center rounded-full bg-white text-[16px] font-extrabold text-[#0F1222] ring-8 ring-[#0F1222]">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-[22px] font-bold">{t}</h3>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/60">{b}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="comparatif" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-28 sm:px-8">
        <Reveal className="text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#5B5BF7]">Comparatif</p>
          <h2 className="mt-3 text-[clamp(32px,4.4vw,56px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
            Ce qui change, ligne par ligne.
          </h2>
        </Reveal>
        <div className="mt-12 overflow-x-auto rounded-[24px] border border-[#0F1222]/8 bg-white">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#0F1222]/8 text-[13px] text-[#0F1222]/50">
                <th className="p-4 font-semibold sm:p-5"> </th>
                <th className="p-4 font-semibold sm:p-5">Tableur interne</th>
                <th className="p-4 font-semibold sm:p-5">Veille manuelle</th>
                <th className="bg-[#F4F3FF] p-4 font-bold text-[#0F1222] sm:p-5">Parnuit</th>
              </tr>
            </thead>
            <tbody>
              {compare.map(([a, b, c, d]) => (
                <tr key={a} className="border-b border-[#0F1222]/6 last:border-b-0">
                  <td className="p-4 font-semibold sm:p-5">{a}</td>
                  <td className="p-4 text-[#0F1222]/50 sm:p-5">{b}</td>
                  <td className="p-4 text-[#0F1222]/50 sm:p-5">{c}</td>
                  <td className="bg-[#F4F3FF] p-4 font-semibold text-[#4B3FE0] sm:p-5">✓ {d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="tarifs" className="scroll-mt-20 bg-gradient-to-b from-[#F4F3FF] to-[#FBFBFE] py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#5B5BF7]">Tarifs</p>
            <h2 className="mt-3 text-[clamp(32px,4.4vw,56px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Un prix par établissement. Des utilisateurs illimités.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[17px] text-[#0F1222]/60">
              Gratuit pendant la bêta. Déplacez le curseur pour votre parc.
            </p>
          </Reveal>
          <div className="mt-12">
            <Pricing />
          </div>
        </div>
      </section>

      <section id="securite" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-28 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#5B5BF7]">Confiance</p>
            <h2 className="mt-3 text-[clamp(32px,4.4vw,56px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Conçu pour passer un contrôle.
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[#0F1222]/60">
              Chaque chiffre affiché peut être justifié. Et Parnuit ne se place jamais entre vous et la collectivité.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Sources datées", "Document, adresse et date de relevé derrière chaque tarif et chaque échéance."],
              ["Aucun maniement de fonds", "Vous déclarez et payez sur le portail de la collectivité, comme aujourd'hui."],
              ["Données hébergées en Europe", "Les données de votre parc restent dans l'Union européenne et ne sont jamais revendues."],
              ["Information, pas conseil", "Une information documentaire vérifiable, sans valeur de conseil fiscal."],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 0.08} className="rounded-[22px] border border-[#0F1222]/8 bg-white p-6">
                <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#5B5BF7] to-[#FF7A59] text-[15px] text-white">
                  ✓
                </span>
                <h3 className="mt-5 text-[17px] font-bold">{t}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#0F1222]/60">{b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 pb-28 sm:px-8">
        <h2 className="text-center text-[clamp(30px,3.8vw,46px)] font-extrabold tracking-[-0.04em]">Questions fréquentes</h2>
        <div className="mt-10 space-y-3">
          {faq.map(([q, a]) => (
            <details
              key={q}
              className="group rounded-2xl border border-[#0F1222]/8 bg-white px-5 py-4 open:shadow-[0_20px_40px_-30px_rgba(46,38,120,.4)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold">
                {q}
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#F1F1F8] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-[#0F1222]/60">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="acces" className="scroll-mt-16 px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#0F1222] px-6 py-16 text-white sm:px-14 sm:py-20">
          <div aria-hidden="true" className="aurora absolute -top-40 -left-20 size-[520px] rounded-full bg-[#5B5BF7]/40 blur-[100px]" />
          <div
            aria-hidden="true"
            className="aurora absolute -right-20 -bottom-40 size-[520px] rounded-full bg-[#FF7A59]/35 blur-[100px] [animation-delay:-8s]"
          />
          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-[clamp(34px,4.8vw,62px)] font-extrabold leading-[1] tracking-[-0.045em]">Prenez de l'avance sur 2027.</h2>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-white/65">
                Les nouveaux tarifs s'appliquent au 1er janvier. Rejoignez la bêta privée et démarrez avec un parc déjà rattaché.
              </p>
              <ul className="mt-6 space-y-2 text-[14.5px] text-white/75">
                <li>✓ Gratuit pendant la bêta</li>
                <li>✓ Import de votre parc accompagné</li>
                <li>✓ Sans engagement</li>
              </ul>
            </div>
            <BetaForm
              version="4-plateforme"
              withMessage
              slots={{
                form: "rounded-[24px] bg-white p-6 text-[#0F1222] shadow-2xl sm:p-7",
                grid: "grid gap-3 sm:grid-cols-2",
                field: "flex flex-col gap-1.5",
                label: "text-[12.5px] font-semibold text-[#0F1222]/60",
                input:
                  "rounded-xl border border-[#0F1222]/12 bg-[#FBFBFE] px-3.5 py-3 text-[15px] outline-none focus:border-[#5B5BF7] focus:ring-4 focus:ring-[#5B5BF7]/15",
                button:
                  "mt-5 w-full rounded-xl bg-gradient-to-r from-[#5B5BF7] to-[#FF7A59] px-5 py-3.5 text-[15px] font-bold text-white shadow-[0_14px_30px_-12px_rgba(91,91,247,.8)] transition hover:brightness-110 disabled:opacity-60",
                note: "mt-3 text-center text-[12.5px] text-[#0F1222]/45",
                error: "mt-2 text-[13px] text-red-600",
                success: "rounded-[24px] bg-white p-7 text-[16px] leading-relaxed text-[#0F1222]",
              }}
            />
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-5 py-12 pb-24 sm:px-8">
        <div className="flex flex-col gap-8 border-t border-[#0F1222]/8 pt-10 sm:flex-row sm:justify-between">
          <div>
            <Logo
              size={24}
              bg="#0F1222"
              dot="#FF7A59"
              word="#0F1222"
              dotColor="#FF7A59"
              wordClassName="text-[19px] font-bold leading-none tracking-[-0.06em]"
            />
            <p className="mt-3 max-w-xs text-[13px] text-[#0F1222]/50">La taxe de séjour, établissement par établissement. Bêta privée.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-[13.5px] text-[#0F1222]/60 sm:grid-cols-3">
            <div className="space-y-2">
              <p className="font-semibold text-[#0F1222]">Produit</p>
              <a href="#fonctions" className="block hover:text-[#0F1222]">
                Fonctions
              </a>
              <a href="#tarifs" className="block hover:text-[#0F1222]">
                Tarifs
              </a>
              <a href="#comparatif" className="block hover:text-[#0F1222]">
                Comparatif
              </a>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-[#0F1222]">Confiance</p>
              <a href="#securite" className="block hover:text-[#0F1222]">
                Sécurité
              </a>
              <a href="#faq" className="block hover:text-[#0F1222]">
                Questions
              </a>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-[#0F1222]">Contact</p>
              <a href="mailto:muller.tangae@gmail.com" className="block hover:text-[#0F1222]">
                Nous écrire
              </a>
            </div>
          </div>
        </div>
        <p className="mt-10 text-[12px] text-[#0F1222]/40">
          © 2026 Parnuit. Informations documentaires issues de sources publiques, sans valeur de conseil fiscal.
        </p>
      </footer>
    </main>
  );
}
