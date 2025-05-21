"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Box from "../../ui/Box/Box";

type Props = {
  text: string;
  className?: string;
  active?: boolean;
};

const TextReveal = ({ text, className, active }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Split the text into lines
    const lines = text.split("\n");

    // Create a timeline
    const tl = gsap.timeline({
      defaults: {
        duration: 0.1,
        ease: "power2.out",
      },
      delay: 0.5,
    });

    // Animate each line
    lines.forEach((_, index) => {
      tl.fromTo(
        `.line-${index}`,
        {
          visibility: "hidden",
          y: -10,
        },
        {
          visibility: "visible",
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        index === 0 ? 0 : "-=0.1" // Stagger the animations
      );
    });

    tl.pause();

    if (active) {
      tl.play();
    } else {
      tl.reverse();
    }
  }, [active]);

  return (
    <Box ref={containerRef} className={className}>
      {text.split("\n").map((line, index) => (
        <div key={index} className={`line-${index} overflow-hidden`}>
          {line}
        </div>
      ))}
    </Box>
  );
};

export default TextReveal;
