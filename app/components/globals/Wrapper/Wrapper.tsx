"use client";

import cn from "clsx";
import type { LenisOptions } from "lenis";
import { usePathname } from "next/navigation";
import { type ComponentProps, useEffect } from "react";

import { Lenis } from "../lenis";

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: Theme;
  lenis?: boolean | LenisOptions;
  webgl?: boolean | Omit<ComponentProps<typeof Canvas>, "children">;
}

export function Wrapper({
  children,
  className,
  lenis = true,

  ...props
}: WrapperProps) {
  return (
    <>
      <main className={cn("relative flex flex-col grow", className)} {...props}>
        {children}
      </main>
      {lenis && <Lenis root options={typeof lenis === "object" ? lenis : {}} />}
    </>
  );
}
