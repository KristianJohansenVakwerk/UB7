"use client";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  MeshReflectorMaterial,
  Svg,
  Environment,
} from "@react-three/drei";
import { gradientMaterial } from "./gradientShader";
import { SvgMesh } from "./SvgMesh";
import { SVGLoader } from "three/examples/jsm/Addons.js";

const Experience = ({ paused }: { paused: boolean }) => {
  const gradientMeshRef = useRef<any>({});
  const { viewport, gl } = useThree();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const color1 = new THREE.Color("#03763B");
  const color2 = new THREE.Color("#7EFA50");
  const color3 = new THREE.Color("#FEFFC2");
  const color4 = new THREE.Color("#D9D9D9");

  const gradientTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#03763B");
      gradient.addColorStop(0.3077, "#7EFA50");
      gradient.addColorStop(0.6394, "#FEFFC2");
      gradient.addColorStop(1, "#D9D9D9");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useEffect(() => {
    if (gl) {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }, [gl]);

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
    console.log("useFrame");
    if (paused) return;

    // if (gradientMaterial.uniforms) {
    //   gradientMaterial.uniforms.time.value = state.clock.getElapsedTime() * 0.5;
    // }
  });

  return (
    <group>
      {/* <OrbitControls /> */}
      {/* <ambientLight intensity={1} /> */}

      {/* <directionalLight intensity={10} position={[1, 1, 2]} /> */}

      {/* Plane with combined material */}
      <mesh ref={gradientMeshRef} position-z={0}>
        <planeGeometry />
        <meshBasicMaterial
          map={gradientTexture}
          transparent={true}
          opacity={1} // Slightly transparent to blend with reflection
        />
      </mesh>

      <SvgMeshReflection />

      <SvgMesh />
    </group>
  );
};

export default Experience;

export const SvgMeshReflection = () => {
  const { viewport } = useThree();
  const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
  const [geometry, setGeometry] = useState<THREE.ShapeGeometry | null>(null);

  const gradientTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#03763B");
      gradient.addColorStop(0.3077, "#7EFA50");
      gradient.addColorStop(0.6394, "#FEFFC2");
      gradient.addColorStop(1, "#D9D9D9");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useEffect(() => {
    const loader = new SVGLoader();

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

    loadSvg()
      .then((svgData: any) => {
        const shapes = svgData.paths[0].toShapes(true);
        const geometry = new THREE.ShapeGeometry(shapes);

        const uvAttribute = geometry.attributes.uv;
        const svgWidth = 1311;
        const svgHeight = 548;

        const uvs = new Float32Array(uvAttribute.count * 2);
        for (let i = 0; i < uvAttribute.count; i++) {
          uvs[i * 2] = uvAttribute.getX(i) / svgWidth;
          uvs[i * 2 + 1] = uvAttribute.getY(i) / svgHeight;
        }
        geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox?.getCenter(center);
        geometry.translate(-center.x, -center.y, 0);

        setGeometry(geometry);

        // Reflection material - transparent with gradient
        const material = new THREE.MeshBasicMaterial({
          side: THREE.DoubleSide,
          map: gradientTexture,
          transparent: true,
          opacity: 1, // Very transparent for reflection effect
        });

        setMesh(new THREE.Mesh(geometry, material));
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });
  }, [gradientTexture]);

  useEffect(() => {
    if (mesh) {
      const scale = (viewport.width * 0.6) / 1310.16;
      mesh.scale.set(scale, scale, 1);
      mesh.position.set(0, 0, 0.1);
      mesh.rotation.z = Math.PI;
      mesh.rotation.x = Math.PI;
      // Center the SVG horizontally and position it vertically
      // mesh.position.set(0, -2, 0); // Centered horizontally, positioned vertically
    }
  }, [viewport, mesh]);

  useEffect(() => {
    return () => {
      if (geometry) {
        geometry.dispose();
      }
    };
  }, [geometry]);

  return mesh ? <primitive object={mesh} position-z={0} /> : null;
};
