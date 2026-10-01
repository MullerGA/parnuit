import type { MetadataRoute } from "next";
import { isVitrine, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isVitrine) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/demandes", "/api/"] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
