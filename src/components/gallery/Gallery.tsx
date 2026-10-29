"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { SiteImage } from "@/data/images";

type GalleryProps = {
  items: SiteImage[];
  /** "strip": horisontell bildrad. "grid": rutnät. */
  variant: "strip" | "grid";
  placeholderCount?: number;
};

const styles = {
  strip: {
    list: "scrollbar-none -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 lg:[&>li:first-child]:ml-auto lg:[&>li:last-child]:mr-auto",
    item: "relative size-36 shrink-0 snap-start overflow-hidden rounded-lg bg-sand-deep sm:size-44 lg:size-48",
    sizes: "(min-width: 1024px) 192px, (min-width: 640px) 176px, 144px",
  },
  grid: {
    list: "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:gap-4",
    item: "relative aspect-square overflow-hidden rounded-lg bg-sand-deep",
    sizes: "(min-width: 1440px) 440px, (min-width: 640px) 33vw, 50vw",
  },
};

export function Gallery({ items, variant, placeholderCount = 6 }: GalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStart = useRef<number | null>(null);
  const openedFrom = useRef<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const isOpen = index !== null;
  const s = styles[variant];

  const open = (i: number) => {
    openedFrom.current = i;
    setIndex(i);
    dialogRef.current?.showModal();
  };

  const close = useCallback(() => dialogRef.current?.close(), []);

  const step = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setIndex(null);
      // Återställ fokus till bilden som öppnades.
      if (openedFrom.current !== null) triggerRefs.current[openedFrom.current]?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("keydown", onKey);
    return () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("keydown", onKey);
    };
  }, [step]);

  // Lås scroll bakom lightboxen.
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [isOpen]);

  if (items.length === 0) {
    return (
      <ul className={s.list} aria-label="Galleriet fylls snart med bilder">
        {Array.from({ length: placeholderCount }, (_, i) => (
          <li key={i} className={s.item} />
        ))}
      </ul>
    );
  }

  const current = index !== null ? items[index] : null;

  return (
    <>
      <ul className={s.list}>
        {items.map((image, i) => (
          <li key={image.src ?? i} className={s.item}>
            <button
              ref={(el) => {
                triggerRefs.current[i] = el;
              }}
              type="button"
              onClick={() => open(i)}
              aria-haspopup="dialog"
              className="group absolute inset-0 block size-full cursor-zoom-in"
            >
              {image.src && (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={s.sizes}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  style={image.position ? { objectPosition: image.position } : undefined}
                />
              )}
              <span className="sr-only">Visa större: {image.alt}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Bildvisning"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-ink/95 p-0 text-paper backdrop:bg-ink/70"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onTouchStart={(e) => {
          touchStart.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStart.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        {current?.src && (
          <div className="flex h-full flex-col">
            <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
              <p className="text-sm text-paper/60" aria-live="polite">
                {index! + 1} / {items.length}
              </p>
              <button
                type="button"
                onClick={close}
                autoFocus
                className="inline-flex size-11 items-center justify-center rounded-full text-paper/80 hover:text-paper"
              >
                <X aria-hidden className="size-6" strokeWidth={1.5} />
                <span className="sr-only">Stäng</span>
              </button>
            </div>

            <figure className="relative mx-4 flex-1 sm:mx-20">
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </figure>
            <p className="mx-auto max-w-xl px-6 py-5 text-center text-sm text-paper/70">
              {current.alt}
            </p>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="absolute top-1/2 left-3 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-paper hover:bg-white/20 sm:inline-flex"
                >
                  <ChevronLeft aria-hidden className="size-6" strokeWidth={1.5} />
                  <span className="sr-only">Föregående bild</span>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="absolute top-1/2 right-3 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-paper hover:bg-white/20 sm:inline-flex"
                >
                  <ChevronRight aria-hidden className="size-6" strokeWidth={1.5} />
                  <span className="sr-only">Nästa bild</span>
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
