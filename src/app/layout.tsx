import type { Metadata, Viewport } from "next";
import { Inter, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/ui/JsonLd";
import { business } from "@/data/business";
import { getOpeningHours } from "@/lib/cliento";
import { localBusinessJsonLd, ogImage, siteUrl } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Logotypens typsnitt – nära skylten på salongen. */
const logoFont = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const defaultTitle = "Silverkammen – Barbershop & herrfrisör i Söderköping";
const defaultDescription =
  "Barbershop på Ringvägen 44 i Söderköping. Herrklippning, saxklippning, klipp & skägg och barnklippning med precision och personlig service. Boka tid online.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Silverkammen Söderköping",
  },
  description: defaultDescription,
  applicationName: business.name,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    siteName: business.name,
    locale: "sv_SE",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImage.url],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fbf9f6",
  // Krävs för att iOS ska rapportera safe-area (hemindikatorn) till CSS.
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const openingHours = await getOpeningHours();

  return (
    <html lang="sv" className={`${inter.variable} ${logoFont.variable}`}>
      {/* cliento-custom-theme: Clientos dokumenterade sätt att tema widgeten */}
      <body className="cliento-custom-theme flex min-h-dvh flex-col">
        <a
          href="#innehall"
          className="sr-only z-50 rounded-full bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Hoppa till innehållet
        </a>
        <Header />
        <main id="innehall" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd data={localBusinessJsonLd(openingHours)} />
      </body>
    </html>
  );
}
