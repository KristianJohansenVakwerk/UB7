"use client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
const Intro3D = ({ paused }: { paused: boolean }) => {
  return (
    <Canvas
      className="w-screen h-screen"
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
    >
      <Experience paused={paused} />
    </Canvas>
  );
};

export default Intro3D;
