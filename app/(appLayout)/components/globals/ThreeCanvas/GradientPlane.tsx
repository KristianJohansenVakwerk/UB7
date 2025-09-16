"use client";
import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { fragmentShader } from "./fragmentShader";
import { vertexShader } from "./vertexShader";

// Shader material
export const GradientMaterial = shaderMaterial(
  { iResolution: new THREE.Vector2(1, 1), uOffset: 0, uSize: 0.7 },
  // vertex shader
  vertexShader,
  // fragment shader
  fragmentShader
);

extend({ GradientMaterial });

type Props = {
  clicked: boolean;
};

function GradientBackground(props: Props) {
  const { clicked } = props;
  const tl = useRef<any>(null);
  const ref = useRef<any>(null);
  const { size } = useThree();

  useGSAP(() => {
    if (!ref.current) return;

    tl.current = gsap.timeline({ paused: true });

    tl.current.to(ref.current, {
      uOffset: 0,
      duration: 1.5,
      ease: "power4.inOut",
    });
  }, []);

  useGSAP(() => {
    if (!tl.current) return;

    gsap.killTweensOf(tl.current);

    setTimeout(() => {
      tl.current.play();
    }, 2000);
  }, []);

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
}

export default GradientBackground;
