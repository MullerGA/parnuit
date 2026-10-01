"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const QUESTIONS = [
  {
    q: "À Nice, c'est la mairie qui collecte la taxe de séjour.",
    a: false,
    why: "C'est la Métropole Nice Côte d'Azur. Dans 65 % des 500 communes les plus touristiques, l'intercommunalité collecte à la place de la commune.",
  },
  {
    q: "À Paris, un hôtel 4★ collecte 2,60 € par personne et par nuit.",
    a: false,
    why: "Il collecte 8,45 €. Aux 2,60 € votés par la Ville s'ajoutent trois taxes additionnelles : département, Société des grands projets et Île-de-France Mobilités.",
  },
  {
    q: "Les tarifs 2027 de Carcassonne sont déjà votés.",
    a: true,
    why: "Depuis le 28 mai 2026 : 3,26 € en résidence 4★ contre 3,08 € en 2026. Et au 29 septembre, ils n'étaient toujours pas dans les fichiers nationaux.",
  },
  {
    q: "Toutes les communes demandent une déclaration au même rythme.",
    a: false,
    why: "Mensuelle pour 273 des 500 communes les plus touristiques, trimestrielle, quadrimestrielle ou semestrielle ailleurs. Chacune avec ses dates.",
  },
];

export function Quiz() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(QUESTIONS.map(() => null));
  const score = answers.filter((x, i) => x !== null && x === QUESTIONS[i].a).length;
  const done = answers.every((x) => x !== null);
  const colors = ["#FFE066", "#A9D4FF", "#FFB3C7", "#B8F0C2"];

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2">
        {QUESTIONS.map((item, i) => {
          const given = answers[i];
          const right = given !== null && given === item.a;
          return (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 20, rotate: i % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-[22px] border-[2.5px] border-[#1B1B1B] p-6 shadow-[6px_6px_0_#1B1B1B]"
              style={{ background: colors[i] }}
            >
              <p className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#1B1B1B]/55">Vrai ou faux · {i + 1}/4</p>
              <p className="mt-3 text-[21px] leading-snug font-extrabold text-[#1B1B1B]">{item.q}</p>
              <AnimatePresence mode="wait">
                {given === null ? (
                  <motion.div key="btn" exit={{ opacity: 0, y: -6 }} className="mt-5 flex gap-3">
                    {[true, false].map((v) => (
                      <button
                        key={String(v)}
                        type="button"
                        onClick={() => setAnswers((a) => a.map((x, k) => (k === i ? v : x)))}
                        className="flex-1 rounded-xl border-[2.5px] border-[#1B1B1B] bg-white px-4 py-3 text-[16px] font-extrabold shadow-[3px_3px_0_#1B1B1B] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
                      >
                        {v ? "Vrai" : "Faux"}
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="why"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-xl border-2 border-[#1B1B1B] bg-white p-4"
                  >
                    <p className="text-[15px] font-extrabold">
                      {right ? "Bien vu !" : "Raté !"} C'est {item.a ? "vrai" : "faux"}.
                    </p>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#1B1B1B]/75">{item.why}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {given !== null && (
                  <motion.span
                    initial={{ scale: 2.2, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: -12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14 }}
                    className={`absolute -top-4 -right-3 grid size-14 place-items-center rounded-full border-[2.5px] border-[#1B1B1B] text-[26px] font-black text-white ${right ? "bg-[#3DBE6B]" : "bg-[#FF6B3D]"}`}
                  >
                    {right ? "✓" : "✗"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mt-10 max-w-xl rotate-[-1deg] rounded-[22px] border-[2.5px] border-[#1B1B1B] bg-white p-6 text-center shadow-[6px_6px_0_#1B1B1B]"
          >
            <p className="font-[family-name:var(--font-v5)] text-[40px] font-extrabold">{score}/4</p>
            <p className="mt-1 text-[16px] text-[#1B1B1B]/75">
              {score === 4
                ? "Impressionnant. Mais multiplié par tout votre parc, chaque mois ?"
                : "Rassurez-vous : personne ne peut tout retenir. C'est exactement pour ça que Parnuit existe."}
            </p>
            <a
              href="#acces"
              className="mt-4 inline-block rounded-xl border-[2.5px] border-[#1B1B1B] bg-[#1B1B1B] px-5 py-3 font-extrabold text-white shadow-[4px_4px_0_#FF8A5B]"
            >
              Laisser Parnuit retenir pour moi →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
