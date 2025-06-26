"use client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Suspense } from "react";
const Intro3D = ({ paused }: { paused: boolean }) => {
  return (
    <Canvas
      className="w-screen h-screen"
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <Experience paused={paused} />
      </Suspense>
    </Canvas>
  );
};

export default Intro3D;
