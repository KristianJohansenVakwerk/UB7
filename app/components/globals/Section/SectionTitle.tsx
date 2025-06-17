"use client";

import React, { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import clsx from "clsx";
import { globalSectionTriggers } from "@/app/utils/gsapUtils";
import { useStore } from "@/store/store";
// Register the SplitText plugin
gsap.registerPlugin(SplitText);

const SectionTitle = ({ title, id }: { title: string; id: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { hoverSector, sectorsActive } = useStore();
  useGSAP(
    () => {
      // Find the matching section trigger for this title
      const sectionTrigger = globalSectionTriggers.find(
        (trigger) => trigger.id === id
      );

      if (!sectionTrigger || !textRef.current) return;

      // Create the split text
      const splitText = new SplitText(textRef.current, {
        type: "lines",
        linesClass: "split-line",
        preserveSpaces: true,
        preserveNewlines: true,
      });

      // const sections = document.querySelectorAll(".section");
      const section = document.querySelector(`#${id}`);

      gsap.timeline({
        paused: true,
        scrollTrigger: {
          id: `title-${id}`,
          trigger: section,
          start: sectionTrigger?.start,
          end: sectionTrigger?.end,
          markers: { indent: 1000 },
          scrub: false,
          toggleActions: "play none reverse reverse",
          onEnter: () => {
            gsap.to(splitText.lines, {
              y: 0,
              opacity: 1,
              duration: 0.2,
              stagger: 0.05,
              delay: 0.5,
              willChange: "transform, opacity",
              ease: "power2.out",
            });
          },
          onLeave: () => {
            gsap.to(splitText.lines, {
              y: -30,
              opacity: 0,
              duration: 0.2,
              stagger: 0.05,

              willChange: "transform, opacity",
              ease: "power2.out",
            });
          },
          onEnterBack: () => {
            gsap.to(splitText.lines, {
              y: 0,
              opacity: 1,
              duration: 0.2,
              stagger: 0.05,
              delay: 0.5,
              willChange: "transform, opacity",
              ease: "power2.out",
            });
          },
          onLeaveBack: () => {
            gsap.to(splitText.lines, {
              y: -30,
              opacity: 0,

              willChange: "transform, opacity",
              duration: 0.2,
              stagger: 0.05,
              ease: "power2.out",
            });
          },
        },
      });

      gsap.set(splitText.lines, {
        y: 30,
        opacity: 0,
        willChange: "transform, opacity",
      });

      // tl.to(splitText.lines, {
      //   y: 0,
      //   opacity: 1,
      //   duration: 0.2,
      //   stagger: 0.05,
      //   willChange: "transform, opacity",
      //   ease: "power2.out",
      // });

      // Cleanup function
      return () => {
        splitText.revert();
      };
    },
    { scope: ref, dependencies: [id, title] }
  );

  // useEffect(() => {
  //   setTimeout(() => {
  //     ref.current?.classList.add("opacity-100");
  //   });
  // }, []);

  return (
    <>
      <div
        id={`section-title-${id}`}
        ref={ref}
        className={clsx(
          "section-title fixed top-4 mb-6 z-10 px-3",
          hoverSector && "mix-blend-color-dodge"
        )}
      >
        <div ref={textRef} className="text-sm lg:text-title ">
          {title.split("<br>").map((line, index) => (
            <span className={clsx("text-dark-grey ")} key={index}>
              {line}
              {index < title.split("<br>").length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionTitle;
