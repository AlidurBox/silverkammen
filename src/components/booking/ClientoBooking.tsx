"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { business } from "@/data/business";
import { ClientoCartDetails } from "./ClientoCartDetails";
import { ClientoPinField } from "./ClientoPinField";

/**
 * Inbäddad Cliento-bokningswidget (widget-v3).
 *
 * Så fungerar Clientos script (https://developers.cliento.com/docs/widget):
 *  - Kön `window.cbk.p` fylls med inställningar via `cbk(nyckel, värde)`.
 *  - När cliento.js körs läser den kön EN gång och monterar widgeten i
 *    elementet `#cliento-booking`. Parametrar kan inte ändras i efterhand.
 *
 * Konsekvenser i Next.js App Router:
 *  - Vi renderar containern själva och laddar scriptet först när den finns
 *    i DOM:en (i stället för snippetens document.write-liknande insättning).
 *  - Scriptet laddas max en gång per sidladdning.
 *  - Med Cache Components döljs /boka (Activity) vid navigering i stället
 *    för att avmonteras, så widgeten och dess tillstånd finns kvar när man
 *    kommer tillbaka. Har Next däremot rensat bort sidan och skapat en ny
 *    container kan widgeten inte monteras om – då laddas /boka om på riktigt.
 */

const SCRIPT_SRC = "https://cliento.com/widget-v3/cliento.js";
const CONTAINER_ID = "cliento-booking";
/** Efter så här lång tid utan widget visas reservlänken. */
const TIMEOUT_MS = 15000;

type Status = "loading" | "ready" | "error";

type ClientoQueue = ((...args: unknown[]) => void) & { p: unknown[][] };

type MountRecord = {
  container: HTMLElement;
  status: Status;
  listeners: Set<(s: Status) => void>;
};

declare global {
  interface Window {
    cbk?: ClientoQueue;
    __silverkammenCliento?: MountRecord;
  }
}

function setStatus(record: MountRecord, status: Status) {
  if (record.status === "ready" || record.status === status) return;
  record.status = status;
  record.listeners.forEach((fn) => fn(status));
}

function configureQueue() {
  // Samma kö som Clientos officiella snippet skapar.
  if (!window.cbk) {
    const cbk = function (...args: unknown[]) {
      cbk.p.push(args);
    } as ClientoQueue;
    cbk.p = [];
    window.cbk = cbk;
  }
  // Dokumenterade parametrar: https://developers.cliento.com/docs/widget/parameters
  window.cbk("id", business.booking.clientoWidgetId);
  window.cbk("locale", "sv");
  window.cbk("style", { primaryColor: "#1f1c19" });
  // Egna texter i bekräftelsesteget. `customTexts` är inte dokumenterad men
  // läses av widgeten och skriver över dess svenska texter. Försvinner den
  // visas bara Clientos standardtexter igen.
  window.cbk("customTexts", {
    "verify.confirmHeading": "Bekräfta din bokning",
    "timer.remaining": "Tiden reserveras i {time}",
    // Widgeten skickar bara {phone} till rubriken, så rubrik och undertext
    // byter plats i CSS (se globals.css) för att numret ska hamna i undertexten.
    "verify.confirmPinHeading": "Vi har skickat en 6-siffrig kod till {phone}",
    "verify.confirmPinMessage": "Ange koden från SMS:et",
    "verify.confirmNoPinHeading": "Stämmer uppgifterna?",
    "verify.confirmBooking": "Bekräfta bokning",
    "verify.cancelOrEditBooking": "Ändra bokning",
    "error.wrongPin": "Fel kod, försök igen",
  });
}

function watchForWidget(record: MountRecord) {
  const { container } = record;
  if (container.childElementCount > 0) {
    setStatus(record, "ready");
    return;
  }
  // Observeraren lever kvar efter timeout, så att en sent laddad widget
  // fortfarande ersätter reservläget.
  const observer = new MutationObserver(() => {
    if (container.childElementCount > 0) {
      setStatus(record, "ready");
      observer.disconnect();
      window.clearTimeout(timer);
    }
  });
  observer.observe(container, { childList: true });
  const timer = window.setTimeout(() => {
    if (container.childElementCount === 0) setStatus(record, "error");
  }, TIMEOUT_MS);
}

export function ClientoBooking() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setLocalStatus] = useState<Status>("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let record = window.__silverkammenCliento;

    if (record && record.container !== container) {
      // Widgeten är redan monterad i en tidigare container. Clientos script
      // kan inte initieras om utan en ny sidladdning.
      window.location.reload();
      return;
    }

    if (!record) {
      record = { container, status: "loading", listeners: new Set() };
      window.__silverkammenCliento = record;
      configureQueue();

      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      const current = record;
      script.onerror = () => setStatus(current, "error");
      document.head.appendChild(script);
      watchForWidget(record);
    }

    const active = record;
    active.listeners.add(setLocalStatus);
    setLocalStatus(active.status);
    return () => {
      active.listeners.delete(setLocalStatus);
    };
  }, []);

  return (
    <div className="relative">
      {status === "ready" && <ClientoCartDetails />}
      {status === "ready" && <ClientoPinField />}
      {/* Clientos widget monteras här. React renderar aldrig barn i den. */}
      <div
        id={CONTAINER_ID}
        ref={containerRef}
        aria-busy={status === "loading"}
        className="min-h-[32rem]"
      />

      {status === "loading" && (
        <div
          role="status"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 text-stone"
        >
          <span aria-hidden className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 rounded-full bg-bronze"
                style={{ animation: `sk-pulse 1.2s ${i * 0.18}s infinite ease-in-out` }}
              />
            ))}
          </span>
          <span className="text-sm">Hämtar lediga tider …</span>
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center bg-white px-4 text-center"
        >
          <p className="text-xl font-semibold">Bokningen kunde inte visas här</p>
          <p className="mt-3 max-w-md leading-relaxed text-stone">
            Det kan bero på en blockerare i webbläsaren. Boka direkt hos Cliento
            i stället.
          </p>
          <a
            href={business.booking.clientoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-7 text-[0.9375rem] font-medium text-paper transition-colors hover:bg-smoke"
          >
            Öppna bokningen hos Cliento
            <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
            <span className="sr-only"> (öppnas i ny flik)</span>
          </a>
          <p className="mt-6 text-sm text-stone">
            eller ring{" "}
            <a href={business.phone.href} className="underline underline-offset-4">
              {business.phone.display}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
