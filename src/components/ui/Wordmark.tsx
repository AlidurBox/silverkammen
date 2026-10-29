import Image from "next/image";

/** Logotyp: märket (public/logo-mark.svg) + namnet. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 min-[380px]:gap-2.5 ${className}`}>
      <Image
        src="/logo-mark.svg"
        alt=""
        width={44}
        height={44}
        unoptimized
        priority
        className="size-9 shrink-0 min-[380px]:size-10 lg:size-11"
      />
      <span className="font-logo text-[1.25rem] leading-none min-[380px]:text-[1.375rem] font-semibold whitespace-nowrap lg:text-[1.5rem]">
        Silver Kammen
      </span>
    </span>
  );
}
