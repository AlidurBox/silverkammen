import type { ReactNode } from "react";

type SectionHeadingProps = {
  label?: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  label,
  title,
  intro,
  id,
  as: Tag = "h2",
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}>
      {label && <p className="label mb-4 text-bronze">{label}</p>}
      <Tag id={id} className={`font-semibold text-balance ${Tag === "h1" ? "text-h1" : "text-h2"}`}>
        {title}
      </Tag>
      {intro && (
        <p className={`mt-4 text-base leading-relaxed text-stone sm:text-lg ${center ? "mx-auto max-w-xl" : "max-w-xl"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
