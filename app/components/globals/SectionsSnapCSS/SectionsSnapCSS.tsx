"use client";

import Box from "../../ui/Box/Box";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

const sections = [
  {
    title: "intro",
    id: "intro",
    color: "bg-red-500",
  },
  {
    title: "portfolio",
    id: "portfolio",
    color: "bg-white",
  },
  {
    title: "about",
    id: "about",
    color: "bg-yellow-500",
  },
  {
    title: "contact",
    id: "contact",
    color: "bg-green-500",
  },
];

const SectionsSnapCSS = () => {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    ScrollTrigger.defaults({
      markers: true,
      toggleActions: "restart pause resume reverse",
      scroller: container.current,
      onUpdate: () => {},
    });

    gsap.to(".section-about p", {
      scrollTrigger: ".section-about",
      duration: 0.5,
      delay: 0.5,
      repeat: 0,
      rotation: 360,
    });

    gsap.to(".section-portfolio", {
      scrollTrigger: ".section-portfolio",
      duration: 1,
      backgroundColor: "#FFA500",
      ease: "none",
    });

    gsap.to(".section-contact p", {
      scrollTrigger: ".section-contact",
      scale: 10,
      duration: 1,
      repeat: 0,
      delay: 0.5,
      yoyo: true,
      ease: "power2",
    });

    sections.forEach((section) => {
      gsap.to(`#progress-${section.id}`, {
        scrollTrigger: {
          trigger: `.section-${section.id}`,
          start: "top center",
          end: "center center",
          scroller: container.current,
          scrub: 1, // Smooth scrubbing
          onUpdate: (self) => {
            // Optional: if you want to log progress
            console.log(`${section.id} progress:`, self.progress);
          },
        },
        width: "100%",
        ease: "none",
      });
    });
  }, {});

  return (
    <>
      <Box className="fixed top-2 left-2 right-2 h-[5px] z-10  flex flex-row gap-10 items-start justify-start">
        {sections.slice(1, sections.length).map((entry, index) => {
          return (
            <Box
              key={index}
              className={`relative h-full flex-1 bg-white rounded`}
            >
              <span
                id={`progress-${entry.id}`}
                className={`absolute progress top-0 left-0 w-0 h-full bg-pink-500`}
              ></span>
            </Box>
          );
        })}
      </Box>
      <Box
        ref={container}
        className={`max-h-[100vh] overflow-y-scroll`}
        style={{ overscrollBehavior: "none", scrollSnapType: "y mandatory" }}
      >
        {sections.map((entry, index) => {
          return (
            <Box
              key={index}
              className={`section h-screen w-full   flex items-center justify-center ${entry.color} section-${entry.id}`}
              style={{ scrollSnapAlign: "start" }}
              data-progress={`progress-${entry.id}`}
            >
              <p>{entry.title}</p>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default SectionsSnapCSS;
