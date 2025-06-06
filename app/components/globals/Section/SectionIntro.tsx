"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Box from "../../ui/Box/Box";
import { useRef } from "react";
gsap.registerPlugin(useGSAP, ScrollTrigger);
import { useLenis } from "lenis/react";

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
    <Box
      id="intro"
      ref={ref}
      className="intro w-screen h-screen relative gradient-background b"
    >
      <div className={"clip-path-container "}>
        <span className={"clip-path"}></span>
      </div>
    </Box>
  );
};

export default SectionIntro;
