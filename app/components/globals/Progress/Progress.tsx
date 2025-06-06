"use client";

import { useLenis } from "lenis/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useEffect } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { globalSectionTriggers } from "@/app/utils/gsapUtils";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

const Progress = () => {
  const progressRef = useRef<HTMLDivElement>(null);

  const sectionTriggers = [
    { start: "bottom top", end: "bottom top", id: "intro" },
    ...globalSectionTriggers,
  ];

  useGSAP(() => {
    // Create ScrollTriggers for each section

    sectionTriggers.forEach((section, index) => {
      const targetElement = document.getElementById(section.id);
      const progressBar = document.getElementById(
        `${section.id}-progress`
      ) as HTMLElement;

      if (!targetElement || !progressBar) return;

      ScrollTrigger.create({
        trigger: targetElement,
        start: section.start,
        end: section.end,
        markers: false,
        id: section.id,
        onUpdate: (self) => {
          gsap.to(progressBar, {
            width: `${self.progress * 100}%`,
            duration: 0.1,
            ease: "none",
          });
        },
        onEnter: () => {
          console.log("onEnter", section.id);
          // Optional: Add any additional effects when entering the section
          if (progressRef.current && section.id !== "intro") {
            gsap.to(progressRef.current, {
              opacity: 1,
              duration: 0.2,
              ease: "power2.inOut",
            });
          }
        },
        onEnterBack: () => {
          console.log("onEnter back", section.id);
          // Optional: Reset the color when leaving the section

          if (progressRef.current && section.id === "intro") {
            gsap.set(progressRef.current, {
              opacity: 0,
            });
          }
        },
      });
    });
  }, []);

  return (
    <div
      id={"progress"}
      ref={progressRef}
      className="fixed top-2 left-3 right-3 flex flex-row z-50 gap-1 opacity-0"
    >
      {sectionTriggers.map((section: any, index: number) => {
        return (
          <div
            key={index}
            className={clsx(
              "w-1/3 bg-white/40 backdrop-blur-sm  h-[5px]",
              section.id === "intro" && "hidden"
            )}
          >
            <div
              id={`${section.id}-progress`}
              className="h-full bg-white/80 rounded-progress-bar w-0"
            />
          </div>
        );
      })}
    </div>
  );
};

export default Progress;
