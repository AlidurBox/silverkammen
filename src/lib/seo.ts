import type { Metadata } from "next";
import { business, type OpeningHours } from "@/data/business";
import { allServices } from "@/data/services";
import { images } from "@/data/images";

/** Produktionsdomänen (src/data/business.ts). Används för canonical, OG och sitemap. */
export const siteUrl = business.url;

type PageMeta = {
  title: string;
  description: string;
  path: string;
};

/** Delad OG-bild (genereras av app/opengraph-image.tsx). */
export const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Silverkammen – Barbershop i Söderköping",
};

export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  const socialTitle = `${title} | ${business.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    // Sidans openGraph ersätter layoutens helt, därför upprepas bilden här.
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: business.name,
      locale: "sv_SE",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage.url],
    },
  };
}

/** schema.org HairSalon med enbart verifierade uppgifter. */
export function localBusinessJsonLd(openingHours: OpeningHours[]) {
  const prices = allServices.map((s) => s.price);
  const heroImage = images.hero.src ? `${siteUrl}${images.hero.src}` : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${siteUrl}/#business`,
    name: business.name,
    description: business.description,
    url: siteUrl,
    telephone: business.phone.e164,
    email: business.email,
    image: heroImage ?? `${siteUrl}/opengraph-image`,
    priceRange: `${Math.min(...prices)}–${Math.max(...prices)} SEK`,
    currenciesAccepted: "SEK",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressCountry: business.address.country,
    },
    areaServed: { "@type": "City", name: "Söderköping" },
    hasMap: business.mapsUrl,
    sameAs: [business.instagram.url, business.facebook.url, business.booking.clientoUrl],
    openingHoursSpecification: openingHours.flatMap((h) => {
      if (!h.opens || !h.closes) return [];
      const spec = (opens: string, closes: string) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${h.schemaDay}`,
        opens,
        closes,
      });
      return h.lunch
        ? [spec(h.opens, h.lunch.start), spec(h.lunch.end, h.closes)]
        : [spec(h.opens, h.closes)];
    }),
    potentialAction: {
      "@type": "ReserveAction",
      target: `${siteUrl}/boka`,
      name: "Boka tid",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tjänster & priser",
      itemListElement: allServices.map((s) => ({
        "@type": "Offer",
        price: s.price,
        priceCurrency: "SEK",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
        },
      })),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
