"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Phone } from "lucide-react";
import { BOOKING_PATH, business, navigation } from "@/data/business";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { MobileNavigation } from "./MobileNavigation";

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-md">
      <Container className="flex h-(--header-h) items-center justify-between gap-6">
        <Link href="/" aria-label="Silverkammen – till startsidan">
          <Wordmark />
        </Link>

        <nav aria-label="Huvudmeny" className="hidden lg:block">
          <ul className="flex items-center gap-8 xl:gap-10">
            {navigation.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`label inline-flex items-center gap-2 py-2 transition-colors ${
                      active ? "text-ink" : "text-ink/55 hover:text-ink"
                    }`}
                  >
                    {active && <span aria-hidden className="size-1 rounded-full bg-ink" />}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={business.phone.href}
            aria-label={`Ring ${business.phone.display}`}
            className="inline-flex size-11 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-paper transition-colors hover:bg-smoke min-[380px]:w-auto min-[380px]:px-5"
          >
            <Phone aria-hidden className="size-4" strokeWidth={1.75} />
            <span className="sr-only min-[380px]:not-sr-only">Ring</span>
          </a>
          <Link
            href={BOOKING_PATH}
            aria-current={pathname === BOOKING_PATH ? "page" : undefined}
            className="hidden min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-smoke lg:inline-flex"
          >
            <CalendarDays aria-hidden className="size-4" strokeWidth={1.75} />
            Boka tid
          </Link>
          <MobileNavigation pathname={pathname} />
        </div>
      </Container>
    </header>
  );
}
