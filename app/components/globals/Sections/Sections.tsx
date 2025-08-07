"use client";
import Section from "../Section/Section";
import Box from "../../ui/Box/Box";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

const sections = [
  {
    id: "intro",
    title: "intro",
  },
  {
    id: "portfolio",
    title: "portfolio",
  },
  {
    id: "about",
    title: "about",
  },
  {
    id: "contact",
    title: "contact",
  },
];

type Props = {};
const Sections = (props: Props) => {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      id: "sections-timeline",
      paused: true,
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "+=400%",
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        scrub: 0.1,
        snap: {
          snapTo: 1 / 4,
          duration: { min: 0.2, max: 0.8 },
          delay: 0,
          ease: "power1.inOut",
        },
        markers: false,
        onUpdate: (self) => {},
      },
    });

    tl.to(".section", {
      yPercent: -100 * 4,
      ease: "none",
    });
  }, {});

  return (
    <Box
      ref={container}
      className={`h-[${sections.length * 100}vh] overflow-hidden`}
      style={{ overscrollBehavior: "none" }}
    >
      {sections.map((entry, index) => {
        return (
          <Box
            key={index}
            className={`section h-screen  flex items-center justify-center  section-${entry.id}`}
          >
            {entry.title}
          </Box>
        );
      })}
    </Box>
  );
};

export default Sections;
