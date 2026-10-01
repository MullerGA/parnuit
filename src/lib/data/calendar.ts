import type { Echeance } from "./types";

export type Deadline = {
  date: Date;
  exact: boolean;
  nature: "declaration" | "reversement";
};

const MONTHS = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre"];
export const MONTH_LABELS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
export const MONTH_FULL = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

const STEP: Record<string, number> = { mensuelle: 1, trimestrielle: 3, quadrimestrielle: 4, semestrielle: 6, annuelle: 12 };
const DEFAULT_MONTHS: Record<string, number[]> = {
  mensuelle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  trimestrielle: [0, 3, 6, 9],
  quadrimestrielle: [0, 4, 8],
  semestrielle: [0, 6],
  annuelle: [0],
};

const M = "(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)";
const DATE = new RegExp(`(\\d{1,2})(?:er|°)?\\s+${M}`, "g");
const RANGE = new RegExp(`du\\s+\\d{1,2}(?:er|°)?\\s+${M}(?:\\s+\\d{4})?\\s+au\\s+\\d{1,2}(?:er|°)?\\s+${M}(?:\\s+\\d{4})?`, "g");

const strip = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/** Retire les périodes couvertes pour ne garder que les dates limites. */
export function deadlineText(e: NonNullable<Echeance>) {
  return strip(`${e.detail} ${e.extrait}`)
    .replace(/\([^)]*\)/g, " ")
    .replace(RANGE, " ")
    .replace(/\d{1,2}\/\d{1,2}\/\d{2,4}/g, " ")
    .replace(/a compter du\s+\d{1,2}(?:er|°)?\s+\w+(?:\s+\d{4})?/g, " ");
}

export function deadlines(e: Echeance, nature: Deadline["nature"], from: Date, to: Date): Deadline[] {
  if (!e) return [];
  const step = STEP[e.frequence];
  if (!step) return [];
  const text = deadlineText(e);
  const byMonth = new Map<number, number>();
  for (const m of text.matchAll(DATE)) {
    const day = Number(m[1]);
    const month = MONTHS.indexOf(m[2]);
    if (day >= 1 && day <= 31 && !byMonth.has(month)) byMonth.set(month, day);
  }
  const explicit = [...byMonth.entries()].map(([m, d]) => ({ m, d }));
  const monthlyDay = text.match(/(?:le|au)\s+(\d{1,2})\s+du\s+mois\s+suivant/);
  let months: { m: number; d: number | null }[];
  if (step === 1) {
    const d = monthlyDay ? Number(monthlyDay[1]) : null;
    months = DEFAULT_MONTHS.mensuelle.map((m) => ({ m, d }));
  } else if (explicit.length >= 12 / step) {
    months = explicit;
  } else if (explicit.length >= 1) {
    const first = explicit[0];
    months = Array.from({ length: 12 / step }, (_, i) => ({ m: (first.m + i * step) % 12, d: first.d }));
  } else {
    const d = monthlyDay ? Number(monthlyDay[1]) : null;
    months = DEFAULT_MONTHS[e.frequence].map((m) => ({ m, d }));
  }
  const out: Deadline[] = [];
  const seen = new Set<string>();
  for (let y = from.getFullYear(); y <= to.getFullYear(); y++) {
    for (const { m, d } of months) {
      const last = new Date(y, m + 1, 0).getDate();
      const date = new Date(y, m, d ? Math.min(d, last) : 15);
      const key = `${y}-${m}`;
      if (date < from || date > to || seen.has(key)) continue;
      seen.add(key);
      out.push({ date, exact: d != null, nature });
    }
  }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export const formatDeadline = (d: Deadline) =>
  d.exact ? `${d.date.getDate()} ${MONTH_LABELS[d.date.getMonth()]}` : `courant ${MONTH_LABELS[d.date.getMonth()]}`;

export const FREQ_LABEL: Record<string, string> = {
  mensuelle: "Mensuelle",
  trimestrielle: "Trimestrielle",
  quadrimestrielle: "Quadrimestrielle",
  semestrielle: "Semestrielle",
  annuelle: "Annuelle",
  autre: "Selon la collectivité",
};
