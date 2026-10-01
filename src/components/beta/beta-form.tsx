"use client";

import { AnimatePresence, motion } from "motion/react";
import { readForm, useBetaSignup } from "./use-beta-signup";

export type BetaSlots = {
  form?: string;
  grid?: string;
  field?: string;
  label?: string;
  input?: string;
  button?: string;
  note?: string;
  success?: string;
  error?: string;
};

export const SIZES = ["Moins de 5", "5 à 19", "20 à 49", "50 à 199", "200 et plus"];

export function BetaForm({
  version,
  slots = {},
  cta = "Demander mon accès bêta",
  note = "Gratuit pendant la bêta · Sans engagement",
  withMessage = false,
  messageLabel = "Vos communes principales (facultatif)",
  prefill,
}: {
  version: string;
  slots?: BetaSlots;
  cta?: string;
  note?: string;
  withMessage?: boolean;
  messageLabel?: string;
  prefill?: string;
}) {
  const { state, error, submit } = useBetaSignup(version);
  const done = state === "done" || state === "mail";

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className={slots.success}
          role="status"
        >
          <strong className="block text-[1.15em]">Merci, votre demande est prise en compte.</strong>
          {state === "mail"
            ? "Votre messagerie s'ouvre avec la demande préremplie : il ne reste qu'à l'envoyer."
            : "Nous revenons vers vous dès l'ouverture des premiers accès."}
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0 }}
          className={slots.form}
          onSubmit={(e) => {
            e.preventDefault();
            const data = readForm(e.currentTarget);
            if (prefill && !data.message) data.message = prefill;
            submit(data);
          }}
        >
          <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className={slots.grid}>
            <label className={slots.field}>
              <span className={slots.label}>Email professionnel</span>
              <input className={slots.input} type="email" name="email" required autoComplete="email" placeholder="prenom.nom@groupe.fr" />
            </label>
            <label className={slots.field}>
              <span className={slots.label}>Groupe ou société</span>
              <input
                className={slots.input}
                type="text"
                name="organisation"
                required
                autoComplete="organization"
                placeholder="Nom du groupe"
              />
            </label>
            <label className={slots.field}>
              <span className={slots.label}>Nombre d'établissements</span>
              <select className={slots.input} name="etablissements" defaultValue="5 à 19">
                {SIZES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            {withMessage && (
              <label className={slots.field}>
                <span className={slots.label}>{messageLabel}</span>
                <input className={slots.input} type="text" name="message" placeholder="Ex. Annecy, Biarritz, La Rochelle" />
              </label>
            )}
          </div>
          <button type="submit" className={slots.button} disabled={state === "sending"}>
            {state === "sending" ? "Envoi…" : cta}
          </button>
          {error && (
            <p className={slots.error} role="alert">
              {error}
            </p>
          )}
          {note && <p className={slots.note}>{note}</p>}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
