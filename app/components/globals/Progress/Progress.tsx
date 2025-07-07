"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useEffect } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import clsx from "clsx";
import { globalTriggers } from "@/app/utils/gsapUtils";
gsap.registerPlugin(ScrollTrigger);

const Progress = () => {
  const progressRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(() => {
    // Kill existing ScrollTrigger
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }

    setTimeout(() => {
      // Check if any sections exist
      const existingSections = globalTriggers.filter((section) => {
        const triggerEl = document.getElementById(section.id);
        const progressBar = document.getElementById(`${section.id}-progress`);
        const trigger = ScrollTrigger.getById(section.trigger);
        return triggerEl && progressBar && trigger;
      });

      if (existingSections.length === 0) {
        console.warn("Progress: No sections found, skipping progress bars");
        return;
      }

      // Create a single ScrollTrigger that handles all progress bars
      scrollTriggerRef.current = ScrollTrigger.create({
        id: "progress-master-trigger",
        trigger: "body", // Use body as trigger
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          // Update all progress bars based on their section visibility
          existingSections.forEach((section) => {
            const trigger = ScrollTrigger.getById(section.trigger);
            const progressBar = document.getElementById(
              `${section.id}-progress`
            ) as HTMLElement;

            if (trigger && progressBar) {
              // Calculate progress based on the original trigger's progress
              const sectionProgress = trigger.progress;

              gsap.set(progressBar, {
                width: `${sectionProgress * 100}%`,
              });
            }
          });
        },
        onEnter: () => {},
        onEnterBack: () => {},
      });
    }, 100);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id={"progress"}
      ref={progressRef}
      className="fixed top-2 left-3 right-3 flex flex-row z-50 gap-1 opacity-100"
    >
      {globalTriggers.map((section: any, index: number) => {
        return (
          <div
            key={index}
            className={clsx(
              "w-1/3 bg-blue-500/40 backdrop-blur-sm  h-[5px]",
              section.id === "intro" && "hidden"
            )}
          >
            <div
              id={`${section.id}-progress`}
              className="h-full bg-red-500/80 rounded-progress-bar w-0"
            />
          </div>
        );
      })}
    </div>
  );
};

export default Progress;
