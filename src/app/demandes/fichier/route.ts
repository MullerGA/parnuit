import { readLeadFile } from "@/lib/leads";

export async function GET(request: Request) {
  const chemin = new URL(request.url).searchParams.get("p") ?? "";
  const res = await readLeadFile(chemin);
  if (!res || res.statusCode !== 200) return new Response("Introuvable", { status: 404 });
  const nom = chemin.split("/").pop() ?? "fichier";
  return new Response(res.stream, {
    headers: {
      "content-type": res.blob.contentType || "application/octet-stream",
      "content-disposition": `attachment; filename="${nom}"`,
      "cache-control": "private, no-store",
    },
  });
}
