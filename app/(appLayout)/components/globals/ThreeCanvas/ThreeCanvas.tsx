"use client";

import { Canvas } from "@react-three/fiber";
import { memo, Suspense, useRef, useState } from "react";
import GradientPlane from "./GradientPlane";
import ThreeCanvasAnimations from "./ThreeCanvasAnimations";
import SVGShape from "./SVGShape";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { colorArray, settingsArraySVG, posArray } from "./ThreeUtils";
import { useStore } from "@/store/store";

const GradientBackgroundMemo = memo(GradientPlane);
const SVGShapeMemo = memo(SVGShape);

export const ThreeCanvas = ({ isReady }: { isReady: boolean }) => {
  const svgMaterialRef = useRef<any>(null);
  const bgMaterialRef = useRef<any>(null);

  const { currentStoreIndex, language, introStoreDone } = useStore();

  useGSAP(() => {
    if (!svgMaterialRef.current || !bgMaterialRef.current) return;
    const tl = gsap.timeline();

    for (const color of colorArray) {
      tl.to(
        [bgMaterialRef.current.uniforms[color.name].value],
        {
          duration: 0.8,
          ease: "power2.inOut",
          ...(language === "en" ? color.valueEn : color.valuePt),
        },
        "<"
      );
    }

    for (const s of settingsArraySVG) {
      tl.to(
        svgMaterialRef.current.uniforms[s.color].value,
        {
          duration: 0.8,
          ease: "power2.inOut",
          ...(language === "en" ? s.valueEn : s.valuePt),
        },
        "<"
      );

      tl.to(
        svgMaterialRef.current.uniforms[s.pos],
        {
          duration: 0.8,
          ease: "power2.inOut",
          value: language === "en" ? s.valuePosEn : s.valuePosPt,
        },
        "<"
      );
    }

    for (const pos of posArray) {
      tl.to(
        bgMaterialRef.current.uniforms[pos.name],
        {
          duration: 0.8,
          ease: "power2.inOut",
          value: language === "en" ? pos.valueEn : pos.valuePt,
        },
        "<"
      );
    }
  }, [language]);

  useGSAP(() => {
    if (!svgMaterialRef.current || !bgMaterialRef.current) return;
    const tl = gsap.timeline();
    tl.to(bgMaterialRef.current.uniforms.uOffset, {
      duration: 0.75,
      ease: "expo.inOut",
      value: currentStoreIndex <= 0 ? 0 : 0.3,
      delay: currentStoreIndex <= 0 ? 0.4 : 0,
    });

    tl.to(
      svgMaterialRef.current.uniforms.uAlpha,
      {
        duration: 0.75,
        ease: "expo.inOut",
        value: currentStoreIndex <= 0 ? 1.0 : 0.0,
        delay: currentStoreIndex <= 0 ? 0.6 : 0.3,
      },
      "<"
    );
  }, [currentStoreIndex]);

  return (
    <div className="w-screen h-screen" style={{ backgroundColor: "#D9D9D9" }}>
      {/* <div
        className="fixed inset-3 z-10"
        onClick={() => setColorScheme(colorScheme === "en" ? "pt" : "en")}
      >
        Change color scheme
      </div>
      <div
        className="fixed right-3 top-3 z-10"
        onClick={() => setMinMax(minMax === "min" ? "max" : "min")}
      >
        Min/Max
      </div> */}
      <Canvas
        className="w-screen h-screen"
        camera={{ position: [0, 0, 1], zoom: 1.5, near: 0.1, far: 100 }}
      >
        <Suspense fallback={null}>
          <ThreeCanvasAnimations
            svgMaterialRef={svgMaterialRef}
            bgMaterialRef={bgMaterialRef}
            isReady={isReady}
          >
            <GradientBackgroundMemo ref={bgMaterialRef} />
            <SVGShapeMemo ref={svgMaterialRef} />
          </ThreeCanvasAnimations>
        </Suspense>
      </Canvas>
    </div>
  );
};
