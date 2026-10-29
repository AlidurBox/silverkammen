import Image from "next/image";
import type { SiteImage as SiteImageData } from "@/data/images";

type SiteImageProps = {
  image: SiteImageData;
  /** `sizes` för responsiva bilder, t.ex. "(min-width: 1024px) 50vw, 100vw" */
  sizes: string;
  className?: string;
  /** Hero/LCP-bild – laddas direkt med hög prioritet */
  eager?: boolean;
};

/**
 * Bild som fyller sin förälder (som måste ha position och storlek).
 * Saknas `src` visas en neutral platta så att layouten alltid håller.
 */
export function SiteImage({ image, sizes, className = "", eager = false }: SiteImageProps) {
  if (!image.src) {
    return <div aria-hidden className={`absolute inset-0 bg-sand-deep ${className}`} />;
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      className={`object-cover ${className}`}
      style={image.position ? { objectPosition: image.position } : undefined}
    />
  );
}
