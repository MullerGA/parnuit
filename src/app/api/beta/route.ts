import { Resend } from "resend";
import { z } from "zod";
import { type Lead, saveLead, storageReady } from "@/lib/leads";

const schema = z.object({
  email: z.email({ error: "Adresse email invalide" }).max(200),
  organisation: z.string().trim().max(160).optional().default(""),
  etablissements: z.string().trim().max(40).optional().default(""),
  role: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(4000).optional().default(""),
  version: z.string().trim().max(40).optional().default(""),
  source: z.string().trim().max(120).optional().default(""),
  site: z.string().max(200).optional(),
});

const MAX_FILE = 4 * 1024 * 1024;
const FILE_TYPES = /\.(csv|xlsx|xls|ods|txt|pdf|numbers)$/i;

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  let file: File | null = null;
  try {
    const type = request.headers.get("content-type") ?? "";
    if (type.includes("multipart/form-data")) {
      const form = await request.formData();
      for (const [k, v] of form.entries()) {
        if (typeof v === "string") body[k] = v;
        else if (k === "fichier" && v.size > 0) file = v;
      }
    } else {
      body = await request.json();
    }
  } catch {
    return Response.json({ ok: false, error: "Requête invalide" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Champs invalides" }, { status: 422 });
  }
  const data = parsed.data;
  if (data.site) return Response.json({ ok: true });
  if (file && (file.size > MAX_FILE || !FILE_TYPES.test(file.name))) {
    return Response.json({ ok: false, error: "Fichier refusé : CSV, Excel, ODS, PDF ou texte, 4 Mo au plus." }, { status: 422 });
  }

  const lead: Lead = {
    id: `${new Date().toISOString().replace(/[:.]/g, "-")}-${crypto.randomUUID().slice(0, 8)}`,
    at: new Date().toISOString(),
    email: data.email,
    organisation: data.organisation,
    etablissements: data.etablissements,
    role: data.role,
    message: data.message,
    version: data.version,
    source: data.source,
  };
  console.info(
    "parnuit_beta_lead",
    JSON.stringify({ id: lead.id, organisation: lead.organisation, version: lead.version, source: lead.source }),
  );

  let stored = false;
  if (storageReady()) {
    try {
      await saveLead(lead, file);
      stored = true;
    } catch (error) {
      console.error("parnuit_beta_store_failed", error);
    }
  }

  let emailed = false;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BETA_NOTIFY_EMAIL;
  if (apiKey && to) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Parnuit <onboarding@resend.dev>",
        to,
        replyTo: lead.email,
        subject: `Parnuit — demande de ${lead.organisation || lead.email}`,
        text: [
          `Email : ${lead.email}`,
          `Organisation : ${lead.organisation}`,
          `Établissements : ${lead.etablissements}`,
          `Rôle : ${lead.role}`,
          `Page : ${lead.version}${lead.source ? `, source ${lead.source}` : ""}`,
          lead.fichier ? `Fichier joint : ${lead.fichier.nom}` : "",
          "",
          lead.message,
        ].join("\n"),
      });
      if (error) throw new Error(error.message);
      emailed = true;
    } catch (error) {
      console.error("parnuit_beta_email_failed", error);
    }
  }

  if (stored || emailed) return Response.json({ ok: true });
  return Response.json({ ok: false, fallback: true }, { status: 202 });
}
