import { BOOKING_PATH } from "@/data/business";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60svh] flex-col items-center justify-center py-20 text-center">
      <p className="label mb-4 text-bronze">404</p>
      <h1 className="text-h1 font-semibold">Sidan finns inte</h1>
      <p className="mt-4 max-w-md text-stone">Länken kan vara gammal eller felstavad.</p>
      <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row">
        <ButtonLink href={BOOKING_PATH}>Boka tid</ButtonLink>
        <TextLink href="/">Till startsidan</TextLink>
      </div>
    </Container>
  );
}
