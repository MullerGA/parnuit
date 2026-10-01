import "server-only";
import { get, list, put } from "@vercel/blob";

export type Lead = {
  id: string;
  at: string;
  email: string;
  organisation: string;
  etablissements: string;
  role: string;
  message: string;
  version: string;
  source: string;
  fichier?: { nom: string; chemin: string; taille: number };
};

export const storageReady = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

export async function saveLead(lead: Lead, file?: File | null) {
  if (file && file.size > 0) {
    const chemin = `demandes/${lead.id}/${slug(file.name) || "liste"}`;
    await put(chemin, file, { access: "private", addRandomSuffix: false, contentType: file.type || "application/octet-stream" });
    lead.fichier = { nom: file.name, chemin, taille: file.size };
  }
  await put(`demandes/${lead.id}.json`, JSON.stringify(lead, null, 2), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
  });
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  const out: Lead[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "demandes/", cursor, limit: 1000 });
    for (const b of page.blobs) {
      if (!b.pathname.endsWith(".json") || b.pathname.split("/").length !== 2) continue;
      const res = await get(b.pathname, { access: "private", useCache: false });
      if (!res || res.statusCode !== 200) continue;
      try {
        out.push(JSON.parse(await new Response(res.stream).text()) as Lead);
      } catch {
        // fichier illisible ignoré
      }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out.sort((a, b) => b.at.localeCompare(a.at));
}

export async function readLeadFile(chemin: string) {
  if (!chemin.startsWith("demandes/") || chemin.includes("..")) return null;
  return get(chemin, { access: "private", useCache: false });
}
