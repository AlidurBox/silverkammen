import Link from "next/link";
import { BOOKING_PATH, business, formatHours, navigation } from "@/data/business";
import { getOpeningHours } from "@/lib/cliento";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialIcons";
import { CurrentYear } from "./CurrentYear";

const heading = "label mb-5 text-ink";
const link = "text-stone transition-colors hover:text-ink";

export async function Footer() {
  const openingHours = await getOpeningHours();

  return (
    <footer className="border-t border-line bg-sand">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
        <nav aria-label="Sidfot">
          <h2 className={heading}>Information</h2>
          <ul className="space-y-2.5">
            <li>
              <Link href={BOOKING_PATH} className={link}>
                Boka tid
              </Link>
            </li>
            {navigation.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={heading}>Hitta hit</h2>
          <address className="not-italic text-stone">
            {business.address.street}
            <br />
            {business.address.postalCode} {business.address.city}
          </address>
          <a
            href={business.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="label mt-5 inline-block text-bronze hover:text-ink"
          >
            Se på karta →<span className="sr-only"> (öppnas i ny flik)</span>
          </a>
        </div>

        <div>
          <h2 className={heading}>Kontakt</h2>
          <ul className="space-y-2.5">
            <li>
              <a href={business.phone.href} className={link}>
                {business.phone.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className={`${link} break-all`}>
                {business.email}
              </a>
            </li>
          </ul>
          <SocialLinks className="mt-6" />
        </div>

        <div>
          <h2 className={heading}>Öppettider</h2>
          <dl className="space-y-1.5 text-stone">
            {openingHours.map((h) => (
              <div key={h.day} className="flex justify-between gap-6 sm:max-w-60">
                <dt>{h.day}</dt>
                <dd className="tabular-nums">{formatHours(h)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-line py-6 text-sm text-stone sm:flex-row sm:justify-between">
        <p>
          © <CurrentYear /> {business.name}
        </p>
        <p>
          Onlinebokning via{" "}
          <a
            href={business.booking.clientoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-ink"
          >
            Cliento
          </a>
        </p>
      </Container>
    </footer>
  );
}
