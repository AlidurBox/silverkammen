import type { Metadata } from "next";
import { BOOKING_PATH } from "@/data/business";
import { gallery } from "@/data/images";
import { featuredServices } from "@/data/services";
import { Gallery } from "@/components/gallery/Gallery";
import { Hero } from "@/components/sections/Hero";
import { PriceList } from "@/components/sections/PriceList";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: { absolute: "Silverkammen – Barbershop & herrfrisör i Söderköping" },
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Vårt arbete – horisontell bildrad direkt under hero */}
      <section aria-labelledby="arbete-title" className="pt-10 pb-16 sm:pt-12 sm:pb-20">
        <Container>
          <h2 id="arbete-title" className="label mb-6 text-center text-bronze">
            Vårt arbete
          </h2>
          <Gallery items={gallery.filter((img) => img.src)} variant="strip" />
          <p className="mt-6 text-center">
            <TextLink href="/galleri">Se hela galleriet</TextLink>
          </p>
        </Container>
      </section>

      {/* Tjänster & priser */}
      <section aria-labelledby="priser-title" className="bg-sand py-16 sm:py-24">
        <Container size="narrow">
          <SectionHeading id="priser-title" label="Tjänster" title="Populära behandlingar" />
          <div className="mt-10">
            <PriceList services={featuredServices} />
          </div>
          <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
            <ButtonLink href={BOOKING_PATH} className="w-full sm:w-auto">
              Boka tid
            </ButtonLink>
            <TextLink href="/tjanster">Hela prislistan</TextLink>
          </div>
        </Container>
      </section>

      {/* Kort om Silverkammen */}
      <section aria-labelledby="om-title" className="border-t border-line py-16 sm:py-24">
        <Container>
          <SectionHeading
            id="om-title"
            label="Om oss"
            title="Klassiskt hantverk, moderna stilar."
            intro="Vi tar oss tid att lyssna och arbetar med precision – oavsett om du vill ha en tidlös klippning, en skarp fade eller ett välvårdat skägg."
          />
          <p className="mt-6 text-center">
            <TextLink href="/om-oss">Mer om oss</TextLink>
          </p>
        </Container>
      </section>
    </>
  );
}
