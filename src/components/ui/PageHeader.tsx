import type { ReactNode } from "react";
import { Container } from "./Container";
import { JsonLd } from "./JsonLd";
import { SectionHeading } from "./SectionHeading";
import { breadcrumbJsonLd } from "@/lib/seo";

type PageHeaderProps = {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Sökväg och namn för brödsmulor i strukturerad data */
  path: string;
  name: string;
  children?: ReactNode;
};

/** Gemensamt, centrerat sidhuvud för alla undersidor. */
export function PageHeader({ label, title, intro, path, name, children }: PageHeaderProps) {
  return (
    <header className="pt-14 pb-10 sm:pt-20 sm:pb-14">
      <Container>
        <SectionHeading as="h1" label={label} title={title} intro={intro} />
        {children && <div className="mt-8 flex justify-center">{children}</div>}
      </Container>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Hem", path: "/" },
          { name, path },
        ])}
      />
    </header>
  );
}
