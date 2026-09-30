import type { BaseCommune, CommuneRow, France, Tarif } from "./types";

export type TypeKey = "palace" | "h5" | "h4" | "h3" | "h2" | "h1" | "r5" | "r4" | "r3" | "r2" | "r1" | "v45" | "v13" | "c35" | "c12";

export const TYPES: { k: TypeKey; label: string; short: string; cat: number; famille: string }[] = [
  { k: "h4", label: "Hôtel 4★", short: "Hôtel 4★", cat: 3, famille: "Hôtel" },
  { k: "h3", label: "Hôtel 3★", short: "Hôtel 3★", cat: 4, famille: "Hôtel" },
  { k: "h5", label: "Hôtel 5★", short: "Hôtel 5★", cat: 2, famille: "Hôtel" },
  { k: "h2", label: "Hôtel 2★", short: "Hôtel 2★", cat: 5, famille: "Hôtel" },
  { k: "h1", label: "Hôtel 1★", short: "Hôtel 1★", cat: 6, famille: "Hôtel" },
  { k: "palace", label: "Palace", short: "Palace", cat: 1, famille: "Hôtel" },
  { k: "r4", label: "Résidence de tourisme 4★", short: "Résidence 4★", cat: 3, famille: "Résidence" },
  { k: "r3", label: "Résidence de tourisme 3★", short: "Résidence 3★", cat: 4, famille: "Résidence" },
  { k: "r5", label: "Résidence de tourisme 5★", short: "Résidence 5★", cat: 2, famille: "Résidence" },
  { k: "r2", label: "Résidence de tourisme 2★", short: "Résidence 2★", cat: 5, famille: "Résidence" },
  { k: "r1", label: "Résidence de tourisme 1★", short: "Résidence 1★", cat: 6, famille: "Résidence" },
  { k: "c35", label: "Camping 3 à 5★", short: "Camping 3-5★", cat: 7, famille: "Camping" },
  { k: "c12", label: "Camping 1 ou 2★", short: "Camping 1-2★", cat: 8, famille: "Camping" },
  { k: "v45", label: "Village de vacances 4 ou 5★", short: "Village 4-5★", cat: 5, famille: "Village" },
  { k: "v13", label: "Village de vacances 1 à 3★", short: "Village 1-3★", cat: 6, famille: "Village" },
];

export const typeOf = (k: TypeKey) => TYPES.find((t) => t.k === k) ?? TYPES[0];

export const TAXES = [
  { bit: 1, rate: 0.1, label: "Taxe additionnelle départementale", short: "Département" },
  { bit: 2, rate: 0.15, label: "Taxe additionnelle régionale (Société des grands projets)", short: "Grand Paris" },
  { bit: 4, rate: 0.34, label: "Taxe additionnelle « lignes à grande vitesse »", short: "LGV" },
  { bit: 8, rate: 2, label: "Taxe additionnelle Île-de-France Mobilités", short: "IDF Mobilités" },
];

export const factorOf = (flags: number) => 1 + TAXES.reduce((s, t) => s + (flags & t.bit ? t.rate : 0), 0);

export function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[-'’]/g, " ")
    .replace(/\bst\b/g, "saint")
    .replace(/\bste\b/g, "sainte")
    .replace(/\s+/g, " ")
    .trim();
}

type Indexed = { row: CommuneRow; n: string };
const indexCache = new WeakMap<France, Indexed[]>();

export function searchCommunes(fr: France, query: string, limit = 7): CommuneRow[] {
  const q = normalize(query);
  if (q.length < 2) return [];
  let idx = indexCache.get(fr);
  if (!idx) {
    idx = fr.communes.map((row) => ({ row, n: normalize(row[1]) }));
    indexCache.set(fr, idx);
  }
  const scored: { row: CommuneRow; s: number }[] = [];
  for (const it of idx) {
    let s = -1;
    if (it.n === q) s = 3;
    else if (it.n.startsWith(q)) s = 2;
    else if (it.n.includes(` ${q}`)) s = 1;
    else if (/^\d{2,5}$/.test(q) && it.row[0].startsWith(q)) s = 1.5;
    if (s < 0) continue;
    scored.push({ row: it.row, s: s + Math.min(it.row[4], 400) / 400 + it.row[5] * 0.5 });
  }
  scored.sort((a, b) => b.s - a.s || a.row[1].length - b.row[1].length);
  return scored.slice(0, limit).map((x) => x.row);
}

export type Resolved = {
  insee: string;
  nom: string;
  dep: string;
  inCatalogue: boolean;
  documented: boolean;
  base?: BaseCommune;
  collecteur: string;
  flags: number;
  tarif: Tarif | null;
  voteDate: string | null;
};

export function resolve(fr: France, base: BaseCommune[] | null, insee: string, type: TypeKey): Resolved | null {
  const row = fr.communes.find((c) => c[0] === insee);
  if (!row) return null;
  const b = base?.find((c) => c.insee === insee);
  const d = row[3] >= 0 ? fr.delibs[row[3]] : null;
  const flags = d ? d[1] : 0;
  let tarif: Tarif | null = b?.tarifs[type] ?? null;
  if (!tarif && d) {
    const base = d[2][typeOf(type).cat - 1];
    if (base != null) tarif = { base, total: Math.round(base * factorOf(flags) * 100) / 100, officiel: false };
  }
  return {
    insee,
    nom: row[1],
    dep: row[2],
    inCatalogue: row[3] >= 0,
    documented: Boolean(b),
    base: b,
    collecteur: b?.collecteur.nom || (d ? d[0] : ""),
    flags,
    tarif,
    voteDate: d ? d[3] : null,
  };
}

export const EDITEURS: Record<string, string> = {
  nouveaux_territoires: "Nouveaux Territoires",
  "3d_ouest": "3D Ouest",
  nexpublica: "Nexpublica",
  aloa: "Aloa",
  collectivite: "Site de la collectivité",
  autre: "Autre éditeur",
};

export const euro = (n: number | null | undefined, digits = 2) =>
  n == null ? "—" : `${n.toLocaleString("fr-FR", { minimumFractionDigits: digits, maximumFractionDigits: digits })} €`;

export const int = (n: number) => n.toLocaleString("fr-FR");
