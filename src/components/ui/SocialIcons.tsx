import { business } from "@/data/business";

/** Varumärkesikoner (lucide-react saknar sådana). */
export function InstagramIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3Z" />
    </svg>
  );
}

const links = [
  { label: "Instagram", href: business.instagram.url, Icon: InstagramIcon },
  { label: "Facebook", href: business.facebook.url, Icon: FacebookIcon },
];

/** Runda ikonlänkar till sociala medier. */
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex gap-3 ${className}`}>
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            <Icon />
            <span className="sr-only">{label} (öppnas i ny flik)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
