import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  email: z.email({ error: "Adresse email invalide" }).max(200),
  organisation: z.string().trim().max(160).optional().default(""),
  etablissements: z.string().trim().max(40).optional().default(""),
  role: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  version: z.string().trim().max(40).optional().default(""),
  site: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Requête invalide" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Champs invalides" }, { status: 422 });
  }
  const lead = parsed.data;
  if (lead.site) {
    return Response.json({ ok: true });
  }
  console.info("parnuit_beta_lead", JSON.stringify({ ...lead, at: new Date().toISOString() }));

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BETA_NOTIFY_EMAIL;
  if (!apiKey || !to) {
    return Response.json({ ok: false, fallback: true }, { status: 202 });
  }
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Parnuit <onboarding@resend.dev>",
      to,
      replyTo: lead.email,
      subject: `Bêta Parnuit — ${lead.organisation || lead.email}`,
      text: [
        `Email : ${lead.email}`,
        `Organisation : ${lead.organisation}`,
        `Établissements : ${lead.etablissements}`,
        `Rôle : ${lead.role}`,
        `Version de page : ${lead.version}`,
        "",
        lead.message,
      ].join("\n"),
    });
    if (error) throw new Error(error.message);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("parnuit_beta_email_failed", error);
    return Response.json({ ok: false, fallback: true }, { status: 202 });
  }
}
