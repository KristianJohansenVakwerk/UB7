"use client";
import * as THREE from "three";
const color1 = new THREE.Color("#03763B");
const color2 = new THREE.Color("#7EFA50");
const color3 = new THREE.Color("#FEFFC2");
const color4 = new THREE.Color("#D9D9D9");

//  #d9d9d9 18.75%,
//     #feffc2 30.77%,
//     #7efa50 63.94%,
//     #09603d 91.35%

// Create the shader material
export const gradientMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color1: { value: color1 },
    color2: { value: color2 },
    color3: { value: color3 },
    color4: { value: color4 },
    stop1: { value: 0.0001 },
    stop2: { value: 0.3077 },
    stop3: { value: 0.6394 },
    stop4: { value: 0.98 },
    mousePosition: { value: new THREE.Vector2(0, 0) },
    time: { value: 0 },
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
      uniform vec2 mousePosition;
      uniform float time;
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
        // Apply mouse influence to the gradient
        float t = vUv.y + mousePosition.x * 0.1 + sin(time) * 0.1;
        
        // Sample and blur the gradient
        // float blurAmount = 0.0;
        // vec3 color = vec3(0.0);
        // float samples = 3.0;
        
        // for(float i = 0.0; i < samples; i++) {
        //   float offset = (i / (samples - 1.0) - 0.5) * blurAmount;
        //   color += getColorAt(t + offset);
        // }
        
        // color /= samples;

        vec3 color = getColorAt(t);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
});
