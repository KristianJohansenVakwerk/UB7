"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Box from "../../ui/Box/Box";
import { useRef } from "react";
gsap.registerPlugin(useGSAP, ScrollTrigger);
import { useLenis } from "lenis/react";
import Intro3D from "../../shared/Intro3D/Intro3D";
import Clock from "../../shared/Clock/Clock";

const SectionIntro = () => {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis((lenis) => {});

  useGSAP(() => {
    const handleClick = () => {
      lenis?.scrollTo(window.innerHeight, {
        duration: 1.2,
        onComplete: () => {
          ScrollTrigger.refresh(true);
          ScrollTrigger.getAll().forEach((trigger) => {
            console.log("trigger", trigger);

            if (trigger.animation) {
              if (trigger.vars.id === "title-portfolio") {
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

  return (
    <Box id="intro" ref={ref} className="intro w-screen h-screen relative">
      {/* <Intro3D /> */}

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
