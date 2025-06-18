"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import clsx from "clsx";
import { globalTriggers } from "@/app/utils/gsapUtils";
gsap.registerPlugin(ScrollTrigger);

const Progress = () => {
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    setTimeout(() => {
      globalTriggers.forEach((section) => {
        const trigger = ScrollTrigger.getById(section.trigger);
        const triggerEl = document.getElementById(section.id);
        const progressBar = document.getElementById(
          `${section.id}-progress`
        ) as HTMLElement;

        ScrollTrigger.create({
          id: `${section.id}-progress`,
          trigger: triggerEl,
          start: trigger?.start,
          end: trigger?.end,
          onUpdate: (self) => {
            gsap.to(progressBar, {
              width: `${self.progress * 100}%`,
            });
          },
          onEnter: () => {
            if (progressRef.current && section.id !== "intro") {
              gsap.to(progressRef.current, {
                opacity: 1,
                duration: 0.2,
                ease: "power2.inOut",
              });
            }
          },
          onEnterBack: () => {
            if (progressRef.current && section.id === "intro") {
              gsap.to(progressRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: "power2.inOut",
              });
            }
          },
        });
      });
    }, 100);
  }, []);

  return (
    <div
      id={"progress"}
      ref={progressRef}
      className="fixed top-2 left-3 right-3 flex flex-row z-50 gap-1 opacity-0"
    >
      {globalTriggers.map((section: any, index: number) => {
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
