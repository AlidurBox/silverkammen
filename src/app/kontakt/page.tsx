import { MapPin } from "lucide-react";
import { BOOKING_PATH, business, formatHours } from "@/data/business";
import { getOpeningHours } from "@/lib/cliento";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kontakt & öppettider",
  description:
    "Hitta till Silverkammen på Ringvägen 44 i Söderköping. Telefon, e-post, öppettider och vägbeskrivning till barbershopen.",
  path: "/kontakt",
});

const rows = [
  { label: "Adress", value: `${business.address.street}, ${business.address.city}`, href: business.mapsUrl, external: true },
  { label: "Telefon", value: business.phone.display, href: business.phone.href },
  { label: "E-post", value: business.email, href: `mailto:${business.email}` },
  { label: "Instagram", value: business.instagram.handle, href: business.instagram.url, external: true },
  { label: "Facebook", value: "Silverkammen", href: business.facebook.url, external: true },
];

export default async function ContactPage() {
  const openingHours = await getOpeningHours();

  return (
    <>
      <PageHeader
        label="Kontakt"
        title="Hitta hit"
        intro="Enklast bokar du tid online. Har du frågor går det bra att ringa eller mejla."
        path="/kontakt"
        name="Kontakt"
      >
        <ButtonLink href={BOOKING_PATH} className="w-full sm:w-auto">
          Boka tid
        </ButtonLink>
      </PageHeader>

      <Container className="pb-16 sm:pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-12">
            <dl className="divide-y divide-line border-y border-line">
              {rows.map((r) => (
                <div key={r.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="label text-stone">{r.label}</dt>
                  <dd>
                    <a
                      href={r.href}
                      {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-lg font-medium break-all underline decoration-ink/20 underline-offset-4 hover:decoration-ink sm:break-normal"
                    >
                      {r.value}
                      {r.external && <span className="sr-only"> (öppnas i ny flik)</span>}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>

            <section aria-labelledby="oppettider">
              <h2 id="oppettider" className="text-h2 font-semibold">
                Öppettider
              </h2>
              <dl className="mt-5 divide-y divide-line border-y border-line">
                {openingHours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-6 py-3">
                    <dt>{h.day}</dt>
                    <dd className={`tabular-nums ${h.opens ? "" : "text-stone"}`}>{formatHours(h)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <section aria-label="Karta" className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl sm:aspect-[4/3] lg:aspect-auto lg:min-h-[28rem] lg:flex-1">
              <MapEmbed />
            </div>
            <ButtonLink
              href={business.mapsUrl}
              variant="outline"
              external
              icon={<MapPin aria-hidden className="size-[1.125rem]" strokeWidth={1.75} />}
              className="w-full sm:w-auto sm:self-start"
            >
              Öppna i Google Maps
            </ButtonLink>
          </section>
        </div>
      </Container>
    </>
  );
}
