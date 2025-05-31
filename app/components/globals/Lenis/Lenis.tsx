"use client";

import type { LenisOptions } from "lenis";
// import "lenis/dist/lenis.css";
import type { LenisRef, LenisProps as ReactLenisProps } from "lenis/react";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useTempus } from "tempus/react";

interface LenisProps extends Omit<ReactLenisProps, "ref"> {
  root: boolean;
  options: LenisOptions;
  onProgress?: (progress: number) => void;
}

export function Lenis({ root, options, onProgress }: LenisProps) {
  const lenisRef = useRef<LenisRef>(null);

  useTempus((time: number) => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.raf(time);
    }
  });

  return (
    <ReactLenis
      ref={lenisRef}
      root={root}
      options={{
        ...options,
        lerp: options?.lerp ?? 0.07,
        autoRaf: false,
        anchors: true,
        smoothWheel: true,
        touchMultiplier: 2, // Adjust touch sensitivity
        infinite: false,
        orientation: "vertical",
        gestureOrientation: "vertical",
      }}
    />
  );
}
