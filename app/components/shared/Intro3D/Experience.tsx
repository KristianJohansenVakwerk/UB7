"use client";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { gradientMaterial } from "./gradientShader";
import { SvgMesh } from "./SvgMesh";
const Experience = () => {
  const gradientMeshRef = useRef<any>({});
  const maskMeshRef = useRef<any>(null);
  const { viewport } = useThree();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (gradientMeshRef.current) {
      gradientMeshRef.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [viewport]);

  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized coordinates (-1 to 1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (gradientMaterial.uniforms) {
      gradientMaterial.uniforms.time.value = state.clock.getElapsedTime() * 0.5;
    }
  });

  useEffect(() => {
    // if (gradientMaterial.uniforms) {
    //   gradientMaterial.uniforms.mousePosition.value.set(
    //     mousePosition.x,
    //     mousePosition.y
    //   );
    // }
  }, [mousePosition]);

  return (
    <group>
      <mesh ref={gradientMeshRef}>
        <planeGeometry />
        <primitive object={gradientMaterial} />
      </mesh>
      <SvgMesh />
    </group>
  );
};

export default Experience;
