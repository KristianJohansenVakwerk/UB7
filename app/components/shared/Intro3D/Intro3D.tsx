"use client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
const Intro3D = () => {
  return (
    <Canvas className="w-screen h-screen">
      <Experience />
    </Canvas>
  );
};

export default Intro3D;
