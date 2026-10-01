# /// script
# requires-python = ">=3.11"
# dependencies = ["duckdb"]
# ///
"""Construit les données publiques des pages Parnuit.

Entrées : la base de travail de personnal-01 (catalogue DGFiP converti, base des
500 communes, priorisation Atout France) et les centres des communes de
geo.api.gouv.fr (scripts/.cache/geo-centres.json).

Sorties (public/data) :
- france.json : toutes les communes, leur délibération en vigueur au catalogue
  DGFiP d'octobre 2025 et ses tarifs 2026 ;
- base500.json : les 500 communes documentées (collecteur, portail, échéances,
  tarifs, sources) ;
- sky.json : coordonnées projetées pour la carte animée ;
- stats.json : chiffres cités dans les pages, avec leur calcul.
"""
import csv, json, math, os, re, sys
from collections import defaultdict
import duckdb

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.environ.get("PARNUIT_DATA", os.path.join(ROOT, "..", "personnal-01", "data"))
XML = os.path.join(DATA, "tourist-tax/processed/dgfip_xml/2025-10-10_ea41817e")
BASE = os.path.join(DATA, "tourist-tax/base")
OUT = os.path.join(ROOT, "public", "data")
os.makedirs(OUT, exist_ok=True)

def rows(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))

db = duckdb.connect()
q = lambda s: db.execute(s).fetchall()

# --- Catalogue national --------------------------------------------------
delibs = q(f"""select delib_id, nom_deliberante, siren_deliberante, cast(date_deliberation as varchar),
  coalesce(ta_departementale,false), coalesce(ta_regionale,false), coalesce(ta_lgv,false), coalesce(ta_l2531_18,false)
  from '{XML}/deliberation.parquet' order by delib_id""")
didx = {d[0]: i for i, d in enumerate(delibs)}
tar = defaultdict(dict)
for delib_id, cat, t in q(f"select delib_id, categorie_id, tarif from '{XML}/tarif.parquet' where periode_idx = 0"):
    tar[delib_id][int(cat)] = t
commune_delib = {}
for delib_id, insee in q(f"select delib_id, code_insee from '{XML}/collectivite.parquet' where code_insee is not null"):
    commune_delib.setdefault(insee, didx[delib_id])

def factor(dep, sgp, lgv, idfm):
    return 1 + 0.10 * dep + 0.15 * sgp + 0.34 * lgv + 2.00 * idfm

def title_case(name):
    small = {"de", "du", "des", "la", "le", "les", "en", "sur", "sous", "et", "aux", "au", "d", "l", "lès", "lez"}
    out = []
    for i, w in enumerate(re.split(r"(\s|-|')", name.lower())):
        out.append(w if (i > 0 and w in small) else w[:1].upper() + w[1:])
    return "".join(out)

D = []
for d in delibs:
    delib_id, nom, siren, date, dep, sgp, lgv, idfm = d
    flags = (1 if dep else 0) | (2 if sgp else 0) | (4 if lgv else 0) | (8 if idfm else 0)
    t = [tar[delib_id].get(c) for c in range(1, 10)]
    D.append([title_case(nom or ""), flags, t, date])

geo = json.load(open(os.path.join(ROOT, "scripts/.cache/geo-centres.json"), encoding="utf-8"))
prio = {r["insee_commune"]: r for r in rows(os.path.join(DATA, "establishments/communes-prioritaires.csv"))}
base_communes = {r["insee"]: r for r in rows(os.path.join(BASE, "communes.csv"))}

LAT0 = math.radians(46.6)
def project(lon, lat):
    # Equirectangulaire corrigée, cadrée sur la France métropolitaine et la Corse.
    x = (lon + 5.3) * math.cos(LAT0) / ((9.7 + 5.3) * math.cos(LAT0))
    y = (51.2 - lat) / (51.2 - 41.3)
    return round(x * 1000), round(y * 1000 * (51.2 - 41.3) / ((9.7 + 5.3) * math.cos(LAT0)))

C, sky = [], []
metro_total = 0
for g in geo:
    code, nom, dep = g["code"], g["nom"], g.get("codeDepartement", "")
    lon, lat = g["centre"]["coordinates"]
    di = commune_delib.get(code, -1)
    p = prio.get(code)
    etab = int(p["total_quatre_types"]) if p else 0
    b = 1 if code in base_communes else 0
    metro = not dep.startswith("97") and -5.6 < lon < 9.8 and 41.2 < lat < 51.3
    x, y = project(lon, lat) if metro else (None, None)
    C.append([code, nom, dep, di, etab, b])
    if metro:
        metro_total += 1
        kind = 3 if b else (2 if etab else (1 if di >= 0 else 0))
        sky += [x, y, kind, min(etab, 999)]

cats = ["Palaces", "Hôtels, résidences et meublés 5★", "Hôtels, résidences et meublés 4★",
        "Hôtels, résidences et meublés 3★", "Hôtels, résidences et meublés 2★, villages de vacances 4-5★",
        "Hôtels, résidences et meublés 1★, villages de vacances 1-3★, chambres d'hôtes",
        "Campings 3-5★", "Campings 1-2★, ports de plaisance", "Sans classement (taux)"]
france = {"source": "Catalogue DGFiP des délibérations de taxe de séjour, publication du 10 octobre 2025 (tarifs 2026). Centres des communes : geo.api.gouv.fr.",
          "cats": cats, "delibs": D, "communes": C}
json.dump(france, open(os.path.join(OUT, "france.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
json.dump({"n": metro_total, "p": sky}, open(os.path.join(OUT, "sky.json"), "w"), separators=(",", ":"))

# --- Base des 500 communes ------------------------------------------------
KEYS = [("palace", r"^Palaces"), ("h5", r"^Hôtels de tourisme 5"), ("h4", r"^Hôtels de tourisme 4"), ("h3", r"^Hôtels de tourisme 3"),
        ("h2", r"^Hôtels de tourisme 2"), ("h1", r"^Hôtels de tourisme 1"), ("r5", r"^Résidences de tourisme?s? 5"), ("r4", r"^Résidences de tourisme?s? 4"),
        ("r3", r"^Résidences de tourisme?s? 3"), ("r2", r"^Résidences de tourisme?s? 2"), ("r1", r"^Résidences de tourisme?s? 1"),
        ("v45", r"^Villages de vacances 4"), ("v13", r"^Villages de vacances 1"), ("c35", r"^Terrains de camping.*3"),
        ("c12", r"^Terrains de camping.*1 et 2"), ("nc", r"^Hébergements (sans|en attente)")]
XMLCAT = {"palace": 1, "h5": 2, "r5": 2, "h4": 3, "r4": 3, "h3": 4, "r3": 4, "h2": 5, "r2": 5, "v45": 5,
          "h1": 6, "r1": 6, "v13": 6, "c35": 7, "c12": 8, "nc": 9}
def key_of(label):
    for k, rx in KEYS:
        if re.search(rx, label):
            if k == "c35" and "1 et 2" in label:
                return "c12"
            return k
    return None

tarifs = defaultdict(list)
for r in rows(os.path.join(BASE, "tarifs.csv")):
    tarifs[r["insee"]].append(r)
coll = {r["collecteur_id"]: r for r in rows(os.path.join(BASE, "collecteurs.csv"))}
liens = {}
for r in rows(os.path.join(BASE, "liens_saisie.csv")):
    if r["retenu"] == "oui":
        liens.setdefault(r["collecteur_id"], r)
ech = defaultdict(dict)
rank = {"corrobore": 0, "propose": 1, "contradictoire": 2}
for r in rows(os.path.join(BASE, "echeances.csv")):
    cur = ech[r["collecteur_id"]].get(r["nature"])
    score = (rank.get(r["verification"], 3), 0 if r["perimetre"] == "tous" else 1)
    if cur is None or score < cur[0]:
        ech[r["collecteur_id"]][r["nature"]] = (score, r)

checks = {"compared": 0, "match": 0}
# Corrections relues à la main : l'extrait source contredit le champ extrait automatiquement.
CORRECTIONS = {
    ("11069", "reversement"): {
        "frequence": "mensuelle",
        "detail": "mensuel à compter du 1er octobre 2026 (auparavant trimestriel)",
    },
}
B = []
for r in sorted(base_communes.values(), key=lambda r: int(r["rang_quatre_types"])):
    insee = r["insee"]
    di = commune_delib.get(insee, -1)
    flags = D[di][1] if di >= 0 else 0
    f = factor(flags & 1, (flags >> 1) & 1, (flags >> 2) & 1, (flags >> 3) & 1)
    out = {}
    for t in tarifs[insee]:
        k = key_of(t["hebergement"])
        if not k:
            continue
        if t["source"] == "DELTA_2026":
            base = float(t["tarif"]) if t["tarif"] else None
            total = float(t["tarif_total"]) if t["tarif_total"] else None
            if base is not None and total is not None and k != "nc" and di >= 0:
                checks["compared"] += 1
                checks["match"] += abs(round(base * f, 2) - total) <= 0.011
            out[k] = {"base": base, "total": total, "officiel": True}
    if not out and di >= 0:
        for k, c in XMLCAT.items():
            base = D[di][2][c - 1]
            if base is not None:
                out[k] = {"base": base, "total": round(base * f, 2) if k != "nc" else None, "officiel": False}
    c = coll.get(r["collecteur_id"], {})
    l = liens.get(r["collecteur_id"], {})
    e = ech.get(r["collecteur_id"], {})
    def e_of(nature):
        v = e.get(nature)
        if not v:
            return None
        v = v[1]
        out_e = {"frequence": v["frequence"], "detail": v["detail"], "extrait": v["extrait"][:280], "source": v["source_url"],
                "verification": v["verification"], "observe": v["observe_le"]}
        out_e.update(CORRECTIONS.get((insee, nature), {}))
        return out_e
    B.append({
        "insee": insee, "nom": r["commune"], "dep": r["departement"], "rang": int(r["rang_quatre_types"]),
        "hotels": int(r["hotels"] or 0), "residences": int(r["residences"] or 0), "campings": int(r["campings"] or 0),
        "villages": int(r["villages"] or 0), "capacite": int(r["capacite_personnes"] or 0),
        "collecteur": {"nom": r["collecteur_nom"], "type": c.get("type_organe", ""), "communes": int(c.get("nb_communes") or 1),
                        "site": c.get("site_officiel", ""), "telephone": c.get("telephone_general", ""), "paiement": c.get("modes_paiement", "")},
        "portail": {"url": r["portail_declaration_url"] or l.get("url_finale", ""), "editeur": r["lien_saisie_editeur"],
                     "verification": r["lien_saisie_verification"], "controle": l.get("controle_le", "")},
        "page": r["page_reference_url"], "site_reference": r["site_reference"],
        "declaration": e_of("declaration"), "reversement": e_of("reversement"),
        "tarifs": out, "tarifs_source": r["tarifs_source"], "taxes": flags,
        "delib": D[di][0] if di >= 0 else "", "delib_date": D[di][3] if di >= 0 else "",
    })
json.dump(B, open(os.path.join(OUT, "base500.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

# --- Chiffres cités ---------------------------------------------------------
etab_all = sum(int(p["total_quatre_types"]) for p in prio.values())
etab_cat = sum(int(p["total_quatre_types"]) for k, p in prio.items() if commune_delib.get(k, -1) >= 0)
cap_all = sum(int(p["capacite_personnes_quatre_types"] or 0) for p in prio.values())
cap_500 = sum(int(p["capacite_personnes_quatre_types"] or 0) for k, p in prio.items() if k in base_communes)
etab_500 = sum(int(p["total_quatre_types"]) for k, p in prio.items() if k in base_communes)
epci = sum(1 for b in B if b["collecteur"]["type"] and b["collecteur"]["type"] != "commune")
freq_decl = defaultdict(int)
for b in B:
    freq_decl[(b["declaration"] or {}).get("frequence") or "inconnue"] += 1
editeurs = defaultdict(int)
for r in base_communes.values():
    editeurs[r["lien_saisie_editeur"] or "aucun"] += 1
stats = {
    "communes_catalogue": len(set(commune_delib)), "communes_geo": len(geo),
    "communes_catalogue_geo": sum(1 for c in C if c[3] >= 0),
    "deliberations": len(D),
    "etab_classes": etab_all, "etab_classes_dans_catalogue": etab_cat, "part_etab_catalogue": round(etab_cat / etab_all, 4),
    "capacite_classee": cap_all, "capacite_500": cap_500, "part_capacite_500": round(cap_500 / cap_all, 4),
    "etab_500": etab_500, "part_etab_500": round(etab_500 / etab_all, 4),
    "base_500_site_reference": sum(1 for r in base_communes.values() if r["site_reference"] and r["site_reference"] != "aucun"),
    "base_500_portail": sum(1 for r in base_communes.values() if r["lien_saisie_type"] == "portail_declaration"),
    "base_500_collecteur_intercommunal": epci,
    "base_500_frequence_declaration": dict(freq_decl), "base_500_editeurs": dict(editeurs),
    "controle_formule_total": checks,
}
json.dump(stats, open(os.path.join(OUT, "stats.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps(stats, ensure_ascii=False, indent=1))
for n in ["france.json", "base500.json", "sky.json"]:
    print(n, os.path.getsize(os.path.join(OUT, n)))
