"use client";
import { SVGLoader } from "three/examples/jsm/Addons.js";
import { extend, useLoader, useThree } from "@react-three/fiber";
import {
  colorArrayEnSVG,
  colorArrayPtSVG,
  posPtArraySVG,
  posEnArraySVG,
} from "./ThreeUtils";
import { useStore } from "@/store/store";

import * as THREE from "three";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { GradientMaterial } from "./GradientPlane";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useDevice } from "@/app/(appLayout)/utils/utils";

extend({ GradientMaterial });

const SVGShape = forwardRef<any, any>((props: any, ref: any) => {
  const data = useLoader(SVGLoader, "/logo_2.svg");
  const { viewport } = useThree();
  // const matRef = useRef<any>(null);
  // const meshRef = useRef<any>(null);
  const tl = useRef<any>(null);
  const device = useDevice();

  const geometry = useMemo(() => {
    if (!data) return null;

    const shapes = data.paths.flatMap((path) => path.toShapes(true));
    const geom = new THREE.ShapeGeometry(shapes);
    generateUVsForShapeGeometry(geom);
    geom.center();

    geom.computeBoundingBox();

    const size = new THREE.Vector3();
    geom.boundingBox?.getSize(size);
    const maxDim = Math.max(size.x, size.y);

    geom.scale(1 / maxDim, 1 / maxDim, 1 / maxDim);

    return geom;
  }, [data]);

  const scaleFactor = viewport.width * (device === "mobile" ? 0.3 : 0.4);

  const { language } = useStore();

  const defaultColors = language === "en" ? colorArrayEnSVG : colorArrayPtSVG;
  const defaultPositions = language === "en" ? posEnArraySVG : posPtArraySVG;

  return geometry ? (
    <mesh
      geometry={geometry}
      position={[0.0, device === "mobile" ? 0.4 : 0.0, 0.1]}
      scale={[scaleFactor, scaleFactor, 1]}
      rotation={[1 * Math.PI, 0, 0]}
    >
      {/* @ts-ignore */}
      <gradientMaterial
        ref={ref}
        side={THREE.DoubleSide}
        uSize={0.4}
        uOffset={1.0}
        color0={defaultColors[0]}
        color1={defaultColors[1]}
        color2={defaultColors[2]}
        color3={defaultColors[3]}
        pos0={defaultPositions[0]}
        pos1={defaultPositions[1]}
        pos2={defaultPositions[2]}
        pos3={defaultPositions[3]}
        depthWrite={false}
        depthTest={false}
        transparent={true}
        uSvg={1.0}
      />
    </mesh>
  ) : null;
});

export default SVGShape;

const generateUVsForShapeGeometry = (geometry: THREE.ShapeGeometry) => {
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;

  if (!bbox) return;

  const min = bbox.min;
  const max = bbox.max;
  const offset = new THREE.Vector2(-min.x, -min.y);
  const range = new THREE.Vector2(max.x - min.x, max.y - min.y);

  const uvs = [];

  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const x = geometry.attributes.position.getX(i);
    const y = geometry.attributes.position.getY(i);

    const u = (x + offset.x) / range.x;
    const v = 1.0 - (y + offset.y) / range.y;

    uvs.push(u, v);
  }

  geometry.setAttribute(
    "uv",
    new THREE.BufferAttribute(new Float32Array(uvs), 2)
  );
};
