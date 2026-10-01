import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CONTACT, isVitrine } from "@/lib/site";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-legal" });

export const metadata: Metadata = {
  title: "Confidentialité et mentions légales",
  description: "Comment Parnuit utilise les informations transmises par le formulaire, et mentions légales du site.",
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[#10202B]/10 py-8">
      <h2 className="text-[20px] font-bold tracking-[-0.02em]">{title}</h2>
      <div className="mt-3 space-y-3 text-[15.5px] leading-relaxed text-[#10202B]/70">{children}</div>
    </section>
  );
}

export default function ConfidentialitePage() {
  return (
    <main className={`${sans.variable} min-h-screen bg-[#FAF8F4] font-[family-name:var(--font-legal)] text-[#10202B]`}>
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <Link href={isVitrine ? "/" : "/vitrine"} aria-label="Retour à l'accueil de Parnuit">
          <Logo size={26} bg="#10202B" dot="#E2694A" word="#10202B" dotColor="#E2694A" />
        </Link>
        <h1 className="mt-12 text-[clamp(34px,5vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
          Confidentialité et mentions légales
        </h1>
        <p className="mt-4 text-[16px] text-[#10202B]/60">Dernière mise à jour : 1er octobre 2026.</p>

        <Block title="Ce que nous collectons">
          <p>
            Uniquement ce que vous saisissez dans le formulaire : adresse email professionnelle, nom du groupe, nombre d'établissements,
            fonction, liste d'établissements ou de communes, et le fichier que vous choisissez de joindre. Nous enregistrons aussi la page
            d'origine de la demande.
          </p>
        </Block>
        <Block title="Pourquoi">
          <p>
            Pour préparer le diagnostic que vous demandez, vous l'envoyer, et vous recontacter au sujet de la bêta de Parnuit. Ces
            informations ne servent à rien d'autre et ne sont jamais vendues ni louées.
          </p>
          <p>
            Le traitement repose sur votre demande (mesures précontractuelles prises à votre demande) et sur l'intérêt légitime de Parnuit à
            répondre aux professionnels qui le sollicitent.
          </p>
        </Block>
        <Block title="Où et combien de temps">
          <p>
            Les demandes sont stockées dans l'Union européenne (région de Paris) chez notre hébergeur, Vercel. Elles sont conservées trois
            ans après notre dernier échange, puis supprimées. Seule l'équipe Parnuit y a accès.
          </p>
        </Block>
        <Block title="Vos droits">
          <p>
            Vous pouvez à tout moment demander l'accès à vos informations, leur rectification, leur suppression ou vous opposer à leur
            utilisation, en écrivant à{" "}
            <a className="font-semibold text-[#E2694A] underline underline-offset-2" href={`mailto:${CONTACT}`}>
              {CONTACT}
            </a>
            . Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr).
          </p>
        </Block>
        <Block title="Cookies et mesure d'audience">
          <p>Ce site ne dépose aucun cookie de suivi, de mesure d'audience ou de publicité.</p>
        </Block>
        <Block title="Données affichées">
          <p>
            Les tarifs, collecteurs, portails et calendriers présentés proviennent de sources publiques : catalogue des délibérations de la
            DGFiP, Open Data DELTA, Atout France, INSEE, annuaire de l'administration et sites officiels des collectivités. Ils sont fournis
            à titre documentaire et ne constituent pas un conseil fiscal.
          </p>
        </Block>
        <Block title="Mentions légales">
          <p>
            Éditeur : Parnuit, projet en cours de création. Contact :{" "}
            <a className="font-semibold text-[#E2694A] underline underline-offset-2" href={`mailto:${CONTACT}`}>
              {CONTACT}
            </a>
            .
          </p>
          <p>Hébergement : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
        </Block>
      </div>
    </main>
  );
}
