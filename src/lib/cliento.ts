import { cacheLife } from "next/cache";
import { business, fallbackOpeningHours, type OpeningHours } from "@/data/business";

/**
 * Öppettider hämtade från Silverkammens bokningssida hos Cliento, så att
 * webbplatsen följer med när salongen ändrar tiderna i Cliento.
 *
 * Clientos dokumenterade Widget API saknar öppettider. De finns däremot som
 * JSON (__NEXT_DATA__) på den publika bokningssidan, och det är den som läses.
 * Formatet är inte dokumenterat – går hämtning eller tolkning fel används
 * reservtiderna i src/data/business.ts, så sidan visar alltid något rimligt.
 *
 * Resultatet cachas och förnyas i bakgrunden ungefär en gång i timmen.
 */

type ClientoDay = {
  dayOfWeek: string;
  dayStart: string | null;
  dayEnd: string | null;
  lunchStart: string | null;
  lunchEnd: string | null;
  closed: boolean;
};

const DAYS = [
  { key: "MONDAY", day: "Måndag", schemaDay: "Monday" },
  { key: "TUESDAY", day: "Tisdag", schemaDay: "Tuesday" },
  { key: "WEDNESDAY", day: "Onsdag", schemaDay: "Wednesday" },
  { key: "THURSDAY", day: "Torsdag", schemaDay: "Thursday" },
  { key: "FRIDAY", day: "Fredag", schemaDay: "Friday" },
  { key: "SATURDAY", day: "Lördag", schemaDay: "Saturday" },
  { key: "SUNDAY", day: "Söndag", schemaDay: "Sunday" },
] as const;

const hhmm = (t: string | null) => (t && /^\d{2}:\d{2}/.test(t) ? t.slice(0, 5) : null);

function isClientoDay(x: unknown): x is ClientoDay {
  return typeof x === "object" && x !== null && typeof (x as ClientoDay).dayOfWeek === "string";
}

/** Letar upp listan "openingHours" var den än ligger i sidans data. */
function findOpeningHours(node: unknown, depth = 0): ClientoDay[] | null {
  if (depth > 12 || typeof node !== "object" || node === null) return null;
  for (const [key, value] of Object.entries(node)) {
    if (key === "openingHours" && Array.isArray(value) && value.every(isClientoDay)) {
      return value;
    }
    const found = findOpeningHours(value, depth + 1);
    if (found) return found;
  }
  return null;
}

/** Gör om Clientos format till webbplatsens. Dagar som saknas är stängda. */
export function toOpeningHours(days: ClientoDay[]): OpeningHours[] {
  return DAYS.map(({ key, day, schemaDay }) => {
    const d = days.find((x) => x.dayOfWeek === key);
    const opens = hhmm(d?.dayStart ?? null);
    const closes = hhmm(d?.dayEnd ?? null);
    if (!d || d.closed || !opens || !closes) {
      return { day, schemaDay, opens: null, closes: null };
    }
    const ls = hhmm(d.lunchStart);
    const le = hhmm(d.lunchEnd);
    return { day, schemaDay, opens, closes, lunch: ls && le ? { start: ls, end: le } : null };
  });
}

export async function getOpeningHours(): Promise<OpeningHours[]> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(business.booking.clientoUrl, {
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) throw new Error("Hittade ingen data på Clientos sida");

    const days = findOpeningHours(JSON.parse(match[1]));
    if (!days || days.length === 0) throw new Error("Inga öppettider i Clientos data");

    return toOpeningHours(days);
  } catch (error) {
    console.warn("[cliento] Kunde inte hämta öppettider, använder reservtider:", error);
    return fallbackOpeningHours;
  }
}
