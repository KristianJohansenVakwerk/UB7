"use client";

import gsap from "gsap";
import { useLayoutEffect } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Tempus from "tempus";
import { ScrollTriggerConfig } from "./scroll-trigger";

gsap.registerPlugin(ScrollTrigger);

export function GSAP({ scrollTrigger = false }) {
  useLayoutEffect(() => {
    gsap.defaults({ ease: "none" });

    // merge rafs
    gsap.ticker.lagSmoothing(0);

    gsap.config({ nullTargetWarn: false, autoSleep: 60, force3D: true });

    gsap.ticker.remove(gsap.updateRoot);
    Tempus?.add((time: number) => {
      gsap.updateRoot(time / 1000);
    });
  }, []);

  if (process.env.NODE_ENV === "development") {
    gsap.ticker.add(() => {
      if (gsap.globalTimeline.getChildren().length > 100) {
        console.warn(
          "Too many active animations:",
          gsap.globalTimeline.getChildren().length
        );
      }
    });
  }

  return scrollTrigger && <ScrollTriggerConfig />;
}
