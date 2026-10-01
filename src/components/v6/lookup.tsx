"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { FREQ_LABEL, MONTH_FULL } from "@/lib/data/calendar";
import { loadBase, loadFrance } from "@/lib/data/load";
import { EDITEURS, euro, factorOf, type Resolved, resolve, searchCommunes, TAXES, TYPES, type TypeKey, typeOf } from "@/lib/data/model";
import type { BaseCommune, CommuneRow, France } from "@/lib/data/types";

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
const frDate = (iso: string | null | undefined) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTH_FULL[m - 1]} ${y}`;
};

function fromBase(b: BaseCommune, type: TypeKey): Resolved {
  return {
    insee: b.insee,
    nom: b.nom,
    dep: b.dep,
    inCatalogue: true,
    documented: true,
    base: b,
    collecteur: b.collecteur.nom,
    flags: b.taxes,
    tarif: b.tarifs[type] ?? null,
    voteDate: b.delib_date,
  };
}

export function Lookup() {
  const [base, setBase] = useState<BaseCommune[] | null>(null);
  const [france, setFrance] = useState<France | null>(null);
  const [insee, setInsee] = useState("64122");
  const [type, setType] = useState<TypeKey>("h3");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    loadBase().then(setBase);
  }, []);
  const warm = () => {
    if (!france) loadFrance().then(setFrance);
  };
  const suggestions = useMemo<CommuneRow[]>(() => (france && query ? searchCommunes(france, query, 6) : []), [france, query]);
  const r = useMemo(() => {
    if (france) return resolve(france, base, insee, type);
    const b = base?.find((c) => c.insee === insee);
    return b ? fromBase(b, type) : null;
  }, [france, base, insee, type]);

  const pick = (row: CommuneRow) => {
    setInsee(row[0]);
    setQuery("");
    setOpen(false);
  };

  const b = r?.base;
  const taxes = r ? TAXES.filter((t) => r.flags & t.bit) : [];
  const showRythme = (e: BaseCommune["declaration"]) => e && e.verification !== "contradictoire" && FREQ_LABEL[e.frequence];

  return (
    <div className="rounded-[28px] border border-[#10202B]/8 bg-white p-5 shadow-[0_30px_80px_-50px_rgba(16,32,43,.5)] sm:p-7">
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <div className="relative">
          <label className="sr-only" htmlFor="v6-commune">
            Commune
          </label>
          <div className="flex items-center gap-2.5 rounded-2xl border border-[#10202B]/15 bg-[#FBF7F2] px-4 py-3.5 focus-within:border-[#E2694A] focus-within:ring-4 focus-within:ring-[#E2694A]/15">
            <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-[#10202B]/40" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8.5 3a5.5 5.5 0 0 1 4.38 8.82l3.65 3.65-1.06 1.06-3.65-3.65A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
              />
            </svg>
            <input
              id="v6-commune"
              value={query}
              placeholder="Tapez une commune où vous avez un établissement…"
              autoComplete="off"
              onFocus={() => {
                warm();
                setOpen(true);
              }}
              onBlur={() => window.setTimeout(() => setOpen(false), 120)}
              onChange={(e) => {
                warm();
                setQuery(e.target.value);
                setOpen(true);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (!suggestions.length) return;
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => (a + 1) % suggestions.length);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  pick(suggestions[active]);
                }
              }}
              className="min-w-0 flex-1 bg-transparent text-[16px] text-[#10202B] outline-none placeholder:text-[#10202B]/40"
            />
            {query && !france && (
              <span className="size-4 animate-spin rounded-full border-2 border-[#10202B]/20 border-t-[#E2694A]" aria-hidden="true" />
            )}
          </div>
          <AnimatePresence>
            {open && suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                aria-label="Communes proposées"
                className="absolute top-full right-0 left-0 z-20 mt-1.5 overflow-hidden rounded-2xl border border-[#10202B]/10 bg-white py-1 shadow-xl"
              >
                {suggestions.map((s, i) => (
                  <li key={s[0]}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pick(s)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[14px] ${i === active ? "bg-[#F7F3EE]" : ""}`}
                    >
                      <span className="truncate text-[#10202B]">
                        {s[1]} <span className="text-[#10202B]/40">({s[2]})</span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${s[5] ? "bg-emerald-50 text-emerald-700" : s[3] >= 0 ? "bg-[#F3ECE4] text-[#10202B]/60" : "bg-[#F3ECE4] text-[#10202B]/40"}`}
                      >
                        {s[5] ? "fiche complète" : s[3] >= 0 ? "tarifs officiels" : "pas de taxe"}
                      </span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
        <label className="sr-only" htmlFor="v6-type">
          Catégorie
        </label>
        <select
          id="v6-type"
          value={type}
          onChange={(e) => setType(e.target.value as TypeKey)}
          className="rounded-2xl border border-[#10202B]/15 bg-[#FBF7F2] px-4 py-3.5 text-[15px] text-[#10202B] outline-none focus:border-[#E2694A]"
        >
          {TYPES.map((t) => (
            <option key={t.k} value={t.k}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <AnimatePresence mode="wait">
        {r ? (
          <motion.div
            key={`${r.insee}-${type}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_1fr]"
          >
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#10202B]/45">
                {typeOf(type).label} · {r.dep}
              </p>
              <h3 className="mt-1 text-[30px] font-extrabold tracking-[-0.03em] text-[#10202B]">{r.nom}</h3>
              <p className="mt-1 text-[14.5px] text-[#10202B]/65">
                {r.collecteur ? (
                  <>
                    Collecté par <strong className="font-semibold text-[#10202B]">{r.collecteur}</strong>
                    {b && b.collecteur.type !== "commune" && (
                      <span className="ml-2 rounded-full bg-[#FBF1EA] px-2 py-0.5 text-[11.5px] font-semibold text-[#C2502F]">
                        intercommunalité
                      </span>
                    )}
                  </>
                ) : (
                  "Aucune taxe de séjour au catalogue national 2026 pour cette commune."
                )}
              </p>
              {r.tarif && (
                <div className="mt-5 rounded-[22px] bg-[#10202B] p-5 text-white">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] text-white/60">Tarif 2026, par personne et par nuit</span>
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/40">
                      {r.tarif.officiel ? "total officiel" : "total calculé"}
                    </span>
                  </div>
                  <p className="mt-2 text-[52px] font-extrabold leading-none tracking-[-0.04em] tabular">{euro(r.tarif.total)}</p>
                  <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-[family-name:var(--font-v6-mono)] text-[12.5px] text-white/70">
                    <span>{euro(r.tarif.base)} voté</span>
                    {taxes.map((t) => (
                      <span key={t.bit}>
                        + {Math.round(t.rate * 100)} % {t.short}
                      </span>
                    ))}
                  </p>
                  {taxes.length > 0 && (
                    <p className="mt-2 text-[12.5px] text-white/50">
                      Soit {Math.round((factorOf(r.flags) - 1) * 100)} % de taxes additionnelles, à collecter et reverser avec la taxe.
                    </p>
                  )}
                </div>
              )}
              {r.voteDate && (
                <p className="mt-2.5 text-[12.5px] text-[#10202B]/50">
                  Délibération votée le {frDate(r.voteDate)} · catalogue DGFiP des délibérations
                </p>
              )}
            </div>
            <div className="space-y-3">
              {b ? (
                <>
                  {b.portail.url && (
                    <a
                      href={b.portail.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-[#10202B]/10 p-4 transition hover:border-[#E2694A]"
                    >
                      <span className="min-w-0">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#10202B]/45">Où déclarer</span>
                        <span className="mt-1 block truncate text-[15px] font-semibold text-[#10202B]">{host(b.portail.url)}</span>
                        <span className="block text-[12.5px] text-[#10202B]/50">Portail {EDITEURS[b.portail.editeur] ?? ""}</span>
                      </span>
                      <span className="text-[18px] text-[#E2694A] transition group-hover:translate-x-0.5">↗</span>
                    </a>
                  )}
                  {(showRythme(b.declaration) || showRythme(b.reversement)) && (
                    <div className="rounded-2xl border border-[#10202B]/10 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#10202B]/45">Quand déclarer et reverser</p>
                      {[["Déclaration", b.declaration] as const, ["Reversement", b.reversement] as const].map(([label, e]) =>
                        showRythme(e) && e ? (
                          <p key={label} className="mt-2 text-[14px] text-[#10202B]">
                            <strong className="font-semibold">{label}</strong> · {FREQ_LABEL[e.frequence]}
                            {e.detail ? <span className="text-[#10202B]/60">, {e.detail}</span> : null}
                          </p>
                        ) : null,
                      )}
                      <p className="mt-2 text-[11.5px] text-[#10202B]/45">
                        Source : {host(b.declaration?.source || b.portail.url)} · relevé le{" "}
                        {frDate(b.declaration?.observe || b.portail.controle)}
                      </p>
                    </div>
                  )}
                  {b.collecteur.paiement && (
                    <div className="flex flex-wrap gap-1.5">
                      {b.collecteur.paiement
                        .split(";")
                        .slice(0, 4)
                        .map((p) => (
                          <span key={p} className="rounded-full bg-[#F3ECE4] px-2.5 py-1 text-[12px] text-[#10202B]/70">
                            {p.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                </>
              ) : r.inCatalogue ? (
                <div className="rounded-2xl border border-dashed border-[#10202B]/20 p-5 text-[14px] leading-relaxed text-[#10202B]/65">
                  <strong className="block text-[#10202B]">Tarifs officiels disponibles.</strong>
                  Le portail, le collecteur et le calendrier de cette commune sont documentés dans votre diagnostic, en priorité.
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : (
          <div className="mt-6 h-40 animate-pulse rounded-[22px] bg-[#F3ECE4]" />
        )}
      </AnimatePresence>
      <p className="mt-5 text-[12.5px] text-[#10202B]/45">
        Les fiches des 500 communes documentées sont vérifiées une à une avant l'ouverture de la bêta.
      </p>
    </div>
  );
}
