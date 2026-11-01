import Image from "next/image";
import { Download } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

/** Filerna skapas av scripts/generate-qr-pdfs.mjs (`npm run qr`). */
const posters = [
  {
    file: "silverkammen-hemsida",
    title: "Till hemsidan",
    destination: "www.silverkammen.se",
    download: "Ladda ner PDF: hemsidan",
  },
  {
    file: "silverkammen-boka-tid",
    title: "Till bokningen",
    destination: "www.silverkammen.se/boka",
    download: "Ladda ner PDF: boka tid",
  },
];

export const metadata = {
  ...pageMetadata({
    title: "QR-koder",
    description: "Ladda ner Silverkammens QR-koder som utskriftsfärdiga PDF-filer.",
    path: "/qr",
  }),
  robots: { index: false },
};

export default function QrPage() {
  return (
    <main className="flex flex-1 items-center">
      <h1 className="sr-only">QR-koder</h1>
      <Container className="py-10 sm:py-16">
        <ul className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {posters.map((poster) => (
            <li
              key={poster.file}
              className="flex flex-col items-center rounded-2xl border border-line bg-sand p-6 text-center sm:p-8"
            >
              <div className="w-full max-w-56 rounded-2xl bg-white p-5">
                <Image
                  src={`/qr/${poster.file}.svg`}
                  alt={`QR-kod till ${poster.destination}`}
                  width={200}
                  height={200}
                  unoptimized
                  className="h-auto w-full"
                />
              </div>
              <h2 className="mt-6 text-h2 font-semibold">{poster.title}</h2>
              <p className="mt-1 mb-6 break-all text-stone">{poster.destination}</p>
              <ButtonLink
                href={`/qr/${poster.file}.pdf`}
                download={`${poster.file}.pdf`}
                icon={<Download aria-hidden className="size-[1.125rem] shrink-0" strokeWidth={1.75} />}
                className="mt-auto w-full"
              >
                {poster.download}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
