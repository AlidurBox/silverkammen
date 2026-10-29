import type { ComponentPropsWithoutRef, ElementType } from "react";

type ContainerProps<T extends ElementType> = {
  as?: T;
  /** "narrow" för textinnehåll och prislistor */
  size?: "default" | "narrow";
} & ComponentPropsWithoutRef<T>;

export function Container<T extends ElementType = "div">({
  as,
  size = "default",
  className = "",
  ...props
}: ContainerProps<T>) {
  const Tag = as ?? "div";
  const width = size === "narrow" ? "max-w-3xl" : "max-w-[80rem]";
  return <Tag className={`mx-auto w-full px-5 sm:px-8 ${width} ${className}`} {...props} />;
}
