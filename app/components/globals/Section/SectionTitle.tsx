"use cleint";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

import SplitText from "../../shared/SplitText/SplitText";
const SectionTitle = ({ title, id }: { title: string; id: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const linesContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
          id: `title-${id}`,
          trigger: ref.current,
          start: "top top",
          end: "+=20%",
          markers: false,
          scrub: false,
          toggleActions: "play none reverse reverse",
        },
      });

      tl.to(ref.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.inOut",
      });
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <div
      ref={ref}
      className={clsx(
        "section-title sticky top-3 mb-6 z-10 opacity-0 px-3"
        // activeIndex === index ? "opacity-100" : "opacity-0"
      )}
    >
      <SplitText text={title} ref={linesContainerRef} />
    </div>
  );
};

export default SectionTitle;
