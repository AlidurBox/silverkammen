import { business } from "@/data/business";

/**
 * Inbäddad Google-karta utan API-nyckel. Laddas lazy, alltså först när
 * den närmar sig skärmen.
 */
export function MapEmbed() {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(business.mapsEmbedQuery)}&z=15&output=embed`;

  return (
    <iframe
      title={`Karta: ${business.name}, ${business.address.street}, ${business.address.city}`}
      src={src}
      className="absolute inset-0 size-full border-0 bg-sand"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
