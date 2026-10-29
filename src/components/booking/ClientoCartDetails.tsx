"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Gör Clientos varukorgsrad ("3 tjänster · 1 150 kr") utfällbar, så att
 * kunden kan se vilka tjänster som är valda.
 *
 * Clientos widget saknar den funktionen och ett dokumenterat API för det,
 * så de valda tjänsterna läses från widgetens markeringar ("Vald"). Ändrar
 * Cliento sin struktur hittas helt enkelt inget – då visas ingen utfällning
 * och bokningen fungerar som vanligt.
 */

type Selected = { name: string; meta: string };

const SUMMARY = ".cb-service-cart-summary";
const CART = ".cb-service-cart";

function readSelected(): Selected[] {
  const seen = new Set<string>();
  const result: Selected[] = [];
  document.querySelectorAll<HTMLElement>("#cliento-booking .cb-service-item-header").forEach((item) => {
    const button = item.querySelector(".cb-service-item-cta button");
    if (button?.textContent?.trim() !== "Vald") return;
    // Widgeten renderar listan i två layouter – räkna bara den synliga.
    if (item.offsetParent === null) return;
    const name = item.querySelector(".cb-service-details-title")?.textContent?.trim();
    if (!name || seen.has(name)) return;
    seen.add(name);
    const meta = [...item.querySelectorAll(".cb-service-details-label span")]
      .map((s) => s.textContent?.replace(/ /g, " ").trim())
      .filter(Boolean)
      .join(" · ");
    result.push({ name, meta });
  });
  return result;
}

export function ClientoCartDetails() {
  const [selected, setSelected] = useState<Selected[]>([]);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ left: number; width: number; bottom: number } | null>(null);
  const openRef = useRef(open);

  // Följ widgetens markeringar och varukorgens position.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cart = document.querySelector<HTMLElement>(CART);
        const items = cart ? readSelected() : [];
        setSelected((prev) =>
          prev.length === items.length && prev.every((p, i) => p.name === items[i].name) ? prev : items,
        );
        if (cart && items.length > 0) {
          const r = cart.getBoundingClientRect();
          setRect({ left: r.left, width: r.width, bottom: window.innerHeight - r.top + 8 });
        } else {
          setRect(null);
          setOpen(false);
        }

        // Gör sammanfattningen till en tillgänglig knapp.
        const summary = cart?.querySelector<HTMLElement>(SUMMARY);
        if (summary && !summary.dataset.skToggle) {
          summary.dataset.skToggle = "1";
          summary.setAttribute("role", "button");
          summary.setAttribute("tabindex", "0");
          summary.setAttribute("aria-controls", "sk-cart-details");
          const toggle = () => setOpen((o) => !o);
          summary.addEventListener("click", toggle);
          summary.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          });
        }
        if (summary) {
          summary.setAttribute("aria-expanded", String(openRef.current));
          summary.setAttribute("aria-label", `${openRef.current ? "Dölj" : "Visa"} valda tjänster`);
        }
      });
    };

    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Håll aria-expanded i synk när panelen öppnas/stängs.
  useEffect(() => {
    openRef.current = open;
    const summary = document.querySelector<HTMLElement>(SUMMARY);
    summary?.setAttribute("aria-expanded", String(open));
    summary?.classList.toggle("sk-open", open);
  }, [open]);

  if (!rect || selected.length === 0) return null;

  return createPortal(
    <div
      id="sk-cart-details"
      role="region"
      aria-label="Valda tjänster"
      hidden={!open}
      style={{ left: rect.left, width: rect.width, bottom: rect.bottom }}
      className="fixed z-[2147483646] max-h-[50vh] overflow-y-auto rounded-3xl border border-line bg-white p-2 shadow-[0_16px_40px_-12px_rgb(29_27_25/0.3)]"
    >
      <ul className="divide-y divide-line">
        {selected.map((s) => (
          <li key={s.name} className="flex items-baseline justify-between gap-4 px-4 py-3">
            <span className="font-medium">{s.name}</span>
            <span className="shrink-0 text-sm text-stone">{s.meta}</span>
          </li>
        ))}
      </ul>
    </div>,
    document.body,
  );
}
