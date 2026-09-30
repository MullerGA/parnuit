import type { Metadata, Viewport } from "next";
import { ReviewBar } from "@/components/review-bar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://parnuit-studio.vercel.app"),
  title: {
    default: "Parnuit — La taxe de séjour de tout votre parc",
    template: "%s · Parnuit",
  },
  description:
    "Tarifs, collecteurs, portails et échéances de taxe de séjour pour chaque établissement de votre parc, à partir des sources officielles. Bêta privée.",
  icons: { icon: "/favicon.svg" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <ReviewBar />
      </body>
    </html>
  );
}
