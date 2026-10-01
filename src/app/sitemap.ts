import type { MetadataRoute } from "next";
import { isVitrine, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isVitrine) return [];
  return [
    { url: SITE_URL, lastModified: new Date("2026-10-01"), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/confidentialite`, lastModified: new Date("2026-10-01"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
