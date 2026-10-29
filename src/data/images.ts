/**
 * Central bildkonfiguration.
 *
 * Lägg kundens bilder i `public/images/` och referera dem här, t.ex.
 *   src: "/images/hero.jpg"
 *
 * Saknas `src` visas en stilren placeholder i stället, så att projektet
 * alltid går att bygga. Skriv en alt-text som beskriver vad som faktiskt
 * syns på bilden.
 *
 * `position` styr beskärningen (CSS object-position), t.ex. "50% 30%"
 * för att hålla ett ansikte i bild när bilden beskärs.
 */

export type SiteImage = {
  src?: string;
  alt: string;
  position?: string;
};

/** Alla foton i public/images/ */
const photos = {
  helskagg: {
    src: "/images/helskagg-salongen.jpg",
    alt: "Kund med långt, välvårdat helskägg och bakåtkammat hår i barberarstolen, med salongens stolar, skinnsoffa och barberarstolpe i bakgrunden",
    position: "45% 47%",
  },
  skaggBakatkammat: {
    src: "/images/skagg-bakatkammat.jpg",
    alt: "Trimmat skägg och bakåtkammat hår med fade, i profil framför salongens vägg med affischer och barberarstolpe",
    position: "50% 10%",
  },
  platinablond: {
    src: "/images/platinablond-fade.jpg",
    alt: "Platinablont kort hår med mjuk fade på sidorna, sett i profil",
    position: "50% 32%",
  },
  sidbena: {
    src: "/images/sidbena-skin-fade.jpg",
    alt: "Ung kund med sidbena och skin fade, håret kammat åt sidan",
    position: "50% 40%",
  },
  stjarnor: {
    src: "/images/sidbena-fade-stjarnor.jpg",
    alt: "Bakåtkammad sidbena med skarp delning och fade i nacken",
    position: "50% 38%",
  },
  skaggKontur: {
    src: "/images/skaggtrimning-kontur.jpg",
    alt: "Skäggtrimning med skarp kontur längs kind och hals",
    position: "50% 42%",
  },
} satisfies Record<string, SiteImage>;

export type ImageSlot = "hero" | "about";

export const images: Record<ImageSlot, SiteImage> = {
  /** Startsidans hero och Om oss. Stående bild fungerar bäst. */
  hero: photos.helskagg,
  /** Om oss – andra bilden. */
  about: photos.skaggBakatkammat,
};

/**
 * Galleriet. Ordningen här är ordningen på webbplatsen – både i den
 * horisontella raden "Vårt arbete" på startsidan och på /galleri.
 *
 * Lägg till fler så här:
 *   { src: "/images/galleri-07.jpg", alt: "Kort fade med texturerad topp" },
 */
export const gallery: SiteImage[] = [
  photos.stjarnor,
  photos.helskagg,
  photos.platinablond,
  photos.skaggKontur,
  photos.sidbena,
  photos.skaggBakatkammat,
];

/** Antal placeholder-rutor som visas medan galleriet är tomt. */
export const GALLERY_PLACEHOLDER_COUNT = 6;
