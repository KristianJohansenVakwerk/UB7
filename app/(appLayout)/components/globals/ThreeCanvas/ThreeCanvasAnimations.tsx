"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import * as THREE from "three";
import { colorArray } from "./ThreeUtils";
import { useStore } from "@/store/store";
import { useDevice } from "@/app/(appLayout)/utils/utils";

const ThreeCanvasAnimations = (props: any) => {
  const { svgMaterialRef, bgMaterialRef, sevenMaterialRef, isReady } = props;
  const { setIntroStoreDone } = useStore();
  const device = useDevice();

  const tl = useRef<any>(null);

  useGSAP(() => {
    if (
      !svgMaterialRef.current ||
      !bgMaterialRef.current ||
      !sevenMaterialRef.current
    )
      return;

    gsap.set(svgMaterialRef.current.uniforms.uAlpha, {
      value: 0.0,
    });

    gsap.set(sevenMaterialRef.current.uniforms.uAlpha, {
      value: 0.0,
    });

    tl.current = gsap.timeline({
      paused: true,
      onComplete: () => setIntroStoreDone(true),
    });

    tl.current.to(bgMaterialRef.current, {
      uOffset: 0.0,
      duration: 1.5,
      ease: "power2.out",
    });

    if (device === "mobile" || device === "tablet") {
      tl.current.to(
        [sevenMaterialRef.current],
        {
          uOffset: 0.0,
          uAlpha: 1.0,
          duration: 1.2,
          ease: "power2.out",
        },
        "<+0.5"
      );
    }

    tl.current.to(
      [svgMaterialRef.current],
      {
        uOffset: 0.0,
        uAlpha: 1.0,
        duration: 1.2,
        ease: "power2.out",
      },
      device === "desktop" ? "<+0.5" : "<+1.5"
    );

    if (device === "mobile") {
      tl.current.to(
        svgMaterialRef.current.uniforms.uAlpha,
        {
          duration: 0.5,
          ease: "none",
          value: 0.0,
        },
        "<+1.0"
      );
    }
  }, [device]);

  useGSAP(() => {
    if (!tl.current || !isReady) return;

    // gsap.killTweensOf(tl.current);

    setTimeout(() => {
      tl.current.play();
    }, 0);
  }, [isReady]);

  return <>{props.children}</>;
};

export default ThreeCanvasAnimations;
