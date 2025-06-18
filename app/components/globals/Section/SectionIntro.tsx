"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Box from "../../ui/Box/Box";
import { useRef, useState, useEffect } from "react";
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

    ref.current?.addEventListener("click", handleClick);
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
      className="intro w-screen h-screen fixed top-0 left-0 opacity-100 "
    >
      {/* <Intro3D paused={paused} /> */}

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
