import { type NextRequest, NextResponse } from "next/server";

/** Protège la liste des demandes par une authentification HTTP simple. */
export function proxy(request: NextRequest) {
  const password = process.env.LEADS_PASSWORD;
  if (!password) return new NextResponse("Introuvable", { status: 404 });
  const header = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    const decoded = atob(encoded);
    const given = decoded.slice(decoded.indexOf(":") + 1);
    if (given.length === password.length && given === password) return NextResponse.next();
  }
  return new NextResponse("Authentification requise", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Parnuit", charset="UTF-8"', "cache-control": "no-store" },
  });
}

export const config = { matcher: ["/demandes", "/demandes/:path*"] };
