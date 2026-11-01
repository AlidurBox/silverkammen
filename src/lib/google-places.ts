import { cacheLife } from "next/cache";
import { fallbackOpeningHours, type OpeningHours } from "@/data/business";

/**
 * Öppettider hämtade från Silverkammens Google-profil via Places API, så att
 * webbplatsen följer med när tiderna ändras på profilen.
 *
 * Kräver miljövariablerna GOOGLE_PLACES_API_KEY och GOOGLE_PLACE_ID. Saknas de,
 * eller går hämtning eller tolkning fel, används reservtiderna i
 * src/data/business.ts, så sidan visar alltid något rimligt.
 *
 * Varje anrop kostar pengar efter Googles fria kvot. fetch-cachen delas mellan
 * sidor och serverinstanser, medan "use cache" körs om för varje sida på Vercel.
 */

const REVALIDATE_SECONDS = 3600;

type Point = { day?: number; hour?: number; minute?: number };
type Period = { open: Point; close?: Point };

/** day är Googles numrering: 0 = söndag, 6 = lördag. */
const DAYS = [
  { googleDay: 1, day: "Måndag", schemaDay: "Monday" },
  { googleDay: 2, day: "Tisdag", schemaDay: "Tuesday" },
  { googleDay: 3, day: "Onsdag", schemaDay: "Wednesday" },
  { googleDay: 4, day: "Torsdag", schemaDay: "Thursday" },
  { googleDay: 5, day: "Fredag", schemaDay: "Friday" },
  { googleDay: 6, day: "Lördag", schemaDay: "Saturday" },
  { googleDay: 0, day: "Söndag", schemaDay: "Sunday" },
] as const;

/** Google utelämnar fält vars värde är 0. */
const hhmm = ({ hour = 0, minute = 0 }: Point) =>
  `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

/** Gör om Googles format till webbplatsens. Dagar utan perioder är stängda. */
export function toOpeningHours(periods: Period[]): OpeningHours[] {
  return DAYS.map(({ googleDay, day, schemaDay }) => {
    const today = periods
      .filter((p) => (p.open.day ?? 0) === googleDay)
      .map((p) => {
        if (!p.close) throw new Error("Period utan stängningstid");
        return { opens: hhmm(p.open), closes: hhmm(p.close) };
      })
      .sort((a, b) => a.opens.localeCompare(b.opens));
    if (today.length === 0) return { day, schemaDay, opens: null, closes: null };

    const first = today[0];
    const last = today[today.length - 1];
    const lunch = today.length > 1 ? { start: first.closes, end: today[1].opens } : null;
    return { day, schemaDay, opens: first.opens, closes: last.closes, lunch };
  });
}

export async function getOpeningHours(): Promise<{ hours: OpeningHours[]; fromGoogle: boolean }> {
  "use cache";
  cacheLife("hours");

  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;
    if (!apiKey || !placeId) throw new Error("GOOGLE_PLACES_API_KEY eller GOOGLE_PLACE_ID saknas");

    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": "regularOpeningHours" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { regularOpeningHours } = (await res.json()) as {
      regularOpeningHours?: { periods?: Period[] };
    };
    if (!regularOpeningHours) throw new Error("Inga öppettider på Google-profilen");

    return { hours: toOpeningHours(regularOpeningHours.periods ?? []), fromGoogle: true };
  } catch (error) {
    console.warn("[google-places] Kunde inte hämta öppettider, använder reservtider:", error);
    return { hours: fallbackOpeningHours, fromGoogle: false };
  }
}
