import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { BOOKING_PATH } from "@/data/business";
import { formatDuration, formatPrice, type Service } from "@/data/services";

type PriceListProps = {
  services: Service[];
  /** Visar beskrivningar i korten */
  detailed?: boolean;
};

/** Tjänster som mjuka kort med pris, tid och bokningslänk. */
export function PriceList({ services, detailed = false }: PriceListProps) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      {services.map((s) => (
        <li key={s.id}>
          <Link
            href={BOOKING_PATH}
            aria-label={`Boka ${s.name}, ${formatDuration(s.duration)}, ${formatPrice(s)}`}
            className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgb(29_27_25/0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-[0_12px_32px_-12px_rgb(29_27_25/0.18)] sm:p-6"
          >
            <span className="flex items-start justify-between gap-4">
              <span className="text-lg font-semibold tracking-[-0.01em]">{s.name}</span>
              {s.featured && (
                <span className="shrink-0 rounded-full bg-bronze/10 px-2.5 py-1 text-xs font-medium text-bronze">
                  Populär
                </span>
              )}
            </span>

            {s.addon && <span className="mt-1.5 text-sm text-bronze">{s.addon}</span>}
            {detailed && (
              <span className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{s.description}</span>
            )}

            <span className="mt-auto flex items-end justify-between gap-4 pt-5">
              <span>
                <span className="block text-2xl font-semibold tracking-[-0.02em]">{formatPrice(s)}</span>
                <span className="mt-1 inline-flex items-center gap-1.5 text-sm text-stone">
                  <Clock aria-hidden className="size-3.5" strokeWidth={1.75} />
                  {formatDuration(s.duration)}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors group-hover:bg-smoke">
                Boka
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
