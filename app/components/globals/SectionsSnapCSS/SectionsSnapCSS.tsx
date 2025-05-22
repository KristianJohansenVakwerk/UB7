"use client";

import Box from "../../ui/Box/Box";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Section from "../Section/Section";

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
    color: "",
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
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useGSAP(() => {
    ScrollTrigger.defaults({
      markers: false,
      toggleActions: "restart pause resume reverse",
      scroller: container.current,
      onUpdate: () => {},
    });

    // gsap.to(".section-container-about p", {
    //   scrollTrigger: ".section-container-about",
    //   duration: 0.5,
    //   delay: 0.5,
    //   repeat: 0,
    //   rotation: 360,
    // });

    // gsap.to(".section-container-portfolio", {
    //   scrollTrigger: ".section-container-portfolio",
    //   ease: "none",
    // });

    // gsap.to(".section-container-contact p", {
    //   scrollTrigger: ".section-container-contact",
    //   scale: 10,
    //   duration: 1,
    //   repeat: 0,
    //   delay: 0.5,
    //   yoyo: true,
    //   ease: "power2",
    // });

    sections.forEach((section) => {
      gsap.to(`#progress-${section.id}`, {
        scrollTrigger: {
          trigger: `.section-container-${section.id}`,
          start: "top center",
          end: "center center",
          scroller: container.current,
          scrub: 1, // Smooth scrubbing
          onUpdate: (self) => {
            // Update active section based on which section is most visible
            const progress = self.progress;
            if (progress > 0.5) {
              setActiveSection(section.id);
            } else if (progress < 0.5 && self.direction === -1) {
              // When scrolling up, set the previous section as active
              const currentIndex = sections.findIndex(
                (s) => s.id === section.id
              );
              if (currentIndex > 0) {
                setActiveSection(sections[currentIndex - 1].id);
              }
            }
          },
        },
        width: "100%",
        ease: "none",
      });
    });
  }, {});

  return (
    <>
      <Box className="fixed top-3 left-3 right-3 h-[4px] z-10  flex flex-row gap-2 items-start justify-start">
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
              className={`section-container h-screen w-full section-container-${entry.id}`}
              style={{ scrollSnapAlign: "start" }}
              data-progress={`progress-${entry.id}`}
            >
              <Section
                entry={entry}
                activeSection={activeSection}
                parent={container.current}
              />
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default SectionsSnapCSS;
