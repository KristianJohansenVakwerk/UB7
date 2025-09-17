"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import * as THREE from "three";
import { colorArray } from "./ThreeUtils";
import { useStore } from "@/store/store";

const ThreeCanvasAnimations = (props: any) => {
  const { svgMaterialRef, bgMaterialRef, isReady } = props;
  const { setIntroStoreDone } = useStore();

  const tl = useRef<any>(null);

  useGSAP(() => {
    if (!svgMaterialRef.current || !bgMaterialRef.current) return;

    gsap.set(svgMaterialRef.current.uniforms.uAlpha, {
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

    tl.current.to(
      svgMaterialRef.current,
      {
        uOffset: 0.0,
        uAlpha: 1.0,
        duration: 1.2,
        ease: "power2.out",
      },
      "<+0.5"
    );

    for (const color of colorArray) {
      tl.current.to(
        svgMaterialRef.current.uniforms[color.name].value,
        {
          duration: 0.5,
          ease: "none",
          ...color.valueEn,
        },
        "<"
      );
    }
  }, []);

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
