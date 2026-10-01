import type { Metadata } from "next";
import { Bricolage_Grotesque, Caveat } from "next/font/google";
import { BetaForm } from "@/components/beta/beta-form";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { BeforeAfter } from "@/components/rangement/before-after";
import { MessHero } from "@/components/rangement/mess";
import { Quiz } from "@/components/rangement/quiz";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-v5" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-v5-hand" });

export const metadata: Metadata = {
  title: "Votre taxe de séjour, enfin rangée",
  description:
    "Délibérations, portails, mails, tableurs : Parnuit range la taxe de séjour de chaque établissement de votre parc. Bêta privée.",
};

const cards = [
  {
    t: "Le bon tarif",
    b: "Par catégorie, taxes additionnelles comprises, avec la délibération qui le fixe.",
    c: "#FFE066",
    n: "fini les « 2,14 hors taxes ? »",
  },
  {
    t: "Le bon guichet",
    b: "Le vrai collecteur, son portail, ses moyens de paiement. Même quand c'est l'agglo.",
    c: "#A9D4FF",
    n: "adieu les post-it de mots de passe",
  },
  {
    t: "La bonne date",
    b: "Chaque déclaration et reversement dans votre agenda, avec un rappel avant.",
    c: "#FFB3C7",
    n: "même à zéro nuitée",
  },
];

export default function RangementPage() {
  return (
    <main
      className={`${display.variable} ${hand.variable} min-h-screen overflow-x-clip bg-[#FFF4E4] font-[family-name:var(--font-v5)] text-[#1B1B1B] selection:bg-[#FFE066]`}
    >
      <header className="relative z-20 border-b-[2.5px] border-[#1B1B1B] bg-[#FFF4E4]">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo
            size={30}
            bg="#1B1B1B"
            fg="#FFF4E4"
            dot="#FF8A5B"
            word="#1B1B1B"
            wordClassName="text-[24px] font-extrabold leading-none tracking-[-0.05em]"
          />
          <a
            href="#acces"
            className="rounded-xl border-[2.5px] border-[#1B1B1B] bg-[#FFE066] px-4 py-2 text-[14px] font-extrabold shadow-[3px_3px_0_#1B1B1B] transition hover:-translate-y-0.5"
          >
            Rejoindre la bêta
          </a>
        </div>
      </header>

      <MessHero />

      <section className="border-y-[2.5px] border-[#1B1B1B] bg-[#1B1B1B] py-5 text-[#FFF4E4]">
        <p className="text-center font-[family-name:var(--font-v5-hand)] text-[28px] sm:text-[34px]">
          ↑ psst : vous pouvez attraper les papiers avec la souris.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-3xl">
          <h2 className="text-[clamp(38px,5.6vw,80px)] leading-[0.92] font-extrabold tracking-[-0.04em]">
            Avant, après. <span className="font-[family-name:var(--font-v5-hand)] font-bold text-[#FF6B3D]">Glissez.</span>
          </h2>
          <p className="mt-4 text-[18px] leading-relaxed text-[#1B1B1B]/70">
            Le même parc, les mêmes communes. D'un côté le tableur qu'on connaît tous, de l'autre la vue Parnuit, avec les vraies données.
          </p>
        </Reveal>
        <div className="mt-12">
          <BeforeAfter />
        </div>
      </section>

      <section className="border-y-[2.5px] border-[#1B1B1B] bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="max-w-3xl">
            <h2 className="text-[clamp(38px,5.6vw,80px)] leading-[0.92] font-extrabold tracking-[-0.04em]">Petit test entre nous.</h2>
            <p className="mt-4 text-[18px] leading-relaxed text-[#1B1B1B]/70">Quatre questions, quatre vraies communes. Sans tricher.</p>
          </Reveal>
          <div className="mt-12">
            <Quiz />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <h2 className="max-w-4xl text-[clamp(38px,5.6vw,80px)] leading-[0.92] font-extrabold tracking-[-0.04em]">
            Trois tiroirs. Tout est dedans.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.1} className={i === 1 ? "md:mt-10" : ""}>
              <div
                className="relative rounded-[6px] p-7 shadow-[5px_6px_0_rgba(0,0,0,.2)]"
                style={{ background: c.c, transform: `rotate(${(i - 1) * 2}deg)` }}
              >
                <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-3deg] bg-white/70" />
                <h3 className="text-[30px] leading-none font-extrabold">{c.t}</h3>
                <p className="mt-4 text-[16px] leading-relaxed">{c.b}</p>
                <p className="mt-6 font-[family-name:var(--font-v5-hand)] text-[24px] leading-tight text-[#1B1B1B]/70">{c.n}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            ["32 310", "communes et leurs tarifs officiels"],
            ["99 %", "des hébergements classés couverts par ces tarifs"],
            ["488 / 500", "communes les plus touristiques : portail identifié"],
          ].map(([n, t]) => (
            <div key={n} className="rounded-2xl border-[2.5px] border-[#1B1B1B] bg-white p-6">
              <p className="text-[44px] leading-none font-extrabold tracking-[-0.04em]">{n}</p>
              <p className="mt-2 text-[15px] text-[#1B1B1B]/70">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="acces" className="scroll-mt-4 px-5 pb-28 sm:px-8">
        <div className="relative mx-auto max-w-3xl rotate-[-1deg] rounded-[8px] bg-[#FFE066] p-7 shadow-[10px_12px_0_#1B1B1B] sm:p-12">
          <span aria-hidden="true" className="absolute -top-4 left-10 h-8 w-32 rotate-[-4deg] bg-white/70" />
          <span aria-hidden="true" className="absolute -top-4 right-10 h-8 w-32 rotate-[5deg] bg-white/70" />
          <span className="absolute -top-6 -right-4 rotate-[12deg] rounded-full border-[3px] border-[#FF6B3D] bg-[#FFF4E4] px-4 py-2 text-[15px] font-extrabold text-[#FF6B3D] sm:-right-8">
            BÊTA GRATUITE
          </span>
          <h2 className="text-[clamp(38px,5.4vw,70px)] leading-[0.92] font-extrabold tracking-[-0.04em]">On range pour vous ?</h2>
          <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-[#1B1B1B]/75">
            La bêta privée ouvre très bientôt pour les groupes d'au moins cinq établissements. Laissez-nous vos coordonnées, on s'occupe du
            reste.
          </p>
          <BetaForm
            version="5-rangement"
            cta="Oui, rangez tout ✨"
            slots={{
              form: "mt-8",
              grid: "grid gap-4 sm:grid-cols-2",
              field: "flex flex-col gap-1.5 sm:[&:first-child]:col-span-2",
              label: "font-[family-name:var(--font-v5-hand)] text-[22px] leading-none text-[#1B1B1B]/75",
              input:
                "rounded-xl border-[2.5px] border-[#1B1B1B] bg-white px-4 py-3.5 text-[16px] font-semibold outline-none focus:shadow-[4px_4px_0_#1B1B1B]",
              button:
                "mt-6 w-full rounded-2xl border-[2.5px] border-[#1B1B1B] bg-[#1B1B1B] px-6 py-4 text-[18px] font-extrabold text-white shadow-[5px_5px_0_#FF8A5B] transition hover:-translate-y-0.5 disabled:opacity-60",
              note: "mt-3 text-center text-[13px] font-semibold text-[#1B1B1B]/60",
              error: "mt-2 text-[14px] font-bold text-[#C00000]",
              success: "mt-8 rounded-2xl border-[2.5px] border-[#1B1B1B] bg-white p-6 text-[17px] leading-relaxed",
            }}
          />
        </div>
      </section>

      <footer className="border-t-[2.5px] border-[#1B1B1B] px-5 py-10 pb-20 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-[13px] text-[#1B1B1B]/60 sm:flex-row sm:items-center sm:justify-between">
          <Logo
            size={24}
            bg="#1B1B1B"
            fg="#FFF4E4"
            dot="#FF8A5B"
            word="#1B1B1B"
            wordClassName="text-[19px] font-extrabold leading-none tracking-[-0.05em]"
          />
          <p className="max-w-lg">
            Données réelles issues du catalogue DGFiP et des portails des collectivités, relevées au 30 septembre 2026. Établissements
            d'exemple fictifs. Sans valeur de conseil fiscal.
          </p>
        </div>
      </footer>
    </main>
  );
}
