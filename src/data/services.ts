/**
 * Statisk prislista som visas på webbplatsen.
 *
 * Cliento är alltid den slutliga källan för bokningsbara tjänster och
 * aktuella priser. Ändras något i Cliento – uppdatera motsvarande rad här.
 */

export type Service = {
  id: string;
  name: string;
  description: string;
  /** Tid i minuter */
  duration: number;
  /** Pris i kronor */
  price: number;
  /** Visar "Från" före priset */
  priceFrom?: boolean;
  /** Tilläggstjänst som bara kan bokas tillsammans med en annan behandling */
  addon?: string;
  /** Lyfts fram på startsidan */
  featured?: boolean;
};

export type ServiceGroup = {
  id: string;
  title: string;
  intro: string;
  services: Service[];
};

export const serviceGroups: ServiceGroup[] = [
  {
    id: "klippning",
    title: "Klippning",
    intro:
      "Klassiska och moderna herrklippningar.",
    services: [
      {
        id: "harklippning",
        name: "Hårklippning",
        description:
          "Klassisk eller modern klippning med maskin och sax, inklusive styling.",
        duration: 30,
        price: 350,
        featured: true,
      },
      {
        id: "saxklippning",
        name: "Saxklippning",
        description:
          "Klippning helt med sax för längre hår eller en mjukare form.",
        duration: 45,
        price: 400,
        priceFrom: true,
        featured: true,
      },
      {
        id: "pensionar",
        name: "Pensionär",
        description:
          "Hårklippning till pensionärspris.",
        duration: 30,
        price: 300,
      },
      {
        id: "barnklippning",
        name: "Barnklippning",
        description:
          "För barn upp till 9 år.",
        duration: 30,
        price: 300,
        featured: true,
      },
    ],
  },
  {
    id: "skagg",
    title: "Klipp & skägg",
    intro:
      "Hår och skägg formade som en helhet.",
    services: [
      {
        id: "klipp-skagg",
        name: "Klipp & Skägg",
        description:
          "Hårklippning samt formning och trimning av skägget.",
        duration: 45,
        price: 500,
        featured: true,
      },
    ],
  },
  {
    id: "ansikte",
    title: "Ansiktsvaxning",
    intro: "Som egen behandling eller som tillägg.",
    services: [
      {
        id: "ansiktsvaxning",
        name: "Ansiktsvaxning",
        description:
          "Vaxning av ansiktet för ett rent resultat.",
        duration: 30,
        price: 250,
      },
      {
        id: "ansiktsvaxning-tillagg",
        name: "Ansiktsvaxning med klippning",
        description:
          "Tillägg när du bokar hårklippning.",
        duration: 10,
        price: 100,
        addon: "Bokas tillsammans med hårklippning",
      },
    ],
  },
];

export const allServices = serviceGroups.flatMap((g) => g.services);
export const featuredServices = allServices.filter((s) => s.featured);

export function formatPrice(s: Pick<Service, "price" | "priceFrom">) {
  return `${s.priceFrom ? "Från " : ""}${s.price} kr`;
}

export function formatDuration(minutes: number) {
  return `${minutes} min`;
}
