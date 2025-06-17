"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { gradientMaterialSVG } from "./gradientMaterialSVG";
// @ts-ignore
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

export const SvgMesh = () => {
  const maskMeshRef = useRef<any>(null);
  const { viewport } = useThree();
  const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
  const [geometry, setGeometry] = useState<THREE.ShapeGeometry | null>(null);

  // useFrame((state) => {
  //   // if (isAnimating && gradientMaterialSVG.uniforms) {
  //   //   gradientMaterialSVG.uniforms.progress.value = Math.max(
  //   //     0,
  //   //     1 - state.clock.getElapsedTime() * 0.5
  //   //   );
  //   // }
  //   // if (gradientMaterialSVG.uniforms.progress.value <= 0) {
  //   //   setIsAnimating(false);
  //   // }
  // });

  // Cache the geometry
  useEffect(() => {
    const loader = new SVGLoader();

    // Create a promise for loading the SVG
    const loadSvg = () => {
      return new Promise((resolve, reject) => {
        loader.load(
          "/logo.svg",
          (svgData: any) => resolve(svgData),
          undefined,
          (error: any) => reject(error)
        );
      });
    };

    // Load SVG and create geometry
    loadSvg()
      .then((svgData: any) => {
        const shapes = svgData.paths[0].toShapes(true);
        const geometry = new THREE.ShapeGeometry(shapes);

        const uvAttribute = geometry.attributes.uv;
        const svgWidth = 1311;
        const svgHeight = 548;

        // Optimize UV calculation by doing it once
        const uvs = new Float32Array(uvAttribute.count * 2);
        for (let i = 0; i < uvAttribute.count; i++) {
          uvs[i * 2] = uvAttribute.getX(i) / svgWidth;
          uvs[i * 2 + 1] = uvAttribute.getY(i) / svgHeight;
        }
        geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

        // Center the geometry
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox?.getCenter(center);
        geometry.translate(-center.x, -center.y, 0);

        setGeometry(geometry);
        setMesh(new THREE.Mesh(geometry, gradientMaterialSVG));
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });
  }, [gradientMaterialSVG]); // Empty dependency array since SVG doesn't change

  // Only update scale when viewport changes
  useEffect(() => {
    if (mesh) {
      const scale = (viewport.width * 0.6) / 1310.16;
      mesh.scale.set(scale, -scale, 1);
      maskMeshRef.current = mesh;
    }
  }, [viewport, mesh]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (geometry) {
        geometry.dispose();
      }
    };
  }, [geometry]);

  return mesh ? <primitive object={mesh} /> : null;
};
