"use client";
import * as THREE from "three";
import { forwardRef, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { fragmentShader } from "./fragmentShader";
import { vertexShader } from "./vertexShader";

// Shader material
export const GradientMaterial = shaderMaterial(
  {
    iResolution: new THREE.Vector2(1, 1),
    uOffset: 0,
    uSize: 0.7,
    color0: new THREE.Color(0.0157, 0.4627, 0.2314),
    color1: new THREE.Color(0.4941, 0.9804, 0.3137),
    color2: new THREE.Color(0.996, 1.0, 0.761),
    color3: new THREE.Color(0.851, 0.851, 0.851),
    pos0: 0.1,
    pos1: 0.538462,
    pos2: 0.817308,
    pos3: 1.0,
    uAlpha: 1.0,
  },
  // vertex shader
  vertexShader,
  // fragment shader
  fragmentShader
);

extend({ GradientMaterial });

const GradientBackground = forwardRef<any, any>((props: any, ref: any) => {
  const { size } = useThree();

  useFrame(() => {
    if (ref.current) ref.current.iResolution.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      {/* @ts-ignore */}
      <gradientMaterial
        ref={ref}
        depthWrite={false}
        depthTest={false}
        uOffset={0.7}
      />
    </mesh>
  );
});

export default GradientBackground;
