"use client";

import { useState } from "react";

export const CONTACT_EMAIL = "muller.tangae@gmail.com";

export type BetaPayload = {
  email: string;
  organisation?: string;
  etablissements?: string;
  role?: string;
  message?: string;
};

export type BetaState = "idle" | "sending" | "done" | "mail" | "error";

export function mailtoFor(payload: BetaPayload, version: string) {
  const lines = [
    "Bonjour,",
    "",
    "Je souhaite un accès à la bêta Parnuit.",
    "",
    `Email : ${payload.email}`,
    `Organisation : ${payload.organisation ?? ""}`,
    `Nombre d'établissements : ${payload.etablissements ?? ""}`,
    payload.role ? `Rôle : ${payload.role}` : "",
    payload.message ? `\n${payload.message}` : "",
    "",
    `(page : ${version})`,
  ].filter((l) => l !== "");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Accès bêta Parnuit")}&body=${encodeURIComponent(lines.join("\n"))}`;
}

export function useBetaSignup(version: string) {
  const [state, setState] = useState<BetaState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: BetaPayload & { site?: string }) {
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/beta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, version }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; fallback?: boolean; error?: string };
      if (data.ok) {
        setState("done");
        return;
      }
      if (res.status === 422) {
        setState("error");
        setError(data.error ?? "Vérifiez votre adresse email.");
        return;
      }
      window.location.href = mailtoFor(payload, version);
      setState("mail");
    } catch {
      window.location.href = mailtoFor(payload, version);
      setState("mail");
    }
  }

  return { state, error, submit };
}

export function readForm(form: HTMLFormElement): BetaPayload & { site?: string } {
  const data = new FormData(form);
  const get = (k: string) => String(data.get(k) ?? "").trim();
  return {
    email: get("email"),
    organisation: get("organisation"),
    etablissements: get("etablissements"),
    role: get("role"),
    message: get("message"),
    site: get("site"),
  };
}
