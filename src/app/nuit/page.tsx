import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { BetaForm } from "@/components/beta/beta-form";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { Countdown, Moon, MorningBriefing, ParisStack } from "@/components/nuit/extras";
import { SkyStory } from "@/components/nuit/sky-story";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-v2-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-v2-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-v2-mono" });

export const metadata: Metadata = {
  title: "Par nuit. Chaque nuit a son tarif",
  description:
    "34 969 communes, 2 051 délibérations, une taxe de séjour par personne et par nuit. Parnuit rassemble les règles de tout votre parc.",
};

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <p className="font-[family-name:var(--font-v2-mono)] text-[11px] uppercase tracking-[0.22em] text-[#F3C77A]">{children}</p>
);

function Chapter({ kicker, title, children }: { kicker: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex h-full items-end px-6 pb-24 lg:items-center lg:pb-0 lg:pl-[7vw]">
      <div className="max-w-[460px] rounded-3xl bg-[#05081A]/70 p-5 backdrop-blur-sm lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <Kicker>{kicker}</Kicker>
        <h2 className="mt-4 font-[family-name:var(--font-v2-serif)] text-[clamp(38px,4.6vw,68px)] leading-[0.98] tracking-[-0.01em] text-white">
          {title}
        </h2>
        <div className="mt-5 text-[16px] leading-relaxed text-[#DCE3FF]/70 lg:text-[17px]">{children}</div>
      </div>
    </div>
  );
}

export default function NuitPage() {
  return (
    <main
      className={`${serif.variable} ${sans.variable} ${mono.variable} min-h-screen overflow-x-clip bg-[#05081A] font-[family-name:var(--font-v2-sans)] text-white selection:bg-[#F3C77A] selection:text-[#05081A]`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(64,80,170,.28),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(224,135,106,.12),transparent_50%)]"
      />
      <header className="fixed top-0 right-0 left-0 z-40">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 lg:px-10">
          <Logo size={28} bg="#F2E9D9" fg="#05081A" dot="#E0876A" word="#F2E9D9" />
          <a
            href="#acces"
            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[13px] font-medium text-white backdrop-blur transition hover:border-[#F3C77A] hover:text-[#F3C77A]"
          >
            Rejoindre la bêta
          </a>
        </div>
      </header>

      <SkyStory>
        {[
          <div key="hero" className="flex h-full flex-col items-center justify-center px-6 text-center">
            <Kicker>Parnuit · bêta privée · très prochainement</Kicker>
            <h1 className="mt-6 font-[family-name:var(--font-v2-serif)] text-[clamp(64px,11vw,176px)] leading-[0.86] tracking-[-0.02em] text-white">
              Chaque nuit
              <br />
              <em className="text-[#F3C77A]">a son tarif.</em>
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-[#DCE3FF]/75 sm:text-[19px]">
              Une nuit vendue, une taxe à collecter. Laquelle, pour qui, et quand ? En France, chaque commune fixe ses règles. Parnuit les
              rassemble pour tout votre parc.
            </p>
            <a
              href="#acces"
              className="mt-9 rounded-full bg-[#F3C77A] px-7 py-3.5 text-[15px] font-semibold text-[#05081A] shadow-[0_0_60px_-10px_rgba(243,199,122,.8)] transition hover:bg-[#ffd98f]"
            >
              Rejoindre la bêta privée
            </a>
          </div>,
          <Chapter key="1" kicker="01 — La carte" title={<>Voici la France de la taxe de séjour.</>}>
            <p>34 969 communes. Chaque point lumineux en est une, placé à sa vraie position.</p>
          </Chapter>,
          <Chapter key="2" kicker="02 — Les règles" title={<>32 310 communes la perçoivent.</>}>
            <p>
              Elles appliquent 2 051 délibérations différentes : autant de grilles de tarifs, de taxes additionnelles et de calendriers.
            </p>
          </Chapter>,
          <Chapter key="3" kicker="03 — Vos établissements" title={<>99 % des hébergements classés dorment ici.</>}>
            <p>
              Hôtels, résidences de tourisme, campings, villages de vacances : 20 557 établissements classés, presque tous soumis à une
              grille locale.
            </p>
          </Chapter>,
          <Chapter
            key="4"
            kicker="04 — Le terrain"
            title={
              <>
                500 communes, <em className="text-[#F3C77A]">55 % des lits classés.</em>
              </>
            }
          >
            <p>
              C'est là que nous avons commencé. Pour 488 d'entre elles, le portail de déclaration ou la page officielle est déjà identifié.
            </p>
          </Chapter>,
          <Chapter key="5" kicker="05 — Votre parc" title={<>Votre parc est une constellation.</>}>
            <p>
              Sept établissements, sept collecteurs, trois éditeurs de portail, trois rythmes de déclaration. Parnuit relie chaque étoile à
              ses règles.
            </p>
          </Chapter>,
        ]}
      </SkyStory>

      <section className="relative overflow-hidden bg-gradient-to-b from-[#05081A] via-[#1a1640] to-[#3a2340] px-6 py-32 lg:py-44">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <Kicker>Au réveil</Kicker>
            <h2 className="mt-5 font-[family-name:var(--font-v2-serif)] text-[clamp(44px,6vw,92px)] leading-[0.95] text-white">
              Le matin, <em className="text-[#F3C77A]">tout est déjà prêt.</em>
            </h2>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-white/65">
              Parnuit veille la nuit sur les délibérations, les portails et les calendriers de chaque collectivité. Vous commencez la
              journée avec la liste de ce qui compte, et la source de chaque ligne.
            </p>
          </Reveal>
          <MorningBriefing />
        </div>
      </section>

      <section className="relative bg-[#3a2340] px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Kicker>Paris · hôtel 4 étoiles · 2026</Kicker>
            <h2 className="mt-5 font-[family-name:var(--font-v2-serif)] text-[clamp(44px,6.4vw,104px)] leading-[0.92] text-white">
              2,60 € votés.
              <br />
              <em className="text-[#F3C77A]">8,45 € collectés.</em>
            </h2>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/65">
              Par personne et par nuit. Trois taxes additionnelles s'ajoutent au tarif municipal. Un tarif mal paramétré se voit à la fin du
              trimestre, quand la différence sort de votre caisse.
            </p>
          </Reveal>
          <div className="mt-14">
            <ParisStack />
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-[#3a2340] to-[#05081A] px-6 py-32">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <Kicker>Avant le 1er janvier 2027</Kicker>
            <h2 className="mx-auto mt-5 max-w-3xl font-[family-name:var(--font-v2-serif)] text-[clamp(40px,5.4vw,84px)] leading-[0.95] text-white">
              Les nouveaux tarifs tombent <em className="text-[#F3C77A]">dans</em>
            </h2>
          </Reveal>
          <div className="mt-12">
            <Countdown />
          </div>
          <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-white/55">
            Le catalogue national des tarifs 2027 est attendu avant le 15 octobre. Certaines communes, comme Carcassonne, ont déjà publié
            les leurs : Parnuit les a trouvées.
          </p>
        </div>
      </section>

      <section className="relative px-6 py-32">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {[
            [
              0.25,
              "Le bon tarif",
              "Pour chaque catégorie de chaque établissement, taxes additionnelles comprises, avec la délibération qui le fixe.",
            ],
            [
              0.5,
              "La bonne démarche",
              "Le collecteur réel, son portail, ses moyens de paiement. Même quand ce n'est pas la mairie : deux fois sur trois dans les communes touristiques.",
            ],
            [
              0.85,
              "La bonne date",
              "Chaque déclaration et chaque reversement du parc dans votre agenda, avec un rappel avant l'échéance, même à zéro nuitée.",
            ],
          ].map(([phase, title, body], i) => (
            <Reveal key={String(title)} delay={i * 0.12} className="rounded-[28px] border border-white/10 bg-white/[.03] p-8">
              <Moon phase={Number(phase)} />
              <h3 className="mt-8 font-[family-name:var(--font-v2-serif)] text-[34px] leading-none text-white">{title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-white/60">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="acces" className="relative scroll-mt-10 px-6 pt-16 pb-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(243,199,122,.22),transparent)]"
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mx-auto size-20 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff6dd,#F3C77A_45%,#b88a3c)] shadow-[0_0_80px_10px_rgba(243,199,122,.35)]" />
          <h2 className="mt-10 font-[family-name:var(--font-v2-serif)] text-[clamp(44px,6vw,88px)] leading-[0.95] text-white">
            Dormez <em className="text-[#F3C77A]">tranquille.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-white/65">
            La bêta privée ouvre très prochainement pour les groupes de cinq établissements et plus. Réservez votre place.
          </p>
          <BetaForm
            version="2-nuit"
            slots={{
              form: "mt-10 rounded-[28px] border border-white/10 bg-white/[.05] p-5 text-left backdrop-blur-xl sm:p-7",
              grid: "grid gap-3",
              field: "flex flex-col gap-1.5",
              label: "font-[family-name:var(--font-v2-mono)] text-[10.5px] uppercase tracking-[0.16em] text-white/50",
              input:
                "rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-[15px] text-white outline-none placeholder:text-white/25 focus:border-[#F3C77A] [&>option]:text-black",
              button:
                "mt-5 w-full rounded-full bg-[#F3C77A] px-6 py-4 text-[15px] font-semibold text-[#05081A] transition hover:bg-[#ffd98f] disabled:opacity-60",
              note: "mt-3 text-center text-[12px] text-white/40",
              error: "mt-2 text-[13px] text-[#fca5a5]",
              success: "mt-10 rounded-[28px] border border-[#F3C77A]/30 bg-white/[.05] p-7 text-[16px] leading-relaxed text-white/80",
            }}
          />
        </div>
      </section>

      <footer className="relative border-t border-white/10 px-6 py-10 pb-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-[12.5px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <Logo
            size={22}
            bg="#F2E9D9"
            fg="#05081A"
            dot="#E0876A"
            word="#F2E9D9"
            wordClassName="text-[18px] font-bold leading-none tracking-[-0.06em]"
          />
          <p className="max-w-lg">
            Sources : catalogue DGFiP des délibérations (octobre 2025), Atout France, INSEE, geo.api.gouv.fr, relevés Parnuit au 30
            septembre 2026. Informations documentaires, sans valeur de conseil fiscal.
          </p>
        </div>
      </footer>
    </main>
  );
}
