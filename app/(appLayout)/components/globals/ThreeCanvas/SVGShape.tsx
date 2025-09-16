"use client";
import { SVGLoader } from "three/examples/jsm/Addons.js";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { GradientMaterial } from "./GradientPlane";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

extend({ GradientMaterial });

const SVGShape = () => {
  const data = useLoader(SVGLoader, "/logo_2.svg");
  const { viewport } = useThree();
  const matRef = useRef<any>(null);
  const tl = useRef<any>(null);

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

  const scaleFactor = viewport.width * 0.4;

  useGSAP(() => {
    if (!matRef.current) return;

    tl.current = gsap.timeline({ paused: true });

    tl.current.to(matRef.current, {
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

  return geometry ? (
    <mesh
      geometry={geometry}
      position={[0.5, -0.2, 0.1]}
      scale={[scaleFactor, scaleFactor, 1]}
      rotation={[1 * Math.PI, 0, 0]}
    >
      {/* @ts-ignore */}
      <gradientMaterial
        ref={matRef}
        side={THREE.DoubleSide}
        uSize={0.45}
        uOffset={2.0}
      />
    </mesh>
  ) : null;
};

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
