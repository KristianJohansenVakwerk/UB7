"use client";

import * as THREE from "three";

const color1 = new THREE.Color("#D9D9D9");
const color2 = new THREE.Color("#FEFFC2");
const color3 = new THREE.Color("#7EFA50");
const color4 = new THREE.Color("#03763B");

export const gradientMaterialSVG = new THREE.ShaderMaterial({
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
          float blurAmount = 0.1;
          vec3 color = vec3(0.0);
          float samples = 5.0;

          for(float i = 0.0; i < samples; i++) {
            float offset = (i / (samples - 1.0) - 0.5) * blurAmount;
            color += getColorAt(t + offset);
          }
        
          color /= samples;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
  side: THREE.FrontSide,
});
