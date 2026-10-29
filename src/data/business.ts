/**
 * Central företagsinformation. Allt här är verifierat mot Silverkammens
 * Cliento-sida. Uppdatera här så slår ändringen igenom på hela webbplatsen,
 * inklusive footer, kontaktsida och strukturerad data (schema.org).
 */

export const business = {
  name: "Silverkammen",
  /** Webbplatsens domän – används för canonical-taggar, sitemap och delningar. */
  url: "https://silverkammen.se",
  tagline: "Barbershop i Söderköping",
  description:
    "Silverkammen är en barbershop i Söderköping som förenar traditionellt barberarhantverk med moderna stilar – klassiska och moderna herrklippningar, skäggbehandlingar och personlig service.",

  address: {
    street: "Ringvägen 44",
    /** Från Silverkammens Cliento-sida */
    postalCode: "614 32",
    city: "Söderköping",
    country: "SE",
  },

  phone: {
    display: "070-026 12 02",
    href: "tel:+46700261202",
    e164: "+46700261202",
  },

  email: "silversaxen3@gmail.com",

  instagram: {
    handle: "@silverkammen",
    url: "https://www.instagram.com/silverkammen/",
  },

  /** Hämtad från Silverkammens Cliento-sida. */
  facebook: {
    url: "https://www.facebook.com/profile.php?id=100080259997250",
  },

  /** Google Maps-delningslänk från kunden. */
  mapsUrl: "https://share.google/YdpLxjI8wBL14BAxV",
  /** Används för den klick-för-att-ladda kartan på kontaktsidan (ingen API-nyckel). */
  mapsEmbedQuery: "Silverkammen, Ringvägen 44, Söderköping",

  booking: {
    /** Unikt widget-ID från Cliento (Admin › Onlinebokning › Bokningssida / Widget). */
    clientoWidgetId: "5gLkmOKFwFDq4HmKYcGCbq",
    /** Clientos egen bokningssida – används som reservlänk. */
    clientoUrl: "https://cliento.com/business/silverkammen/",
  },
} as const;

export type OpeningHours = {
  day: string;
  /** schema.org-dagsnamn */
  schemaDay:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  /** "HH:MM", eller null om stängt */
  opens: string | null;
  closes: string | null;
  /** Lunchstängt, om det är angivet i Cliento */
  lunch?: { start: string; end: string } | null;
};

/**
 * Reserv för öppettiderna. Sajten hämtar de aktuella tiderna från Cliento
 * (se src/lib/cliento.ts) och använder bara dessa om Cliento inte svarar.
 */
export const fallbackOpeningHours: OpeningHours[] = [
  { day: "Måndag", schemaDay: "Monday", opens: "09:00", closes: "18:00" },
  { day: "Tisdag", schemaDay: "Tuesday", opens: "09:00", closes: "18:00" },
  { day: "Onsdag", schemaDay: "Wednesday", opens: "09:00", closes: "18:00" },
  { day: "Torsdag", schemaDay: "Thursday", opens: "09:00", closes: "18:00" },
  { day: "Fredag", schemaDay: "Friday", opens: "09:00", closes: "18:00" },
  { day: "Lördag", schemaDay: "Saturday", opens: "09:00", closes: "16:00" },
  { day: "Söndag", schemaDay: "Sunday", opens: null, closes: null },
];

const dot = (t: string) => t.replace(":", ".");

export function formatHours(h: OpeningHours) {
  if (!h.opens || !h.closes) return "Stängt";
  if (h.lunch) {
    return `${dot(h.opens)}–${dot(h.lunch.start)}, ${dot(h.lunch.end)}–${dot(h.closes)}`;
  }
  return `${dot(h.opens)}–${dot(h.closes)}`;
}

export const navigation = [
  { href: "/", label: "Hem" },
  { href: "/tjanster", label: "Tjänster & priser" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/galleri", label: "Galleri" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const BOOKING_PATH = "/boka";
