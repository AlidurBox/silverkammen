import { ClientoBooking } from "@/components/booking/ClientoBooking";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Boka tid online",
  description:
    "Boka tid hos Silverkammen i Söderköping. Välj behandling och en ledig tid för herrklippning, klipp & skägg eller barnklippning – direkt online.",
  path: "/boka",
});

export default function BookingPage() {
  return (
    <>
      <Container size="narrow" className="pt-10 pb-28 sm:pt-16 sm:pb-32">
        <header className="mb-8 text-center sm:mb-10">
          <p className="label mb-4 text-bronze">Onlinebokning</p>
          <h1 className="text-h1 font-semibold">Boka tid</h1>
          <p className="mt-3 text-stone">Välj behandling, dag och tid.</p>
        </header>

        <section
          aria-label="Bokningskalender"
          className="rounded-2xl border border-line bg-white px-4 py-6 sm:px-8 sm:py-8"
        >
          <ClientoBooking />
        </section>


      </Container>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Hem", path: "/" },
          { name: "Boka tid", path: "/boka" },
        ])}
      />
    </>
  );
}
