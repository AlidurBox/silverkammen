# Silverkammen – webbplats

Webbplats för Silverkammen, barbershop på Ringvägen 44 i Söderköping.
Byggd med Next.js 16 (App Router), TypeScript och Tailwind CSS 4. All bokning
sker via Clientos inbäddade widget. Det finns ingen egen backend, databas eller
API-nyckel.

## Kom igång

Kräver Node.js 20.9 eller senare.

```bash
npm install        # installera beroenden
npm run dev        # utvecklingsserver på http://localhost:3000
npm run lint       # ESLint
npm run build      # produktionsbuild
npm start          # kör produktionsbuilden lokalt
```

## Struktur

```text
src/
  app/                  Sidor (/, /tjanster, /om-oss, /galleri, /boka, /kontakt),
                        sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx
                        samt ikoner: icon.svg, favicon.ico, apple-icon.png
  components/
    booking/            ClientoBooking – inbäddad bokningswidget
    gallery/            Bildrad och rutnät med lightbox
    layout/             Header, mobilmeny, footer
    sections/           Hero, prislista, karta
    ui/                 Knappar, rubriker, logotyp (Wordmark), sociala ikoner m.m.
  data/
    business.ts         Adress, telefon, e-post, öppettider, Cliento-ID, meny
    services.ts         Prislistan
    images.ts           Alla bildreferenser och alt-texter
  lib/seo.ts            Metadata-hjälpare och strukturerad data (schema.org)
public/images/          Kundens bilder
public/icons/           App-ikoner (192/512 px) för webbmanifestet
```

## Logotyp och ikoner

Märket är vektoriserat från kundens bild och finns i två varianter:

- `public/logo-mark.svg` – logotypen i headern och mobilmenyn
- `src/app/icon.svg` – favicon (samma motiv på en ljus rundad platta)

Från samma vektor är `src/app/favicon.ico`, `src/app/apple-icon.png` och
`public/icons/icon-192.png`/`icon-512.png` (webbmanifestet) genererade.
Byter ni logotyp: ersätt SVG-filerna och generera om PNG/ICO-filerna.

## Lägga till kundens bilder

1. Lägg bildfilerna i `public/images/`, t.ex. `public/images/hero.jpg`.
   Använd JPG eller WebP med minst 2000 px på längsta sidan. Next.js
   optimerar och skalar bilderna automatiskt.
2. Öppna `src/data/images.ts` och fyll i `src` för respektive plats:
   ```ts
   hero: {
     src: "/images/hero.jpg",
     alt: "Barberare som formar en fade hos Silverkammen",
     position: "50% 30%", // valfritt: styr beskärningen
   },
   ```
3. Galleriet fylls på i listan `gallery` i samma fil. Ordningen där blir
   ordningen på sidan.
4. Skriv alt-texter som beskriver vad som faktiskt syns på bilden.

Så länge `src` saknas visas en neutral platta, så att sidan alltid går att
bygga. Kontrollera att filnamnet stämmer exakt, eftersom stora och små
bokstäver spelar roll på Vercel.

Bildplatser i `images.ts`: `hero` (startsidans stora bild och Om oss) och
`about` (Om oss). Galleriet (`gallery`) visas både som horisontell rad under
hero och som rutnät på `/galleri`, och beskärs automatiskt till kvadrater.
För hero passar en liggande bild i hög upplösning bäst på dator.

## Uppdatera företagsinformation och priser

- **Öppettider** hämtas automatiskt från Silverkammens bokningssida hos
  Cliento (`src/lib/cliento.ts`). Ändras tiderna i Cliento uppdateras footer,
  kontaktsidan och Google-datan inom ungefär en timme, utan ny deploy.
  Clientos dokumenterade API saknar öppettider, så de läses från den publika
  bokningssidan. Går det inte används reservtiderna i `src/data/business.ts`
  (`fallbackOpeningHours`) och ett meddelande skrivs i serverloggen.
- **Kontaktuppgifter, adress och sociala medier:** `src/data/business.ts`.
  Ändringarna slår igenom i header, footer, kontaktsidan och den strukturerade
  datan för Google.
- **Priser och behandlingar:** `src/data/services.ts`. Cliento är alltid den
  slutliga källan för vad som går att boka och till vilket pris. Ändras något
  i Cliento ska prislistan här uppdateras på samma sätt.

## Cliento-bokningen

`src/components/booking/ClientoBooking.tsx` bäddar in Clientos widget-v3 enligt
[Clientos dokumentation](https://developers.cliento.com/docs/widget).

- Widget-ID:t finns i `business.booking.clientoWidgetId`.
- Scriptet laddas bara på `/boka`, en gång per sidladdning, efter att
  containern `#cliento-booking` finns i DOM:en.
- Inställningar skickas via Clientos dokumenterade parametrar: `id`, `locale`
  och `style.primaryColor`.
- Färger och hörnradier finjusteras med Clientos officiella CSS-variabler i
  `src/app/globals.css` (klassen `cliento-custom-theme` på `<body>`).
  Typsnittet ärvs från webbplatsen.
- Medan widgeten laddar visas ett diskret laddningsläge. Om scriptet blockeras
  eller inget har renderats efter 15 sekunder visas en länk till Clientos egen
  bokningssida, plus telefonnummer.
- Clientos widget kan inte initieras om utan en ny sidladdning. Next.js behåller
  normalt `/boka` dold i bakgrunden vid navigering, så widgeten och vald tjänst
  finns kvar när man kommer tillbaka. Har Next rensat bort sidan laddas `/boka`
  om automatiskt.

## Domän och SEO

Domänen är `https://silverkammen.se` och anges i `src/data/business.ts`
(`business.url`). Den används i canonical-taggar, Open Graph, `sitemap.xml`,
`robots.txt` och strukturerad data. Ingen miljövariabel behövs.

Strukturerad data (schema.org `HairSalon`) innehåller bara verifierade
uppgifter: namn, adress, telefon, e-post, öppettider och tjänster med priser.

## Deploy till Vercel

1. Pusha projektet till ett Git-repo (GitHub, GitLab eller Bitbucket).
2. Välj **Add New → Project** i Vercel och importera repot. Next.js upptäcks
   automatiskt, så inga build-inställningar behöver ändras.
3. Koppla domänen under **Settings → Domains** och kör en ny deploy, så att
   canonical-taggar och sitemap använder rätt domän.
