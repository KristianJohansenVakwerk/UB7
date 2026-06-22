"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useLayoutEffect } from "react";

export function ScrollTriggerConfig() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ markers: false });
  }, []);

  return null;
}
