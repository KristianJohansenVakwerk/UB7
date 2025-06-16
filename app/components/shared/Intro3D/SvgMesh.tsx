"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { gradientMaterial } from "./gradientShader";
// @ts-ignore
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

export const SvgMesh = () => {
  const maskMeshRef = useRef<any>(null);
  const { viewport } = useThree();

  const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
  const [geometry, setGeometry] = useState<THREE.ShapeGeometry | null>(null);
  // Create SVG path

  const svgMaterial = useMemo(() => {
    const color1 = new THREE.Color("#03763B");
    const color2 = new THREE.Color("#7EFA50");
    const color3 = new THREE.Color("#FEFFC2");
    const color4 = new THREE.Color("#D9D9D9");

    return new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: color1 },
        color2: { value: color2 },
        color3: { value: color3 },
        color4: { value: color4 },
        stop1: { value: 0.01 },
        stop2: { value: 0.3431 },
        stop3: { value: 0.713 },
        stop4: { value: 1.0186 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform vec3 color4;
        uniform float stop1;
        uniform float stop2;
        uniform float stop3;
        uniform float stop4;
        varying vec2 vUv;

        float smoothStep(float edge0, float edge1, float x) {
          float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
          return t * t * (3.0 - 2.0 * t);
        }

        vec3 getColorAt(float t) {
          if (t < stop1) return color1;
          else if (t < stop2) {
            float factor = smoothStep(stop1, stop2, t);
            return mix(color1, color2, factor);
          }
          else if (t < stop3) {
            float factor = smoothStep(stop2, stop3, t);
            return mix(color2, color3, factor);
          }
          else if (t < stop4) {
            float factor = smoothStep(stop3, stop4, t);
            return mix(color3, color4, factor);
          }
          else return color4;
        }

        void main() {
          float t = vUv.y;
          vec3 color = getColorAt(t);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.FrontSide,
    });
  }, []);

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
        setMesh(new THREE.Mesh(geometry, svgMaterial));
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });
  }, [svgMaterial]); // Empty dependency array since SVG doesn't change

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

  return maskMeshRef.current ? (
    <primitive object={maskMeshRef.current} />
  ) : null;
};
