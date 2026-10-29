"use client";

import { useEffect } from "react";

/**
 * Justerar PIN-fältet i Clientos bekräftelsesteg.
 *
 * Widgeten har "PIN" som fast platshållare och visar "måste fyllas i" så
 * fort fältet tappar fokus. Inget av det går att ställa in, så här sätts
 * platshållaren direkt på fältet, och formuläret markeras när kunden har
 * försökt skicka (`data-sk-submitted`). CSS:en i globals.css visar
 * felmeddelandet först då. Ändrar Cliento sin struktur hittas inget fält,
 * och widgeten beter sig som vanligt.
 */

const PIN_INPUT = 'input[name="code"]';

export function ClientoPinField() {
  useEffect(() => {
    const prepare = () => {
      document.querySelectorAll<HTMLInputElement>(PIN_INPUT).forEach((input) => {
        if (input.dataset.skPin) return;
        input.dataset.skPin = "1";
        input.placeholder = "123456";
        input.inputMode = "numeric";
        input.autocomplete = "one-time-code";
      });
    };

    const markSubmitted = (e: Event) => {
      const form = e.target;
      if (form instanceof HTMLFormElement && form.querySelector(PIN_INPUT)) {
        form.dataset.skSubmitted = "1";
      }
    };

    const observer = new MutationObserver(prepare);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("submit", markSubmitted, true);
    prepare();
    return () => {
      observer.disconnect();
      document.removeEventListener("submit", markSubmitted, true);
    };
  }, []);

  return null;
}
