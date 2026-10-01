import type { Metadata, Viewport } from "next";
import { ReviewBar } from "@/components/review-bar";
import { isVitrine, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Parnuit — La taxe de séjour de tout votre parc",
    template: "%s · Parnuit",
  },
  description:
    "Tarifs, collecteurs, portails et échéances de taxe de séjour pour chaque établissement de votre parc, à partir des sources officielles. Bêta privée.",
  icons: { icon: "/favicon.svg", apple: "/apple-icon.png" },
  robots: isVitrine ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10202B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        {!isVitrine && <ReviewBar />}
      </body>
    </html>
  );
}
