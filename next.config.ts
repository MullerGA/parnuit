import type { NextConfig } from "next";

const vitrine = process.env.SITE_MODE === "vitrine";
const studioOnly = ["/demo", "/nuit", "/calcul", "/plateforme", "/rangement", "/og-card"];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/data/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }],
      },
      {
        source: "/demandes/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    if (!vitrine) return [];
    return [
      { source: "/vitrine", destination: "/", permanent: false },
      ...studioOnly.map((source) => ({ source, destination: "/", permanent: false })),
    ];
  },
  async rewrites() {
    if (!vitrine) return { beforeFiles: [], afterFiles: [], fallback: [] };
    return { beforeFiles: [{ source: "/", destination: "/vitrine" }], afterFiles: [], fallback: [] };
  },
};

export default nextConfig;
