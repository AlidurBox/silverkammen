import { BOOKING_PATH, business } from "@/data/business";
import { gallery, GALLERY_PLACEHOLDER_COUNT } from "@/data/images";
import { Gallery } from "@/components/gallery/Gallery";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Galleri – klippningar och skägg",
  description:
    "Se exempel på herrklippningar, fades och skäggarbeten från Silverkammen, barbershop i Söderköping.",
  path: "/galleri",
});

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        label="Galleri"
        title="Vårt arbete"
        intro="Klippningar, fades och skägg från salongen. Tryck på en bild för att se den större."
        path="/galleri"
        name="Galleri"
      />

      <Container className="pb-16 sm:pb-24">
        <Gallery
          items={gallery.filter((img) => img.src)}
          variant="grid"
          placeholderCount={GALLERY_PLACEHOLDER_COUNT}
        />

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ButtonLink href={BOOKING_PATH} className="w-full sm:w-auto">
            Boka tid
          </ButtonLink>
          <ButtonLink
            href={business.instagram.url}
            variant="outline"
            external
            icon={<InstagramIcon className="size-[1.125rem]" />}
            className="w-full sm:w-auto"
          >
            Fler bilder på Instagram
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
