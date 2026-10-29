import Image from "next/image";
import { Scissors, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { BOOKING_PATH } from "@/data/business";
import { gallery } from "@/data/images";
import { serviceGroups } from "@/data/services";
import { Gallery } from "@/components/gallery/Gallery";
import { PriceList } from "@/components/sections/PriceList";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tjänster & priser – herrklippning och skägg",
  description:
    "Priser för herrklippning, saxklippning, klipp & skägg, barnklippning och ansiktsvaxning hos Silverkammen i Söderköping. Se tid och pris och boka online.",
  path: "/tjanster",
});

/** Ikon per tjänstegrupp. Skägg använder Silverkammens eget märke. */
const groupIcons: Record<string, ReactNode> = {
  klippning: <Scissors aria-hidden className="size-5" strokeWidth={1.75} />,
  skagg: <Image src="/logo-mark.svg" alt="" width={28} height={28} unoptimized className="size-7" />,
  ansikte: <Sparkles aria-hidden className="size-5" strokeWidth={1.75} />,
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="Prislista"
        title="Tjänster & priser"
        intro="Välj behandling när du bokar – du ser lediga tider direkt."
        path="/tjanster"
        name="Tjänster & priser"
      />

      {/* Lite av vårt arbete för att ge sidan liv */}
      <Container className="pb-12 sm:pb-16">
        <Gallery items={gallery.filter((img) => img.src)} variant="strip" />
      </Container>

      <Container size="narrow" className="space-y-14 pb-16 sm:space-y-20 sm:pb-24">
        {serviceGroups.map((group) => (
          <section key={group.id} aria-labelledby={`grupp-${group.id}`}>
            <div className="mb-6 flex items-center gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-sand text-bronze">
                {groupIcons[group.id]}
              </span>
              <div>
                <h2 id={`grupp-${group.id}`} className="text-h2 font-semibold">
                  {group.title}
                </h2>
                <p className="mt-0.5 text-stone">{group.intro}</p>
              </div>
            </div>
            <PriceList services={group.services} detailed />
          </section>
        ))}

        <div className="rounded-3xl bg-sand px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-h2 font-semibold">Hittat rätt?</h2>
          <p className="mx-auto mt-2 max-w-md text-stone">
            Boka direkt online. Aktuella tider och priser visas alltid i bokningen.
          </p>
          <ButtonLink href={BOOKING_PATH} className="mt-6 w-full sm:w-auto">
            Boka tid
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
