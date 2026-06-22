"use client";
import * as THREE from "three";
import { forwardRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { fragmentShader } from "./fragmentShader";
import { vertexShader } from "./vertexShader";
import { useStore } from "@/store/store";
import {
  colorArrayEn,
  colorArrayPt,
  posEnArray,
  posPtArray,
} from "./ThreeUtils";
import { scrollIntentSignal } from "@/app/(appLayout)/hooks/scrollIntentSignal";

// How far scrollIntent (-1..1) can push uOffset visually. Small enough to feel like a
// rubber-band preview rather than a section change.
const INTENT_OFFSET_RANGE = 0.08;

// Shader material
export const GradientMaterial = shaderMaterial(
  {
    iResolution: new THREE.Vector2(1, 1),
    uOffset: 0,
    uIntentOffset: 0,
    uSize: 1.0,
    color0: new THREE.Color(0.0157, 0.4627, 0.2314),
    color1: new THREE.Color(0.4941, 0.9804, 0.3137),
    color2: new THREE.Color(0.996, 1.0, 0.761),
    color3: new THREE.Color(0.851, 0.851, 0.851),
    pos0: 0.1,
    pos1: 0.538462,
    pos2: 0.6,
    pos3: 1.0,
    uAlpha: 1.0,
    uSvg: 0.0,
    uLinearBg: 0.0,
  },
  // vertex shader
  vertexShader,
  // fragment shader
  fragmentShader
);

extend({ GradientMaterial });

const GradientBackground = forwardRef<any, any>((props: any, ref: any) => {
  const { size } = useThree();

  const { language } = useStore();

  const defaultColors = language === "en" ? colorArrayEn : colorArrayPt;
  const defaultPositions = language === "en" ? posEnArray : posPtArray;

  useFrame(() => {
    if (!ref.current) return;
    ref.current.iResolution.set(size.width, size.height);
    ref.current.uIntentOffset = scrollIntentSignal.value * INTENT_OFFSET_RANGE;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[3, 2]} />
      {/* @ts-ignore */}
      <gradientMaterial
        ref={ref}
        depthWrite={false}
        depthTest={false}
        uOffset={1.0}
        color0={defaultColors[0]}
        color1={defaultColors[1]}
        color2={defaultColors[2]}
        color3={defaultColors[3]}
        pos0={defaultPositions[0]}
        pos1={defaultPositions[1]}
        pos2={defaultPositions[2]}
        pos3={defaultPositions[3]}
        uSvg={0.0}
        uLinearBg={1.0}
      />
    </mesh>
  );
});

export default GradientBackground;
