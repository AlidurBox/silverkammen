import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/ui/JsonLd";
import { getOpeningHours } from "@/lib/google-places";
import { localBusinessJsonLd } from "@/lib/seo";

/** Sidhuvud, sidfot och strukturerad data för webbplatsens vanliga sidor. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const { hours } = await getOpeningHours();

  return (
    <>
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
      <JsonLd data={localBusinessJsonLd(hours)} />
    </>
  );
}
