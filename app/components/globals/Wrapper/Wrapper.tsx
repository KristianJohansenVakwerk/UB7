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

  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 500);
  }, []);

  return (
    <>
      <main
        className={cn(
          "relative flex flex-col grow opacity-0",
          className,
          ready && "opacity-100"
        )}
        {...props}
      >
        {children}
      </main>
      {lenis && (
        <Lenis
          root
          options={typeof lenis === "object" ? lenis : {}}
          onProgress={onProgress}
        />
      )}
    </>
  );
}
