"use client";

import { Canvas } from "@react-three/fiber";
import { memo, Suspense, useRef } from "react";
import GradientPlane from "./GradientPlane";
import ThreeCanvasAnimations from "./ThreeCanvasAnimations";
import SVGShape from "./SVGShape";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { colorArray, settingsArraySVG, posArray } from "./ThreeUtils";
import { useStore } from "@/store/store";
import SVGSevenShape from "./SVGSevenShape";
import { useDevice } from "@/app/(appLayout)/utils/utils";

const GradientBackgroundMemo = memo(GradientPlane);
const SVGShapeMemo = memo(SVGShape);
const SVGSevenShapeMemo = memo(SVGSevenShape);

export const ThreeCanvas = ({ isReady }: { isReady: boolean }) => {
  const svgMaterialRef = useRef<any>(null);
  const bgMaterialRef = useRef<any>(null);
  const sevenMaterialRef = useRef<any>(null);
  const { currentStoreIndex, language } = useStore();
  const device = useDevice();

  useGSAP(() => {
    if (
      !svgMaterialRef.current ||
      !bgMaterialRef.current ||
      !sevenMaterialRef.current
    )
      return;
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
        [
          svgMaterialRef.current.uniforms[s.color].value,
          sevenMaterialRef.current.uniforms[s.color].value,
        ],
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
    if (
      !svgMaterialRef.current ||
      !bgMaterialRef.current ||
      !sevenMaterialRef.current
    )
      return;
    const tl = gsap.timeline();
    tl.to(bgMaterialRef.current.uniforms.uOffset, {
      duration: 0.75,
      ease: "expo.inOut",
      value: currentStoreIndex <= 0 ? 0 : 0.4,
      delay: currentStoreIndex <= 0 ? 0.4 : 0,
    });

    tl.to(
      device === "desktop" || device === "tablet"
        ? svgMaterialRef.current.uniforms.uAlpha
        : sevenMaterialRef.current.uniforms.uAlpha,
      {
        duration: 0.75,
        ease: "expo.inOut",
        value: currentStoreIndex <= 0 ? 1.0 : 0.0,
        delay: currentStoreIndex <= 0 ? 0.0 : 0.0,
      },
      "<"
    );
  }, [currentStoreIndex, device]);

  return (
    <div className="w-screen h-screen" style={{ backgroundColor: "#D9D9D9" }}>
      <Canvas
        className="w-screen h-screen"
        camera={{ position: [0, 0, 1], zoom: 1.5, near: 0.1, far: 100 }}
        linear
        flat
      >
        <Suspense fallback={null}>
          <ThreeCanvasAnimations
            svgMaterialRef={svgMaterialRef}
            bgMaterialRef={bgMaterialRef}
            sevenMaterialRef={sevenMaterialRef}
            isReady={isReady}
          >
            <GradientBackgroundMemo ref={bgMaterialRef} />
            <SVGShapeMemo ref={svgMaterialRef} />
            <SVGSevenShapeMemo ref={sevenMaterialRef} />
          </ThreeCanvasAnimations>
        </Suspense>
      </Canvas>
    </div>
  );
};
