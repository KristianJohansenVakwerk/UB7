"use client";

import cn from "clsx";
import type { LenisOptions } from "lenis";

import { Lenis } from "../Lenis/Lenis";
import { useEffect, useState } from "react";

interface WrapperProps {
  children: React.ReactNode;
  className?: string;
  lenis?: boolean | LenisOptions;
  onProgress?: (progress: number) => void;
}

export function Wrapper({
  children,
  className,
  lenis = true,
  onProgress,
  ...props
}: WrapperProps) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <div>
        <main className={cn("relative flex flex-col grow")} {...props}>
          {children}
        </main>
      </div>
      {/* {lenis && (
        <Lenis
          root
          options={typeof lenis === "object" ? lenis : {}}
          onProgress={onProgress}
        />
      )} */}
    </>
  );
}
