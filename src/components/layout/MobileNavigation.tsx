"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, Phone } from "lucide-react";
import { BOOKING_PATH, business, navigation } from "@/data/business";
import { Wordmark } from "@/components/ui/Wordmark";
import { isActivePath } from "./Header";

/**
 * Mobilmeny byggd på native <dialog>: fokusfälla, Esc-stängning och
 * inert bakgrund kommer från webbläsaren.
 */
export function MobileNavigation({ pathname }: { pathname: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // Lås sidans scroll medan menyn är öppen.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  // Stäng om fönstret blir bredare än mobilbrytpunkten.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && close();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [close]);

  const openMenu = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openMenu}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobilmeny"
        className="-mr-2.5 inline-flex size-11 flex-col items-center justify-center gap-[6px] lg:hidden"
      >
        <span aria-hidden className="h-[1.5px] w-6 bg-ink" />
        <span aria-hidden className="h-[1.5px] w-6 bg-ink" />
        <span aria-hidden className="h-[1.5px] w-6 bg-ink" />
        <span className="sr-only">Öppna meny</span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobilmeny"
        aria-label="Meny"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-ink backdrop:bg-ink/30 open:flex open:flex-col lg:hidden"
      >
        <div className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-line px-5 sm:px-8">
          <Link href="/" onNavigate={close} aria-label="Silverkammen – till startsidan">
            <Wordmark />
          </Link>
          <button
            type="button"
            onClick={close}
            className="-mr-2.5 inline-flex size-11 items-center justify-center"
          >
            <span aria-hidden className="relative block size-5">
              <span className="absolute top-1/2 left-0 h-px w-5 rotate-45 bg-ink" />
              <span className="absolute top-1/2 left-0 h-px w-5 -rotate-45 bg-ink" />
            </span>
            <span className="sr-only">Stäng meny</span>
          </button>
        </div>

        <nav aria-label="Mobilmeny" className="flex-1 overflow-y-auto px-5 pt-6 sm:px-8">
          <ul>
            {navigation.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onNavigate={close}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between border-b border-line py-4 text-[1.375rem] font-medium tracking-[-0.01em] ${
                      active ? "text-ink" : "text-ink/70"
                    }`}
                  >
                    {item.label}
                    {active && <span aria-hidden className="size-1.5 rounded-full bg-ink" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 space-y-1 text-sm text-stone">
            <p>
              {business.address.street}, {business.address.city}
            </p>
          </div>
        </nav>

        <div className="shrink-0 space-y-3 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
          <a
            href={business.phone.href}
            className="flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full border border-ink/15 bg-white text-base font-medium text-ink"
          >
            <Phone aria-hidden className="size-[1.125rem]" strokeWidth={1.75} />
            Ring {business.phone.display}
          </a>
          <Link
            href={BOOKING_PATH}
            onNavigate={close}
            className="flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-ink text-base font-medium text-paper"
          >
            <CalendarDays aria-hidden className="size-[1.125rem]" strokeWidth={1.75} />
            Boka tid
          </Link>
        </div>
      </dialog>
    </>
  );
}
