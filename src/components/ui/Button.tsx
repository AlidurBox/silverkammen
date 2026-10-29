import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import type { ReactNode } from "react";
import { BOOKING_PATH } from "@/data/business";

type Variant = "primary" | "outline" | "white";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-smoke",
  outline: "border border-ink/25 text-ink hover:border-ink",
  white: "bg-white text-ink hover:bg-sand",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  /** Egen ikon. Standard: kalender för bokning, annars pil. */
  icon?: ReactNode;
};

const iconClass = "size-[1.125rem] shrink-0";

function defaultIcon(href: string, external: boolean) {
  if (href === BOOKING_PATH) return <CalendarDays aria-hidden className={iconClass} strokeWidth={1.75} />;
  if (external) return <ArrowUpRight aria-hidden className={iconClass} strokeWidth={1.75} />;
  return <ArrowRight aria-hidden className={iconClass} strokeWidth={1.75} />;
}

/** Rundad knapp (pill) med ikon. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
  icon,
}: ButtonLinkProps) {
  const classes = `inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 text-[0.9375rem] font-medium transition-colors duration-200 ${variants[variant]} ${className}`;
  const content = (
    <>
      {icon ?? defaultIcon(href, external)}
      {children}
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
        <span className="sr-only"> (öppnas i ny flik)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

/** Diskret textlänk med pil. */
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 text-[0.9375rem] font-medium underline decoration-ink/25 underline-offset-[6px] transition-colors hover:decoration-ink ${className}`}
    >
      {children}
      <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
    </Link>
  );
}
