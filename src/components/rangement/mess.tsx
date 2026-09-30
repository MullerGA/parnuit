"use client";

import Matter from "matter-js";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Paper = {
  kind: "pdf" | "mail" | "postit" | "xls" | "cal" | "recu";
  title: string;
  sub?: string;
  color?: string;
  w: number;
  h: number;
};

const PAPERS: Paper[] = [
  { kind: "pdf", title: "Délibération_2025-118.pdf", sub: "32 pages · scanné", w: 210, h: 92 },
  { kind: "mail", title: "RE: RE: TR: taxe de séjour T3 ???", sub: "Karine, compta", w: 250, h: 84 },
  { kind: "postit", title: "Code portail Nice ?? demander à Karine", color: "#FFE066", w: 150, h: 130 },
  { kind: "xls", title: "tarifs_2026_v3_FINAL(2).xlsx", sub: "modifié par ???", w: 240, h: 84 },
  { kind: "postit", title: "Carcassonne : mensuel à partir d'octobre !!", color: "#FFB3C7", w: 160, h: 140 },
  { kind: "cal", title: "15/10 ?? ou le 20 ?", sub: "Saint-Malo", w: 160, h: 100 },
  { kind: "mail", title: "Relance : déclaration de septembre", sub: "noreply@taxesejour.fr", w: 250, h: 84 },
  { kind: "pdf", title: "Tarifs_TS_2027.pdf", sub: "publié le 8 juin", w: 190, h: 92 },
  { kind: "postit", title: "Saint-Malo = l'agglo, pas la mairie", color: "#A9D4FF", w: 150, h: 130 },
  { kind: "xls", title: "échéances_parc_OK_vraiment.xlsx", sub: "37 onglets", w: 250, h: 84 },
  { kind: "recu", title: "Reçu PayFip", sub: "T2 · 1 284,60 €", w: 150, h: 104 },
  { kind: "postit", title: "RIB changé ?!", color: "#B8F0C2", w: 130, h: 120 },
  { kind: "mail", title: "Avis de sommes à payer", sub: "Métropole", w: 220, h: 84 },
  { kind: "pdf", title: "Taxe_additionnelle_LGV.pdf", sub: "+34 %", w: 220, h: 92 },
];

const ICON: Record<Paper["kind"], string> = { pdf: "PDF", mail: "✉", postit: "", xls: "XLS", cal: "📅", recu: "€" };
const TINT: Record<Paper["kind"], string> = {
  pdf: "#FF8A5B",
  mail: "#8FB8FF",
  postit: "",
  xls: "#3DBE6B",
  cal: "#FFB347",
  recu: "#B18CFF",
};

export function MessHero({ onSorted }: { onSorted?: () => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const rafRef = useRef(0);
  const [sorted, setSorted] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = box.clientWidth;
    const wide = W >= 900;
    const rb = box.getBoundingClientRect();
    const rt = text.getBoundingClientRect();
    const textBottom = rt.bottom - rb.top;
    const textRight = rt.right - rb.left;
    if (!wide) box.style.height = `${Math.max(620, textBottom + 380)}px`;
    const H = box.clientHeight;
    const scale = W < 640 ? 0.72 : 1;
    setScale(scale);
    const engine = Matter.Engine.create({ gravity: { y: 1.1 } });
    engineRef.current = engine;
    const wall = { isStatic: true, render: { visible: false } };
    Matter.Composite.add(engine.world, [
      Matter.Bodies.rectangle(W / 2, H + 40, W * 2, 80, wall),
      Matter.Bodies.rectangle(-40, H / 2, 80, H * 3, wall),
      Matter.Bodies.rectangle(W + 40, H / 2, 80, H * 3, wall),
    ]);
    if (wide) {
      const bw = textRight + 24;
      const bh = textBottom + 612;
      Matter.Composite.add(engine.world, Matter.Bodies.rectangle(bw / 2 - 30, bh / 2 - 600, bw + 60, bh, wall));
    }
    const spawnMin = wide ? textRight + 80 : 60;
    const spawnSpan = Math.max(1, W - 60 - spawnMin);
    const bodies = PAPERS.map((p, i) => {
      const w = p.w * scale;
      const h = p.h * scale;
      const x = spawnMin + ((i * 137) % spawnSpan);
      const y = wide ? (reduce ? H - 60 - (i % 4) * 70 : -120 - i * 90) : textBottom + 40 - i * 110;
      const b = Matter.Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: 10 },
        restitution: 0.25,
        friction: 0.6,
        frictionAir: 0.015,
        angle: ((i % 5) - 2) * 0.25,
      });
      return b;
    });
    bodiesRef.current = bodies;
    Matter.Composite.add(engine.world, bodies);

    const fine = window.matchMedia("(pointer: fine)").matches;
    let mouse: Matter.Mouse | null = null;
    if (fine) {
      mouse = Matter.Mouse.create(box);
      const m = mouse as unknown as { element: HTMLElement; mousewheel: EventListener };
      m.element.removeEventListener("wheel", m.mousewheel);
      m.element.removeEventListener("mousewheel", m.mousewheel);
      m.element.removeEventListener("DOMMouseScroll", m.mousewheel);
      const mc = Matter.MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
      Matter.Composite.add(engine.world, mc);
    }

    let last = performance.now();
    const step = (t: number) => {
      rafRef.current = requestAnimationFrame(step);
      const dt = Math.min(32, t - last);
      last = t;
      Matter.Engine.update(engine, dt);
      bodies.forEach((b, i) => {
        const el = els.current[i];
        if (!el) return;
        const w = PAPERS[i].w * scale;
        const h = PAPERS[i].h * scale;
        el.style.transform = `translate(${b.position.x - w / 2}px, ${b.position.y - h / 2}px) rotate(${b.angle}rad)`;
        el.style.visibility = !wide && b.position.y < textBottom - 20 ? "hidden" : "visible";
      });
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      Matter.Engine.clear(engine);
      if (mouse) Matter.Mouse.clearSourceEvents(mouse);
    };
  }, []);

  const sort = () => {
    if (sorted) return;
    cancelAnimationFrame(rafRef.current);
    const box = boxRef.current;
    if (!box) return;
    const W = box.clientWidth;
    const H = box.clientHeight;
    const tx = W < 1024 ? W / 2 : W * 0.78;
    const ty = H * 0.62;
    els.current.forEach((el, i) => {
      if (!el) return;
      el.style.transition = `transform 0.9s cubic-bezier(.7,0,.2,1) ${i * 0.035}s, opacity 0.4s ease ${0.6 + i * 0.035}s`;
      el.style.transform = `translate(${tx - el.offsetWidth / 2}px, ${ty - el.offsetHeight / 2 - i * 2}px) rotate(0deg) scale(0.35)`;
      el.style.opacity = "0";
    });
    window.setTimeout(() => {
      setSorted(true);
      onSorted?.();
    }, 1100);
  };

  return (
    <div className="relative">
      <div ref={boxRef} className="relative h-[calc(100svh-72px)] min-h-[620px] touch-pan-y overflow-hidden select-none">
        {PAPERS.map((p, i) => (
          <div
            key={p.title}
            ref={(el) => {
              els.current[i] = el;
            }}
            className="absolute top-0 left-0 cursor-grab will-change-transform active:cursor-grabbing"
            style={{ width: p.w * scale, height: p.h * scale, transform: "translate(-999px,-999px)" }}
          >
            {p.kind === "postit" ? (
              <div
                className="flex h-full items-center justify-center p-3 text-center font-[family-name:var(--font-v5-hand)] text-[20px] leading-[1.05] text-[#1B1B1B] shadow-[3px_4px_0_rgba(0,0,0,.18)] max-sm:text-[15px]"
                style={{ background: p.color }}
              >
                {p.title}
              </div>
            ) : (
              <div className="flex h-full items-center gap-3 rounded-xl border-[2.5px] border-[#1B1B1B] bg-white p-3 shadow-[4px_4px_0_#1B1B1B]">
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-lg text-[11px] font-black text-white max-sm:size-8"
                  style={{ background: TINT[p.kind] }}
                >
                  {ICON[p.kind]}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-bold text-[#1B1B1B] max-sm:text-[11px]">{p.title}</span>
                  {p.sub && <span className="block truncate text-[11.5px] text-[#1B1B1B]/55 max-sm:text-[9.5px]">{p.sub}</span>}
                </span>
              </div>
            )}
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 top-0 px-5 pt-10 sm:px-10 sm:pt-16">
          <div ref={textRef} className="max-w-3xl">
            <AnimatePresence mode="wait">
              {!sorted ? (
                <motion.div key="mess" exit={{ opacity: 0, y: -20 }} className="max-w-3xl">
                  <p className="inline-block rotate-[-2deg] rounded-full border-[2.5px] border-[#1B1B1B] bg-[#FFE066] px-3 py-1 text-[13px] font-bold">
                    Bêta privée · très bientôt
                  </p>
                  <h1 className="mt-5 font-[family-name:var(--font-v5)] text-[clamp(46px,7.6vw,112px)] leading-[0.9] font-extrabold tracking-[-0.04em] text-[#1B1B1B]">
                    La taxe de séjour,{" "}
                    <span className="relative inline-block">
                      c'est le bazar.
                      <svg viewBox="0 0 300 20" className="absolute -bottom-2 left-0 h-4 w-full" aria-hidden="true">
                        <path
                          d="M3 14 C 60 2, 120 20, 180 8 S 270 6, 297 12"
                          stroke="#FF8A5B"
                          strokeWidth="6"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </h1>
                  <p className="mt-3 rotate-[-1.5deg] font-[family-name:var(--font-v5-hand)] text-[30px] text-[#FF6B3D]">
                    (on sait. on est passés par là.)
                  </p>
                  <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[#1B1B1B]/75">
                    Des délibérations en PDF, des mails en chaîne, des post-it de codes de portail et un tableur que personne n'ose toucher.
                    Attrapez les papiers, secouez-les… puis rangez tout.
                  </p>
                  <button
                    type="button"
                    onClick={sort}
                    className="pointer-events-auto mt-7 rounded-2xl border-[2.5px] border-[#1B1B1B] bg-[#1B1B1B] px-6 py-4 text-[17px] font-extrabold text-white shadow-[5px_5px_0_#FF8A5B] transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#FF8A5B] active:translate-y-0.5 active:shadow-[2px_2px_0_#FF8A5B]"
                  >
                    Tout ranger avec Parnuit ✨
                  </button>
                </motion.div>
              ) : (
                <motion.div key="clean" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                  <p className="inline-block rotate-[-2deg] rounded-full border-[2.5px] border-[#1B1B1B] bg-[#B8F0C2] px-3 py-1 text-[13px] font-bold">
                    Voilà.
                  </p>
                  <h1 className="mt-5 font-[family-name:var(--font-v5)] text-[clamp(46px,7.6vw,112px)] leading-[0.9] font-extrabold tracking-[-0.04em] text-[#1B1B1B]">
                    Votre taxe de séjour, <span className="text-[#FF6B3D]">enfin rangée.</span>
                  </h1>
                  <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#1B1B1B]/75">
                    Chaque établissement a sa fiche : le bon tarif, le bon portail, la bonne date. Et Parnuit vous prévient quand quelque
                    chose change.
                  </p>
                  <a
                    href="#acces"
                    className="pointer-events-auto mt-7 inline-block rounded-2xl border-[2.5px] border-[#1B1B1B] bg-[#FFE066] px-6 py-4 text-[17px] font-extrabold text-[#1B1B1B] shadow-[5px_5px_0_#1B1B1B] transition hover:-translate-y-0.5"
                  >
                    Je veux ma place dans la bêta →
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {sorted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
              animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
              transition={{ type: "spring", stiffness: 140, damping: 14 }}
              className="absolute right-4 bottom-6 left-4 mx-auto max-w-md rounded-[22px] border-[2.5px] border-[#1B1B1B] bg-white p-5 shadow-[6px_6px_0_#1B1B1B] lg:right-[6%] lg:bottom-auto lg:left-auto lg:top-[30%] lg:w-[420px]"
            >
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#1B1B1B]/50">Fiche · Résidence 4★ · Carcassonne</p>
              <ul className="mt-3 divide-y-2 divide-dashed divide-[#1B1B1B]/15 text-[15px]">
                {[
                  ["Tarif 2026", "3,08 € / nuit / pers."],
                  ["Tarif 2027", "3,26 € au 1er janvier"],
                  ["Déclaration", "tous les mois"],
                  ["Reversement", "mensuel depuis le 1er oct."],
                  ["Portail", "carcassonne.taxesejour.fr"],
                ].map(([a, b], i) => (
                  <motion.li
                    key={a}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex justify-between gap-3 py-2"
                  >
                    <span className="font-semibold">{a}</span>
                    <span className="text-right text-[#1B1B1B]/70">{b}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
