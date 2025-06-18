"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import clsx from "clsx";
import { useStore } from "@/store/store";
// Register the SplitText plugin
gsap.registerPlugin(SplitText);

const SectionTitle = ({
  title,
  id,
  play,
}: {
  title: string;
  id: string;
  play: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { hoverSector, sectorsActive } = useStore();
  const animationRef = useRef<any>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;
      console.log("do we call this multiple times");
      const splitText = new SplitText(textRef.current, {
        id: `${id}-title`,
        type: "lines",
        linesClass: "split-line",
        preserveSpaces: true,
        preserveNewlines: true,
      });

      const tl = gsap.timeline({ id: `title-animation-${id}`, paused: true });

      tl.from(splitText.lines, {
        y: 30,
        opacity: 0,
        duration: 0.2,
        stagger: 0.05,
        delay: 0.2,
        willChange: "transform, opacity",
        ease: "power2.out",
        immediateRender: true,
      });

      animationRef.current = tl;

      return () => {
        splitText.revert();
      };
    },
    { scope: ref, dependencies: [id, title] }
  );

  useGSAP(
    () => {
      if (play) {
        animationRef.current.restart();
      } else {
        animationRef.current.reverse();
      }
    },
    { scope: ref, dependencies: [play] }
  );

  return (
    <>
      <div
        id={`section-title-${id}`}
        ref={ref}
        className={clsx(
          "section-title z-10",
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
