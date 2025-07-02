"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Box from "../../ui/Box/Box";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
gsap.registerPlugin(useGSAP, ScrollTrigger);
import { useLenis } from "lenis/react";
import Intro3D from "../../shared/Intro3D/Intro3D";
import Clock from "../../shared/Clock/Clock";

const SectionIntro = () => {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis((lenis) => {});
  const [paused, setPaused] = useState(false);

  useGSAP(() => {
    const handleClick = () => {
      lenis?.scrollTo(window.innerHeight, {
        duration: 1.2,
        onComplete: () => {
          ScrollTrigger.refresh(true);
          ScrollTrigger.getAll().forEach((trigger) => {
            if (trigger.animation) {
              if (trigger.vars.id === "portfolio") {
                trigger.animation.play();
              } else {
                const p = trigger.progress;

                trigger.animation.progress(p);
              }
            }
          });
        },
      });
    };

    // ref.current?.addEventListener("click", handleClick);

    return () => {
      // ref.current?.removeEventListener("click", handleClick);
    };
  }, [lenis]);

  useGSAP(() => {
    gsap.to(ref.current, {
      scrollTrigger: {
        id: "intro-trigger",
        trigger: ref.current,
        start: "top top",
        end: "+=50%",
        markers: false,
        scrub: true,
        onEnter: () => {},
        onLeave: () => {
          setPaused(true);
        },
        onEnterBack: () => {
          setTimeout(() => {
            setPaused(false);
          }, 50);
        },
      },
      autoAlpha: 0,
      display: "none",
      duration: 1,
      ease: "power2.out",
    });
  });

  return (
    <Box
      ref={ref}
      id="intro"
      className="intro w-screen h-screen fixed top-0 left-0 opacity-100 snap-section "
    >
      {/* <Intro3D paused={paused} /> */}
      <IntroPixi />

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none  flex flex-col items-center justify-end p-4 ">
        <div
          className={
            "flex flex-row gap-10  text-dark-green text-sm font-mono leading-1.3"
          }
        >
          <div className="flex flex-col items-center">
            Madrid
            <Clock location="Europe/Madrid" />
          </div>
          <div className="flex flex-col items-center">
            Sao Paulo <Clock location="America/Sao_Paulo" />
          </div>
          <div className="flex flex-col items-center">
            London <Clock location="Europe/London" />
          </div>
        </div>
      </div>
    </Box>
  );
};

export default SectionIntro;

import { Application, useTick, extend } from "@pixi/react";

import {
  Container,
  Graphics,
  Sprite,
  UPDATE_PRIORITY,
  Filter,
  GlProgram,
  Texture,
} from "pixi.js";

extend({
  Container,
  Graphics,
  Sprite,
  GlProgram,
  Filter,
  Texture,
});

const vertex = `
  in vec2 aPosition;
  out vec2 vTextureCoord;

  uniform vec4 uInputSize;
  uniform vec4 uOutputFrame;
  uniform vec4 uOutputTexture;

  vec4 filterVertexPosition( void )
  {
      vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

      position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
      position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

      return vec4(position, 0.0, 1.0);
  }

  vec2 filterTextureCoord( void )
  {
      return aPosition * (uOutputFrame.zw * uInputSize.zw);
  }

  void main(void)
  {
      gl_Position = filterVertexPosition();
      vTextureCoord = filterTextureCoord();
  }
`;

const fragment = `
  in vec2 vTextureCoord;
  in vec4 vColor;

  uniform sampler2D uTexture;
  uniform float uTime;

  void main(void)
  {
      vec2 uvs = vTextureCoord.xy;

      // Define the 4 colors
      vec3 color1 = vec3(0.851, 0.851, 0.851);  // #D9D9D9
      vec3 color2 = vec3(0.996, 1.000, 0.761);  // #FEFFC2
      vec3 color3 = vec3(0.494, 0.980, 0.314);  // #7EFA50
      vec3 color4 = vec3(0.014, 0.463, 0.231);  // #03763B


      float animationProgress = mod(uTime, 2.0) / 2.0; // 0 to 1 over 2 seconds

       // Final positions
      float finalPos1 = 0.0;
      float finalPos2 = 0.2;
      float finalPos3 = 0.5;
      float finalPos4 = 1.0;

      // Animate color positions with time
      float pos1 = mix(1.0, finalPos1, animationProgress);
      float pos2 = mix(1.0, finalPos2, animationProgress);
      float pos3 = mix(1.0, finalPos3, animationProgress);
      float pos4 = mix(1.0, finalPos4, animationProgress);

      vec3 color;
      if (uvs.y < pos2) {
          float t = (uvs.y - pos1) / (pos2 - pos1);
          color = mix(color1, color2, t);
      } else if (uvs.y < pos3) {
          float t = (uvs.y - pos2) / (pos3 - pos2);
          color = mix(color2, color3, t);
      } else {
          float t = (uvs.y - pos3) / (pos4 - pos3);
          color = mix(color3, color4, t);
      }

      gl_FragColor = vec4(color, 1.0);
  }
`;

export const IntroPixi = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-screen h-screen" ref={parentRef}>
      <Application resizeTo={parentRef}>
        <PixiChild />
      </Application>
    </div>
  );
};

const PixiChild = () => {
  const ref = useRef<any>(null);
  const [filter, setFilter] = useState<any>(null);
  const [time, setTime] = useState(0);
  // const [rotation, setRotation] = useState(0);

  // const animateRotation = useCallback(
  //   () => setRotation((prev) => prev + 1),
  //   []
  // );

  // useTick(animateRotation);

  useTick((ticker) => {
    setTime((prev) => prev + ticker.deltaTime * 0.01);

    // Update the filter's time uniform
    if (filter) {
      // filter.uniforms.uTime = time;
      filter.resources.timeUniforms.uniforms.uTime += 0.001 * ticker.deltaTime;
    }
  });

  useEffect(() => {
    if (ref.current) {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const graphics = new Graphics();
      graphics.setFillStyle(0xffffff); // White fill
      graphics.rect(0, 0, width, height);
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
          },
        },
      });

      graphics.filters = [gradientFilter];
      setFilter(gradientFilter);
      ref.current.addChild(graphics);
    }
  }, []);

  return <pixiContainer ref={ref} width={100} height={100} />;
};
