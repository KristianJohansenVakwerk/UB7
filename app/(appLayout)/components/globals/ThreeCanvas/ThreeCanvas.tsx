"use client";

import { Canvas, extend } from "@react-three/fiber";
import { Suspense, useState } from "react";
import GradientPlane from "./GradientPlane";
import MeshShape from "./ShapeMesh";
import { shaderMaterial } from "@react-three/drei";

export const ThreeCanvas = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="w-screen h-screen">
      <Canvas
        className="w-screen h-screen"
        camera={{ position: [0, 0, 1], zoom: 1.5, near: 0.1, far: 100 }}
      >
        <Suspense fallback={<>Loading...</>}>
          <GradientPlane clicked={clicked} />
          <MeshShape clicked={clicked} />
        </Suspense>
      </Canvas>
    </div>
  );
};
