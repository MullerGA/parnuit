"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type Deadline, deadlines, FREQ_LABEL, formatDeadline, MONTH_FULL, MONTH_LABELS } from "@/lib/data/calendar";
import { loadBase, loadFrance } from "@/lib/data/load";
import { EDITEURS, euro, factorOf, normalize, resolve, searchCommunes, TAXES, TYPES, type TypeKey, typeOf } from "@/lib/data/model";
import type { BaseCommune, CommuneRow, France } from "@/lib/data/types";

type Item = { id: string; insee: string; type: TypeKey };

const FROM = new Date(2026, 9, 1);
const TO = new Date(2027, 2, 31);
const MONTHS = [9, 10, 11, 0, 1, 2].map((m, i) => ({ m, y: i < 3 ? 2026 : 2027 }));

const START: [string, TypeKey][] = [
  ["Paris", "h4"],
  ["Nice", "h3"],
  ["Argelès-sur-Mer", "c35"],
];
const AUTOPLAY: [string, string, TypeKey][] = [
  ["Carcass", "Carcassonne", "r4"],
  ["Chamo", "Chamonix-Mont-Blanc", "r3"],
  ["Saint-Ma", "Saint-Malo", "h3"],
];

let uid = 0;
const nextId = () => `e${++uid}`;

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

export function ParcDemo() {
  const [base, setBase] = useState<BaseCommune[] | null>(null);
  const [france, setFrance] = useState<France | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"calendrier" | "fiche">("calendrier");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeKey>("h4");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [typing, setTyping] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    loadBase().then((b) => {
      setBase(b);
      const start = START.map(([nom, t]) => {
        const c = b.find((x) => x.nom === nom);
        return c ? { id: nextId(), insee: c.insee, type: t } : null;
      }).filter(Boolean) as Item[];
      setItems(start);
      setSelected(start[0]?.id ?? null);
    });
    loadFrance().then(setFrance);
  }, []);

  const stopAuto = useCallback(() => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
    setAuto(false);
    setTyping(false);
  }, []);

  // Démonstration qui se remplit seule lorsque la maquette devient visible.
  useEffect(() => {
    if (!auto || !base || !france || !rootRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = rootRef.current;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      let t = 900;
      const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
      AUTOPLAY.forEach(([typed, nom, ty], k) => {
        at(t, () => {
          setTyping(true);
          setType(ty);
          setOpen(true);
        });
        for (let i = 1; i <= typed.length; i++) {
          t += reduce ? 10 : 95;
          const q = typed.slice(0, i);
          at(t, () => {
            setQuery(q);
            setActive(0);
          });
        }
        t += 650;
        at(t, () => {
          const c = base.find((x) => x.nom === nom);
          if (c) {
            const id = nextId();
            setItems((prev) => [...prev, { id, insee: c.insee, type: ty }]);
            setSelected(id);
            if (k === AUTOPLAY.length - 1) setTab("fiche");
          }
          setQuery("");
          setOpen(false);
        });
        t += 1300;
      });
      at(t, () => {
        setTyping(false);
        setAuto(false);
      });
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) run();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [auto, base, france]);

  useEffect(
    () => () => {
      for (const t of timers.current) window.clearTimeout(t);
    },
    [],
  );

  const suggestions = useMemo<CommuneRow[]>(() => (france && query ? searchCommunes(france, query, 6) : []), [france, query]);

  const rows = useMemo(() => {
    if (!base) return [];
    return items
      .map((it) => {
        const r = france ? resolve(france, base, it.insee, it.type) : fromBase(base, it.insee, it.type);
        return r ? { it, r } : null;
      })
      .filter(Boolean) as { it: Item; r: NonNullable<ReturnType<typeof resolve>> }[];
  }, [items, base, france]);

  const events = useMemo(() => {
    const out: { id: string; d: Deadline; nom: string }[] = [];
    for (const { it, r } of rows) {
      if (!r.base) continue;
      for (const d of deadlines(r.base.declaration, "declaration", FROM, TO)) out.push({ id: it.id, d, nom: r.nom });
      for (const d of deadlines(r.base.reversement, "reversement", FROM, TO)) out.push({ id: it.id, d, nom: r.nom });
    }
    return out.sort((a, b) => a.d.date.getTime() - b.d.date.getTime());
  }, [rows]);

  const collecteurs = new Set(rows.map((x) => x.r.collecteur).filter(Boolean)).size;
  const editeurs = new Set(rows.map((x) => x.r.base?.portail.editeur).filter(Boolean)).size;
  const rythmes = new Set(rows.map((x) => x.r.base?.declaration?.frequence).filter(Boolean)).size;
  const next = events.find((e) => e.d.exact) ?? events[0];
  const current = rows.find((x) => x.it.id === selected) ?? rows[rows.length - 1];

  const add = (row: CommuneRow) => {
    const id = nextId();
    setItems((prev) => [...prev, { id, insee: row[0], type }]);
    setSelected(id);
    setTab("fiche");
    setQuery("");
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      add(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      onPointerDown={() => auto && stopAuto()}
      className="relative overflow-hidden rounded-[22px] border border-[#142631]/10 bg-white shadow-[0_1px_0_rgba(20,38,49,.04),0_30px_80px_-30px_rgba(20,38,49,.35)]"
    >
      <div className="flex items-center gap-3 border-b border-[#142631]/8 bg-[#FBFAF8] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="size-2.5 rounded-full bg-[#E4E1DA]" />
          <i className="size-2.5 rounded-full bg-[#E4E1DA]" />
          <i className="size-2.5 rounded-full bg-[#E4E1DA]" />
        </span>
        <span className="mx-auto hidden rounded-md bg-[#142631]/[.04] px-3 py-1 font-mono text-[11px] text-[#142631]/60 sm:inline">
          app.parnuit.fr/mon-parc
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#2F7D5B]">
          <span className="size-1.5 animate-pulse rounded-full bg-[#2F7D5B]" /> Données réelles
        </span>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr]">
        {/* Colonne parc */}
        <div className="border-b border-[#142631]/8 lg:border-r lg:border-b-0">
          <div className="p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[13px] font-semibold text-[#142631]">Mon parc</h3>
              <span className="font-mono text-[11px] text-[#142631]/50">{rows.length} établissements</span>
            </div>
            <div className="relative mt-3">
              <div
                className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2 transition ${typing ? "border-[#D57753] ring-4 ring-[#D57753]/15" : "border-[#142631]/15 focus-within:border-[#142631]/40"}`}
              >
                <svg viewBox="0 0 20 20" className="size-4 shrink-0 text-[#142631]/40" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M8.5 3a5.5 5.5 0 0 1 4.38 8.82l3.65 3.65-1.06 1.06-3.65-3.65A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    if (auto) stopAuto();
                    setQuery(e.target.value);
                    setOpen(true);
                    setActive(0);
                  }}
                  onFocus={() => {
                    if (auto) stopAuto();
                    setOpen(true);
                  }}
                  onBlur={() => window.setTimeout(() => setOpen(false), 120)}
                  onKeyDown={onKey}
                  aria-label="Ajouter un établissement : commune"
                  placeholder="Ajoutez une commune…"
                  className="min-w-0 flex-1 bg-transparent text-[14px] text-[#142631] outline-none placeholder:text-[#142631]/35"
                />
                {typing && <span className="h-4 w-px animate-pulse bg-[#D57753]" aria-hidden="true" />}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <label className="sr-only" htmlFor="demo-type">
                  Type d'établissement
                </label>
                <select
                  id="demo-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as TypeKey)}
                  className="flex-1 rounded-lg border border-[#142631]/12 bg-[#FBFAF8] px-2.5 py-1.5 text-[12.5px] text-[#142631] outline-none"
                >
                  {TYPES.map((t) => (
                    <option key={t.k} value={t.k}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <span className="font-mono text-[10.5px] text-[#142631]/45">34 969 communes</span>
              </div>
              <AnimatePresence>
                {open && suggestions.length > 0 && (
                  <motion.ul
                    id="demo-suggestions"
                    aria-label="Communes proposées"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-[46px] right-0 left-0 z-20 overflow-hidden rounded-xl border border-[#142631]/10 bg-white py-1 shadow-xl"
                  >
                    {suggestions.map((s, i) => (
                      <li key={s[0]}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => add(s)}
                          onMouseEnter={() => setActive(i)}
                          className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13px] ${i === active ? "bg-[#142631]/[.05]" : ""}`}
                        >
                          <span className="truncate text-[#142631]">
                            {highlight(s[1], query)} <span className="text-[#142631]/40">({s[2]})</span>
                          </span>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] ${s[5] ? "bg-[#2F7D5B]/10 text-[#2F7D5B]" : s[3] >= 0 ? "bg-[#142631]/5 text-[#142631]/60" : "bg-[#142631]/5 text-[#142631]/35"}`}
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
          </div>

          <ul className="max-h-[420px] overflow-y-auto border-t border-[#142631]/8 no-scrollbar">
            <AnimatePresence initial={false}>
              {rows.map(({ it, r }) => (
                <motion.li
                  key={it.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(it.id);
                      setTab("fiche");
                    }}
                    className={`flex w-full items-center gap-3 border-b border-[#142631]/6 px-4 py-3 text-left transition ${current?.it.id === it.id ? "bg-[#F4F1EA]" : "hover:bg-[#FBFAF8]"}`}
                  >
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-lg text-[11px] font-bold ${famColor(typeOf(it.type).famille)}`}
                    >
                      {typeOf(it.type).famille.slice(0, 1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium text-[#142631]">{r.nom}</span>
                      <span className="block truncate text-[11.5px] text-[#142631]/55">
                        {typeOf(it.type).short} · {r.collecteur || "Pas de collecteur au catalogue"}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-mono text-[13px] font-medium text-[#142631] tabular">
                        {r.tarif ? euro(r.tarif.total) : "—"}
                      </span>
                      <span className="block text-[10px] text-[#142631]/40">par nuit/pers.</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Retirer ${r.nom}`}
                    onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))}
                    className="absolute top-1 right-1 hidden size-5 place-items-center rounded-full bg-white text-[12px] text-[#142631]/50 shadow group-hover:grid"
                  >
                    ×
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
            {!base &&
              ["sk-a", "sk-b", "sk-c"].map((k) => (
                <li key={k} className="flex items-center gap-3 border-b border-[#142631]/6 px-4 py-3">
                  <span className="size-8 animate-pulse rounded-lg bg-[#142631]/5" />
                  <span className="h-3 flex-1 animate-pulse rounded bg-[#142631]/5" />
                </li>
              ))}
          </ul>
        </div>

        {/* Colonne résultat */}
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-px border-b border-[#142631]/8 bg-[#142631]/8 sm:grid-cols-4">
            <Kpi label="Collecteurs" value={collecteurs} />
            <Kpi label="Éditeurs de portail" value={editeurs} />
            <Kpi label="Rythmes de déclaration" value={rythmes} />
            <Kpi label="Échéances d'ici mars" value={events.length} accent />
          </div>
          <div className="flex items-center justify-between gap-3 px-4 pt-3 sm:px-5">
            <div className="flex rounded-lg bg-[#142631]/[.05] p-0.5 text-[12.5px]" role="tablist">
              {(["calendrier", "fiche"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-3 py-1.5 font-medium transition ${tab === t ? "bg-white text-[#142631] shadow-sm" : "text-[#142631]/55 hover:text-[#142631]"}`}
                >
                  {t === "fiche" ? "Fiche établissement" : "Calendrier du parc"}
                </button>
              ))}
            </div>
            {next && (
              <p className="hidden text-right text-[12px] text-[#142631]/60 md:block">
                Prochaine : <strong className="font-semibold text-[#142631]">{formatDeadline(next.d)}</strong> · {next.nom}
              </p>
            )}
          </div>

          <div className="p-4 sm:p-5">
            <AnimatePresence mode="wait">
              {tab === "calendrier" ? (
                <motion.div
                  key="cal"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <CalendarGrid
                    rows={rows}
                    events={events}
                    onPick={(id) => {
                      setSelected(id);
                      setTab("fiche");
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`fiche-${current?.it.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {current ? (
                    <Fiche it={current.it} r={current.r} />
                  ) : (
                    <p className="text-sm text-[#142631]/50">Ajoutez un établissement.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function fromBase(base: BaseCommune[], insee: string, type: TypeKey) {
  const b = base.find((c) => c.insee === insee);
  if (!b) return null;
  return {
    insee,
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

function highlight(name: string, q: string) {
  const n = normalize(name);
  const i = n.indexOf(normalize(q));
  if (i < 0 || !q) return name;
  const len = normalize(q).length;
  return (
    <>
      {name.slice(0, i)}
      <mark className="bg-transparent font-semibold text-[#142631]">{name.slice(i, i + len)}</mark>
      {name.slice(i + len)}
    </>
  );
}

const famColor = (f: string) =>
  ({
    Hôtel: "bg-[#142631] text-[#F2E9D9]",
    Résidence: "bg-[#D57753] text-white",
    Camping: "bg-[#2F7D5B] text-white",
    Village: "bg-[#E9B949] text-[#142631]",
  })[f] ?? "bg-[#142631] text-white";

function Kpi({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="bg-white px-4 py-3 sm:px-5">
      <motion.div
        key={value}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`font-mono text-[22px] font-semibold tabular ${accent ? "text-[#D57753]" : "text-[#142631]"}`}
      >
        {value}
      </motion.div>
      <div className="text-[11px] text-[#142631]/55">{label}</div>
    </div>
  );
}

function CalendarGrid({
  rows,
  events,
  onPick,
}: {
  rows: { it: Item; r: NonNullable<ReturnType<typeof resolve>> }[];
  events: { id: string; d: Deadline; nom: string }[];
  onPick: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="min-w-[620px]">
        <div className="grid grid-cols-[150px_repeat(6,1fr)] border-b border-[#142631]/10 pb-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#142631]/45">
          <span>Établissement</span>
          {MONTHS.map(({ m, y }) => (
            <span key={`${y}-${m}`} className="text-center">
              {MONTH_LABELS[m]} {m === 0 || m === 9 ? `${String(y).slice(2)}` : ""}
            </span>
          ))}
        </div>
        {rows.map(({ it, r }, ri) => {
          const mine = events.filter((e) => e.id === it.id);
          return (
            <button
              type="button"
              key={it.id}
              onClick={() => onPick(it.id)}
              className="grid w-full grid-cols-[150px_repeat(6,1fr)] items-center border-b border-[#142631]/6 py-2.5 text-left hover:bg-[#FBFAF8]"
            >
              <span className="min-w-0 pr-2">
                <span className="block truncate text-[12.5px] font-medium text-[#142631]">{r.nom}</span>
                <span className="block truncate text-[10.5px] text-[#142631]/45">
                  {r.base?.declaration
                    ? (FREQ_LABEL[r.base.declaration.frequence] ?? "—")
                    : r.documented
                      ? "Rythme à confirmer"
                      : "Calendrier à venir"}
                </span>
              </span>
              {MONTHS.map(({ m, y }) => {
                const here = mine.filter((e) => e.d.date.getMonth() === m && e.d.date.getFullYear() === y);
                return (
                  <span key={`${y}-${m}`} className="flex min-h-7 flex-wrap items-center justify-center gap-1">
                    {here.map((e, k) => (
                      <motion.span
                        key={`${e.d.nature}-${k}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.05 * ri + 0.04 * k, type: "spring", stiffness: 420, damping: 22 }}
                        title={`${e.d.nature === "declaration" ? "Déclaration" : "Reversement"} · ${formatDeadline(e.d)}`}
                        className={
                          e.d.nature === "declaration"
                            ? "rounded-full bg-[#D57753] px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-white"
                            : "rounded-[4px] bg-[#142631] px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-[#F2E9D9]"
                        }
                      >
                        {e.d.exact ? e.d.date.getDate() : "•"}
                      </motion.span>
                    ))}
                  </span>
                );
              })}
            </button>
          );
        })}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#142631]/55">
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full bg-[#D57753]" /> Déclaration
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-[3px] bg-[#142631]" /> Reversement
          </span>
          <span>Chiffre : jour limite indiqué par la source · « • » : au cours du mois</span>
        </div>
      </div>
    </div>
  );
}

function Fiche({ it, r }: { it: Item; r: NonNullable<ReturnType<typeof resolve>> }) {
  const t = typeOf(it.type);
  const b = r.base;
  const f = factorOf(r.flags);
  const taxes = TAXES.filter((x) => r.flags & x.bit);
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
      <div>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#142631]/45">
          {t.label} · {r.dep}
        </p>
        <h4 className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-[#142631]">{r.nom}</h4>
        <p className="mt-1 text-[13px] text-[#142631]/65">
          {r.collecteur ? (
            <>
              Collecté par <strong className="font-medium text-[#142631]">{r.collecteur}</strong>
              {b && b.collecteur.type !== "commune" ? " (intercommunalité)" : ""}
            </>
          ) : (
            "Aucune taxe de séjour au catalogue national 2026."
          )}
        </p>

        {r.tarif && (
          <div className="mt-4 rounded-2xl bg-[#142631] p-4 text-[#F2E9D9]">
            <div className="flex items-baseline justify-between">
              <span className="text-[12px] text-[#F2E9D9]/65">Tarif 2026 par personne et par nuit</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#F2E9D9]/45">
                {r.tarif.officiel ? "total officiel" : "total calculé"}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[13px] text-[#F2E9D9]/80">
              <span>{euro(r.tarif.base)} voté</span>
              {taxes.map((x) => (
                <span key={x.bit} className="whitespace-nowrap">
                  + {Math.round(x.rate * 100)} % {x.short}
                </span>
              ))}
            </div>
            <motion.div
              key={r.tarif.total}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-[40px] font-semibold leading-none tracking-[-0.03em] tabular"
            >
              {euro(r.tarif.total)}
            </motion.div>
            {taxes.length > 0 && (
              <p className="mt-2 text-[11.5px] text-[#F2E9D9]/55">
                Soit {Math.round((f - 1) * 100)} % de taxes additionnelles, que l'hébergeur collecte et reverse avec la taxe.
              </p>
            )}
          </div>
        )}
        {!r.tarif && r.inCatalogue && (
          <p className="mt-4 rounded-xl bg-[#F4F1EA] p-3 text-[13px] text-[#142631]/70">
            Pas de tarif au catalogue pour cette catégorie dans cette commune.
          </p>
        )}
        {r.voteDate && (
          <p className="mt-2 text-[11.5px] text-[#142631]/50">
            Délibération votée le {frDate(r.voteDate)} · catalogue DGFiP des délibérations
          </p>
        )}
      </div>

      <div className="space-y-3">
        {b ? (
          <>
            <Block title="Où déclarer">
              {b.portail.url ? (
                <a
                  href={b.portail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2 rounded-lg border border-[#142631]/10 px-3 py-2 hover:border-[#142631]/30"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-[#142631]">{host(b.portail.url)}</span>
                    <span className="block text-[11px] text-[#142631]/50">Portail {EDITEURS[b.portail.editeur] ?? ""}</span>
                  </span>
                  <span className="text-[#D57753] transition group-hover:translate-x-0.5">↗</span>
                </a>
              ) : (
                <p className="text-[13px] text-[#142631]/60">Page officielle de la collectivité</p>
              )}
            </Block>
            <Block title="Quand déclarer et reverser">
              <Line label="Déclaration" e={b.declaration} />
              <Line label="Reversement" e={b.reversement} />
            </Block>
            {b.collecteur.paiement && (
              <Block title="Paiement accepté">
                <div className="flex flex-wrap gap-1.5">
                  {b.collecteur.paiement
                    .split(";")
                    .slice(0, 4)
                    .map((p) => (
                      <span key={p} className="rounded-full bg-[#142631]/[.05] px-2 py-0.5 text-[11.5px] text-[#142631]/75">
                        {p.trim()}
                      </span>
                    ))}
                </div>
              </Block>
            )}
          </>
        ) : r.inCatalogue ? (
          <div className="rounded-xl border border-dashed border-[#142631]/20 p-4 text-[13px] leading-relaxed text-[#142631]/65">
            <strong className="block font-semibold text-[#142631]">Tarifs officiels disponibles.</strong>
            Le portail et le calendrier de cette commune sont en cours de documentation. Les 500 communes les plus touristiques sont déjà
            prêtes ; demandez l'accès bêta pour que la vôtre passe en priorité.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#142631]/8 p-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#142631]/45">{title}</p>
      {children}
    </div>
  );
}

function Line({ label, e }: { label: string; e: BaseCommune["declaration"] }) {
  if (!e) return <p className="text-[12.5px] text-[#142631]/50">{label} : à confirmer auprès de la collectivité</p>;
  return (
    <div className="mb-2 last:mb-0">
      <p className="text-[12.5px] text-[#142631]">
        <strong className="font-semibold">{label}</strong> · {FREQ_LABEL[e.frequence] ?? e.frequence}
        {e.detail ? `, ${e.detail}` : ""}
      </p>
      {e.extrait && (
        <p className="mt-1 line-clamp-2 border-l-2 border-[#D57753]/50 pl-2 text-[11.5px] italic text-[#142631]/55">« {e.extrait} »</p>
      )}
      {e.source && (
        <p className="mt-0.5 text-[10.5px] text-[#142631]/40">
          Source : {host(e.source)} · relevé le {frDate(e.observe)}
        </p>
      )}
    </div>
  );
}
