import { BOOKING_PATH } from "@/data/business";
import { images } from "@/data/images";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { SiteImage } from "@/components/ui/SiteImage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Om oss – barberare i Söderköping",
  description:
    "Silverkammen är en barbershop i Söderköping där traditionellt barberarhantverk möter moderna stilar. Precision, kvalitet och personlig service vid varje besök.",
  path: "/om-oss",
});

const values = [
  {
    title: "Hantverk",
    text: "Sax, maskin och kniv – beprövade tekniker som ger rena övergångar.",
  },
  {
    title: "Precision",
    text: "Konturer, symmetri och rätt längd. Detaljerna avgör.",
  },
  {
    title: "Personlig service",
    text: "Vi lyssnar först och anpassar klippningen efter dig.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="Om oss"
        title="Klassiskt hantverk, moderna stilar."
        intro="Silverkammen är en barbershop på Ringvägen i Söderköping för herrklippning, skägg och personlig service."
        path="/om-oss"
        name="Om oss"
      />

      <Container className="pb-16 sm:pb-24">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <SiteImage image={images.hero} sizes="(min-width: 640px) 50vw, 100vw" />
          </div>
          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-xl sm:block">
            <SiteImage image={images.about} sizes="50vw" />
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-2xl space-y-5 text-lg leading-relaxed text-stone sm:mt-20">
          <p>
            Hos oss möts traditionellt barberarhantverk och dagens trender. Du kan
            komma för en tidlös klippning, en skarp fade eller ett skägg som
            formas efter ansiktet.
          </p>
          <p>
            Vi klipper herrar i alla åldrar och barn upp till nio år. Boka enkelt
            online eller ring oss om du har frågor.
          </p>
        </div>

        <ul className="mx-auto mt-14 grid max-w-4xl gap-8 border-t border-line pt-10 sm:grid-cols-3 sm:gap-10">
          {values.map((v) => (
            <li key={v.title}>
              <h2 className="text-lg font-semibold">{v.title}</h2>
              <p className="mt-2 leading-relaxed text-stone">{v.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 text-center">
          <ButtonLink href={BOOKING_PATH} className="w-full sm:w-auto">
            Boka tid
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
