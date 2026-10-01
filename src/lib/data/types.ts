export type Tarif = { base: number | null; total: number | null; officiel: boolean };

export type Echeance = {
  frequence: string;
  detail: string;
  extrait: string;
  source: string;
  verification: string;
  observe: string;
} | null;

export type BaseCommune = {
  insee: string;
  nom: string;
  dep: string;
  rang: number;
  hotels: number;
  residences: number;
  campings: number;
  villages: number;
  capacite: number;
  collecteur: { nom: string; type: string; communes: number; site: string; telephone: string; paiement: string };
  portail: { url: string; editeur: string; verification: string; controle: string };
  page: string;
  site_reference: string;
  declaration: Echeance;
  reversement: Echeance;
  tarifs: Record<string, Tarif>;
  tarifs_source: string;
  taxes: number;
  delib: string;
  delib_date: string;
};

/** [nom de la collectivité, taxes additionnelles, tarifs des 9 catégories, date de vote] */
export type Delib = [string, number, (number | null)[], string | null];
/** [insee, nom, département, index de délibération ou -1, hébergements classés, dans la base des 500] */
export type CommuneRow = [string, string, string, number, number, number];

export type France = { source: string; cats: string[]; delibs: Delib[]; communes: CommuneRow[] };
