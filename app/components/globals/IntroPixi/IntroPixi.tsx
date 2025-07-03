"use client";

import { useRef, useState, useEffect } from "react";
import { Application, useTick, extend, useApplication } from "@pixi/react";

import {
  Container,
  Graphics,
  Filter,
  GlProgram,
  Texture,
  Assets,
  FillGradient,
  Sprite,
} from "pixi.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

extend({
  Container,
  Graphics,
  GlProgram,
  Filter,
  Texture,
  Sprite,
});

const vertex = `
  in vec2 aPosition;
  out vec2 vTextureCoord;

  void main(void)
  {
      gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);
      vTextureCoord = vec2(aPosition.x, 1.0 - aPosition.y); ;
  }
`;

const fragment = `
  in vec2 vTextureCoord;
  in vec4 vColor;
  precision mediump float;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uPos1;
  uniform float uPos2;
  uniform float uPos3;
  uniform float uPos4;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;

  void main(void)
  {
      vec2 uvs = vTextureCoord.xy;

      // Use uniform colors instead of hardcoded values
      vec3 color1 = uColor1;
      vec3 color2 = uColor2;
      vec3 color3 = uColor3;
      vec3 color4 = uColor4;

      // Subtle movement animation
      float movement = sin(uTime * 0.1) * 0.1; // Subtle sine wave movement
      
      // Final positions with subtle movement
      float pos1 = uPos1 + movement;
      float pos2 = uPos2 + movement;
      float pos3 = uPos3 + movement;
      float pos4 = uPos4 + movement;

      vec3 color = color1; // Default to first color
      
      // Create a smooth gradient using all colors
      float totalRange = pos4 - pos1;
      if (totalRange > 0.0) {
          float normalizedY = (uvs.y - pos1) / totalRange;
          normalizedY = clamp(normalizedY, 0.0, 1.0);
          
          if (normalizedY < 0.33) {
              float t = normalizedY / 0.33;
              color = mix(color1, color2, t);
          } else if (normalizedY < 0.66) {
              float t = (normalizedY - 0.33) / 0.33;
              color = mix(color2, color3, t);
          } else {
              float t = (normalizedY - 0.66) / 0.34;
              color = mix(color3, color4, t);
          }
      }

      gl_FragColor = vec4(color, 1.0);
  }
`;

const IntroPixi = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const [positions, setPositions] = useState({
    pos1: 0.0,
    pos2: 0.2,
    pos3: 0.5,
    pos4: 1.0,
  });

  // Start with grey colors
  const [colors, setColors] = useState({
    color1: [0.898, 0.898, 0.898], // Start with grey
    color2: [0.898, 0.898, 0.898], // Start with grey
    color3: [0.898, 0.898, 0.898], // Start with grey
    color4: [0.898, 0.898, 0.898], // Start with grey
  });

  // Predefined position states
  const positionStates = {
    default: { pos1: 0.0, pos2: 0.2, pos3: 0.5, pos4: 1.0 },
  };

  // Predefined color schemes
  const colorSchemes = {
    grey: {
      color1: [0.898, 0.898, 0.898],
      color2: [0.898, 0.898, 0.898],
      color3: [0.898, 0.898, 0.898],
      color4: [0.898, 0.898, 0.898],
    },
    big: {
      color1: [0.851, 0.851, 0.851], // #D9D9D9
      color2: [0.996, 1.0, 0.761], // #FEFFC2
      color3: [0.494, 0.98, 0.314], // #7EFA50
      color4: [0.014, 0.463, 0.231], // #03763B
    },
    bottom: {
      color1: [0.898, 0.898, 0.898],
      color2: [0.898, 0.898, 0.898],
      color3: [0.898, 0.898, 0.898], // #7EFA50
      color4: [0.494, 0.98, 0.314], // #03763B
    },
  };

  // Step 1: Animate from grey to big colors on load
  useGSAP(() => {
    if (filter) {
      // Animate from grey to big colors
      gsap.to(filter.resources.timeUniforms.uniforms.uColor1, {
        0: colorSchemes.big.color1[0],
        1: colorSchemes.big.color1[1],
        2: colorSchemes.big.color1[2],
        duration: 2,
        ease: "power4.out",
      });

      gsap.to(filter.resources.timeUniforms.uniforms.uColor2, {
        0: colorSchemes.big.color2[0],
        1: colorSchemes.big.color2[1],
        2: colorSchemes.big.color2[2],
        duration: 2,
        ease: "power4.out",
      });

      gsap.to(filter.resources.timeUniforms.uniforms.uColor3, {
        0: colorSchemes.big.color3[0],
        1: colorSchemes.big.color3[1],
        2: colorSchemes.big.color3[2],
        duration: 2,
        ease: "power4.out",
      });

      gsap.to(filter.resources.timeUniforms.uniforms.uColor4, {
        0: colorSchemes.big.color4[0],
        1: colorSchemes.big.color4[1],
        2: colorSchemes.big.color4[2],
        duration: 2,
        ease: "power4.out",
      });
    }
  }, [filter]);

  // Step 3: Scroll trigger to go from big to bottom colorscheme
  useGSAP(() => {
    const introElement = document.getElementById("intro");
    ScrollTrigger.create({
      trigger: introElement,
      id: "intro-pixi-trigger",
      start: "top top",
      end: "+=100%",
      scrub: true,
      markers: true,
      onUpdate: (self) => {
        const progress = self.progress;
        if (filter) {
          // Interpolate between big and bottom color schemes
          const bigScheme = colorSchemes.big;
          const bottomScheme = colorSchemes.bottom;

          // Helper function to interpolate between two colors
          const interpolateColor = (
            color1: number[],
            color2: number[],
            t: number
          ) => {
            return [
              color1[0] + (color2[0] - color1[0]) * t,
              color1[1] + (color2[1] - color1[1]) * t,
              color1[2] + (color2[2] - color1[2]) * t,
            ];
          };

          // Calculate interpolated colors
          const interpolatedColors = {
            color1: interpolateColor(
              bigScheme.color1,
              bottomScheme.color1,
              progress
            ),
            color2: interpolateColor(
              bigScheme.color2,
              bottomScheme.color2,
              progress
            ),
            color3: interpolateColor(
              bigScheme.color3,
              bottomScheme.color3,
              progress
            ),
            color4: interpolateColor(
              bigScheme.color4,
              bottomScheme.color4,
              progress
            ),
          };

          // Update the shader uniforms directly
          const tweenColor = (uniformKey: string, targetColor: number[]) => {
            const colorArray =
              filter.resources.timeUniforms.uniforms[uniformKey];
            gsap.set(colorArray, {
              0: targetColor[0],
              1: targetColor[1],
              2: targetColor[2],
            });
          };

          tweenColor("uColor1", interpolatedColors.color1);
          tweenColor("uColor2", interpolatedColors.color2);
          tweenColor("uColor3", interpolatedColors.color3);
          tweenColor("uColor4", interpolatedColors.color4);
        }
      },
    });
  }, [filter]);

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-[#D9D9D9]"
      ref={parentRef}
    >
      <Application
        antialias={true}
        resizeTo={parentRef}
        backgroundColor={0xd9d9d9}
      >
        <PixiGradient
          setFilter={setFilter}
          isAnimating={isAnimating}
          positions={positions}
          colors={colors}
        />
      </Application>
    </div>
  );
};

export default IntroPixi;

const PixiGradient = ({
  setFilter,
  isAnimating,
  positions,
  colors,
}: {
  setFilter: (filter: any) => void;
  isAnimating: boolean;
  positions: { pos1: number; pos2: number; pos3: number; pos4: number };
  colors: {
    color1: number[];
    color2: number[];
    color3: number[];
    color4: number[];
  };
}) => {
  const ref = useRef<any>(null);
  const [filter, setLocalFilter] = useState<any>(null);
  const application = useApplication();

  // Step 2: Subtle movement animation
  useTick((ticker) => {
    if (filter) {
      filter.resources.timeUniforms.uniforms.uTime += 0.03 * ticker.deltaTime;
    }
  });

  useEffect(() => {
    if (ref.current) {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const graphics = new Graphics();
      graphics.rect(0, 0, width, height);
      graphics.setFillStyle(0xd9d9d9);
      graphics.fill();

      const glProgram = new GlProgram({
        vertex: vertex,
        fragment: fragment,
      });

      const gradientFilter = new Filter({
        glProgram,
        resources: {
          timeUniforms: {
            uTime: { value: 0.0, type: "f32" },
            uPos1: { value: positions.pos1, type: "f32" },
            uPos2: { value: positions.pos2, type: "f32" },
            uPos3: { value: positions.pos3, type: "f32" },
            uPos4: { value: positions.pos4, type: "f32" },
            uColor1: { value: colors.color1, type: "vec3<f32>" },
            uColor2: { value: colors.color2, type: "vec3<f32>" },
            uColor3: { value: colors.color3, type: "vec3<f32>" },
            uColor4: { value: colors.color4, type: "vec3<f32>" },
          },
        },
      });

      graphics.filters = [gradientFilter];
      setLocalFilter(gradientFilter);
      setFilter(gradientFilter);

      ref.current.addChild(graphics);
    }
  }, [setFilter]);

  return (
    <pixiContainer
      ref={ref}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};
