import type { Metadata } from "next";
import { connection } from "next/server";
import { listLeads, storageReady } from "@/lib/leads";

export const metadata: Metadata = { title: "Demandes", robots: { index: false, follow: false } };

const date = (iso: string) => new Date(iso).toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "short", timeStyle: "short" });

export default async function DemandesPage() {
  await connection();
  const leads = storageReady() ? await listLeads() : [];
  return (
    <main className="min-h-screen bg-[#FAF8F4] px-5 py-10 font-sans text-[#10202B] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-[32px] font-bold tracking-[-0.03em]">Demandes reçues</h1>
        <p className="mt-1 text-[14px] text-[#10202B]/55">
          {storageReady()
            ? `${leads.length} demande${leads.length > 1 ? "s" : ""}, la plus récente en premier.`
            : "Stockage non configuré (BLOB_READ_WRITE_TOKEN)."}
        </p>
        <div className="mt-8 space-y-3">
          {leads.map((l) => (
            <article key={l.id} className="rounded-2xl border border-[#10202B]/10 bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="text-[17px] font-semibold">
                  {l.organisation || "Sans organisation"} <span className="font-normal text-[#10202B]/50">· {l.etablissements}</span>
                </p>
                <p className="text-[13px] text-[#10202B]/50">
                  {date(l.at)} · {l.version}
                  {l.source ? `, source « ${l.source} »` : ""}
                </p>
              </div>
              <p className="mt-1 text-[14.5px]">
                <a className="font-medium text-[#E2694A] underline" href={`mailto:${l.email}`}>
                  {l.email}
                </a>
                {l.role ? <span className="text-[#10202B]/55"> · {l.role}</span> : null}
              </p>
              {l.message && (
                <p className="mt-3 whitespace-pre-wrap rounded-xl bg-[#F7F3EE] p-3 text-[14px] text-[#10202B]/80">{l.message}</p>
              )}
              {l.fichier && (
                <a
                  className="mt-3 inline-block rounded-lg bg-[#10202B] px-3 py-2 text-[13px] font-medium text-white"
                  href={`/demandes/fichier?p=${encodeURIComponent(l.fichier.chemin)}`}
                >
                  Télécharger {l.fichier.nom} ({Math.max(1, Math.round(l.fichier.taille / 1024))} Ko)
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
