import { BOOKING_PATH } from "@/data/business";
import { images } from "@/data/images";
import { ButtonLink } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";

/** Stor bild med centrerad vit rubrik, kort text och en bokningsknapp. */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[32rem] items-center justify-center overflow-hidden px-5 py-20 text-center text-white h-[72svh] lg:h-[78svh] lg:max-h-[46rem]"
    >
      <div className="absolute inset-0 -z-10">
        <SiteImage image={images.hero} eager sizes="100vw" />
        <div aria-hidden className="absolute inset-0 bg-ink/50" />
      </div>

      <div className="max-w-2xl">
        <h1 id="hero-title" className="text-hero font-bold text-balance">
          Din barbershop i Söderköping.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/90">
          Herrklippning, skägg och personlig service på Ringvägen 44.
        </p>
        <ButtonLink href={BOOKING_PATH} variant="white" className="mt-8 px-8">
          Boka tid
        </ButtonLink>
      </div>
    </section>
  );
}
