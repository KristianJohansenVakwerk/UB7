"use client";

import { useRef, useState, useEffect } from "react";
import { Application, useTick, extend } from "@pixi/react";

import { Container, Graphics, Filter, GlProgram, Texture } from "pixi.js";
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

      float animationProgress = clamp(uTime / 5.0, 0.0, 1.0);

      // Final positions
      float finalPos1 = uPos1;
      float finalPos2 = uPos2;
      float finalPos3 = uPos3;
      float finalPos4 = uPos4;

      // Animate color positions with time
      float pos1 = mix(1.0, finalPos1, animationProgress);
      float pos2 = mix(0.0, finalPos2, animationProgress);
      float pos3 = mix(0.0, finalPos3, animationProgress);
      float pos4 = mix(0.0, finalPos4, animationProgress);

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

  const [colors, setColors] = useState({
    color1: [0.851, 0.851, 0.851], // #D9D9D9
    color2: [0.996, 1.0, 0.761], // #FEFFC2
    color3: [0.494, 0.98, 0.314], // #7EFA50
    color4: [0.014, 0.463, 0.231], // #03763B
  });

  // Predefined position states
  const positionStates = {
    default: { pos1: 0.0, pos2: 0.2, pos3: 0.5, pos4: 1.0 },
    compressed: { pos1: 0.0, pos2: 0.1, pos3: 0.3, pos4: 1.0 },
    expanded: { pos1: 0.0, pos2: 0.4, pos3: 0.7, pos4: 1.0 },
    inverted: { pos1: 1.0, pos2: 0.8, pos3: 0.5, pos4: 0.0 },
    centered: { pos1: 0.3, pos2: 0.4, pos3: 0.6, pos4: 0.7 },
    scattered: { pos1: 0.0, pos2: 0.3, pos3: 0.6, pos4: 1.0 },
  };

  // Predefined color schemes
  const colorSchemes = {
    default: {
      color1: [0.851, 0.851, 0.851], // #D9D9D9
      color2: [0.996, 1.0, 0.761], // #FEFFC2
      color3: [0.494, 0.98, 0.314], // #7EFA50
      color4: [0.014, 0.463, 0.231], // #03763B
    },
    grey: {
      color1: [0.898, 0.898, 0.898],
      color2: [0.898, 0.898, 0.898],
      color3: [0.898, 0.898, 0.898],
      color4: [0.494, 0.98, 0.314],
    },
  };

  useGSAP(() => {
    const introElement = document.getElementById("intro");
    ScrollTrigger.create({
      trigger: introElement,
      id: "intro-pixi-trigger",
      start: "top top",
      end: "+=100%",
      scrub: false,
      markers: true,
      onUpdate: (self) => {
        const progress = self.progress;
        if (filter) {
          // Interpolate between default and grey color schemes
          const defaultScheme = colorSchemes.default;
          const greyScheme = colorSchemes.grey;

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
              defaultScheme.color1,
              greyScheme.color1,
              progress
            ),
            color2: interpolateColor(
              defaultScheme.color2,
              greyScheme.color2,
              progress
            ),
            color3: interpolateColor(
              defaultScheme.color3,
              greyScheme.color3,
              progress
            ),
            color4: interpolateColor(
              defaultScheme.color4,
              greyScheme.color4,
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

  const handleButtonClick = () => {
    if (filter) {
      if (isAnimating) {
        setIsAnimating(false);
        gsap.killTweensOf(filter.resources.timeUniforms.uniforms);
      } else {
        setIsAnimating(true);
        gsap.fromTo(
          filter.resources.timeUniforms.uniforms,
          { uTime: 0 },
          {
            uTime: 5,
            duration: 5,
            ease: "power4.inOut",
            onComplete: () => {
              setIsAnimating(false);
            },
          }
        );
      }
    }
  };

  const animateToState = (stateName: keyof typeof positionStates) => {
    const targetState = positionStates[stateName];
    setPositions(targetState);

    if (filter) {
      gsap.to(filter.resources.timeUniforms.uniforms, {
        uPos1: targetState.pos1,
        uPos2: targetState.pos2,
        uPos3: targetState.pos3,
        uPos4: targetState.pos4,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }
  };

  const animateToColorScheme = (schemeName: keyof typeof colorSchemes) => {
    const targetScheme = colorSchemes[schemeName];
    setColors(targetScheme);

    console.log(filter.resources.timeUniforms.uniforms);

    if (filter) {
      const tweenColor = (uniformKey: string, targetColor: number[]) => {
        const colorArray = filter.resources.timeUniforms.uniforms[uniformKey]; // Already a Float32Array or Array of 3
        gsap.to(colorArray, {
          0: targetColor[0],
          1: targetColor[1],
          2: targetColor[2],
          duration: 0.5,
          ease: "power4.inOut",
        });
      };

      tweenColor("uColor1", targetScheme.color1);
      tweenColor("uColor2", targetScheme.color2);
      tweenColor("uColor3", targetScheme.color3);
      tweenColor("uColor4", targetScheme.color4);
    }
  };

  const handlePositionChange = (position: string, value: number) => {
    const newPositions = { ...positions, [position]: value };
    setPositions(newPositions);

    if (filter) {
      gsap.to(filter.resources.timeUniforms.uniforms, {
        uPos1: newPositions.pos1,
        uPos2: newPositions.pos2,
        uPos3: newPositions.pos3,
        uPos4: newPositions.pos4,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const handleColorChange = (
    colorIndex: string,
    channel: number,
    value: number
  ) => {
    const newColors = { ...colors };
    newColors[colorIndex as keyof typeof colors][channel] = value;
    setColors(newColors);

    if (filter) {
      gsap.to(filter.resources.timeUniforms.uniforms, {
        [`u${colorIndex.charAt(0).toUpperCase() + colorIndex.slice(1)}`]:
          newColors[colorIndex as keyof typeof colors],
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-[#D9D9D9]"
      ref={parentRef}
    >
      <Application resizeTo={parentRef} backgroundColor={0xd9d9d9}>
        <PixiChild
          setFilter={setFilter}
          isAnimating={isAnimating}
          positions={positions}
          colors={colors}
        />
      </Application>
      {/* 
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 max-h-screen overflow-y-auto">
        <div className="bg-white p-4 rounded-md">
          <h3 className="font-mono text-sm mb-2">Color Schemes</h3>
          <div className="grid grid-cols-2 gap-1 mb-4">
            {Object.keys(colorSchemes).map((schemeName) => (
              <button
                key={schemeName}
                onClick={() =>
                  animateToColorScheme(schemeName as keyof typeof colorSchemes)
                }
                className="bg-gray-100 hover:bg-gray-200 text-black px-2 py-1 rounded text-xs font-mono transition-colors"
              >
                {schemeName}
              </button>
            ))}
          </div>

          <h3 className="font-mono text-sm mb-2">Position States</h3>
          <div className="grid grid-cols-2 gap-1 mb-4">
            {Object.keys(positionStates).map((stateName) => (
              <button
                key={stateName}
                onClick={() =>
                  animateToState(stateName as keyof typeof positionStates)
                }
                className="bg-gray-100 hover:bg-gray-200 text-black px-2 py-1 rounded text-xs font-mono transition-colors"
              >
                {stateName}
              </button>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default IntroPixi;

const PixiChild = ({
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
  // const [time, setTime] = useState(0);

  useTick((ticker) => {
    // setTime((prev) => prev + ticker.deltaTime);

    if (filter && !isAnimating) {
      filter.resources.timeUniforms.uniforms.uTime += 0.5 * ticker.deltaTime;
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

      // gsap.fromTo(
      //   gradientFilter.resources.timeUniforms.uniforms,
      //   { uTime: 0 },
      //   {
      //     uTime: 5,
      //     duration: 5,
      //     ease: "power2.inOut",
      //     repeat: -1,
      //     yoyo: true,
      //   }
      // );
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
