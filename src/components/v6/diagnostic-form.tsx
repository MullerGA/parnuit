"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SIZES } from "@/components/beta/beta-form";
import { mailtoFor } from "@/components/beta/use-beta-signup";

const ROLES = ["Direction financière", "Comptabilité", "Exploitation", "Direction générale", "Revenue management", "Autre"];

export function DiagnosticForm({ version = "6-vitrine" }: { version?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "mail">("idle");
  const [error, setError] = useState<string | null>(null);
  const [calc, setCalc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setSource(q.get("source") || q.get("utm_source") || q.get("ref") || q.get("g") || "");
    const on = (e: Event) => setCalc((e as CustomEvent<string>).detail);
    window.addEventListener("pn:calc", on);
    return () => window.removeEventListener("pn:calc", on);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    if (calc) form.set("message", [String(form.get("message") ?? ""), calc].filter(Boolean).join("\n\n"));
    form.set("version", version);
    form.set("source", source);
    if (file) form.set("fichier", file);
    else form.delete("fichier");
    setState("sending");
    try {
      const res = await fetch("/api/beta", { method: "POST", body: form });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; fallback?: boolean; error?: string };
      if (data.ok) return setState("done");
      if (res.status === 422 || res.status === 400) {
        setState("idle");
        return setError(data.error ?? "Vérifiez le formulaire.");
      }
    } catch {
      // repli ci-dessous
    }
    window.location.href = mailtoFor(
      {
        email: String(form.get("email") ?? ""),
        organisation: String(form.get("organisation") ?? ""),
        etablissements: String(form.get("etablissements") ?? ""),
        role: String(form.get("role") ?? ""),
        message: String(form.get("message") ?? ""),
      },
      version,
    );
    setState("mail");
  }

  const input =
    "w-full rounded-xl border border-[#10202B]/12 bg-[#FBF7F2] px-4 py-3.5 text-[15px] text-[#10202B] outline-none placeholder:text-[#10202B]/35 focus:border-[#E2694A] focus:ring-4 focus:ring-[#E2694A]/15";
  const label = "mb-1.5 block text-[13px] font-semibold text-[#10202B]/70";

  return (
    <AnimatePresence mode="wait">
      {state === "done" || state === "mail" ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          role="status"
          className="rounded-[26px] bg-white p-8 text-[#10202B] shadow-2xl"
        >
          <span className="grid size-12 place-items-center rounded-full bg-emerald-50 text-[22px] text-emerald-600">✓</span>
          <p className="mt-5 text-[24px] font-extrabold tracking-[-0.02em]">C'est noté, merci.</p>
          <p className="mt-2 text-[15.5px] leading-relaxed text-[#10202B]/65">
            {state === "mail"
              ? "Votre messagerie s'ouvre avec la demande préremplie : il ne reste qu'à l'envoyer."
              : "Nous préparons le diagnostic de votre parc et revenons vers vous par email. Votre accès à la bêta est réservé."}
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0 }}
          onSubmit={onSubmit}
          className="rounded-[26px] bg-white p-6 text-[#10202B] shadow-2xl sm:p-8"
        >
          <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className={label}>Email professionnel</span>
              <input className={input} type="email" name="email" required autoComplete="email" placeholder="prenom.nom@groupe.fr" />
            </label>
            <label>
              <span className={label}>Groupe ou société</span>
              <input className={input} type="text" name="organisation" required autoComplete="organization" placeholder="Nom du groupe" />
            </label>
            <label>
              <span className={label}>Nombre d'établissements</span>
              <select className={input} name="etablissements" defaultValue="5 à 19">
                {SIZES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="sm:col-span-2">
              <span className={label}>Votre fonction</span>
              <select className={input} name="role" defaultValue="">
                <option value="" disabled>
                  Choisir…
                </option>
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="sm:col-span-2">
              <span className={label}>Vos établissements ou leurs communes</span>
              <textarea
                className={`${input} min-h-[92px] resize-y`}
                name="message"
                placeholder={"Ex. Résidence 4★ à Carcassonne, hôtel 3★ à Saint-Malo, camping à Argelès-sur-Mer…"}
              />
            </label>
          </div>
          <div className="mt-3">
            <input
              ref={fileRef}
              type="file"
              name="fichier"
              accept=".csv,.xlsx,.xls,.ods,.txt,.pdf,.numbers"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-dashed border-[#10202B]/25 px-4 py-3 text-left text-[14px] text-[#10202B]/70 transition hover:border-[#E2694A] hover:text-[#10202B]"
            >
              <span className="truncate">{file ? `📎 ${file.name}` : "📎 Ou joignez votre liste (Excel, CSV, PDF), facultatif"}</span>
              <span className="shrink-0 text-[12.5px] font-semibold text-[#E2694A]">{file ? "Changer" : "Choisir"}</span>
            </button>
          </div>
          {calc && (
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#FBF1EA] px-3.5 py-2.5 text-[13px] text-[#C2502F]">
              <span>✓</span>
              <span>
                {calc}{" "}
                <button type="button" className="ml-1 underline" onClick={() => setCalc(null)}>
                  Retirer
                </button>
              </span>
            </p>
          )}
          <button
            type="submit"
            disabled={state === "sending"}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#E2694A] to-[#C8456F] px-5 py-4 text-[16px] font-bold text-white shadow-[0_16px_34px_-14px_rgba(200,69,111,.8)] transition hover:brightness-110 disabled:opacity-60"
          >
            {state === "sending" ? "Envoi…" : "Recevoir mon diagnostic 2027"}
          </button>
          {error && (
            <p className="mt-3 text-[14px] font-medium text-red-600" role="alert">
              {error}
            </p>
          )}
          <p className="mt-4 text-[12px] leading-relaxed text-[#10202B]/50">
            Offert et sans engagement. Vos informations servent uniquement à préparer votre diagnostic et à vous recontacter au sujet de
            Parnuit.{" "}
            <a href="/confidentialite" className="underline underline-offset-2 hover:text-[#10202B]">
              Confidentialité
            </a>
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
