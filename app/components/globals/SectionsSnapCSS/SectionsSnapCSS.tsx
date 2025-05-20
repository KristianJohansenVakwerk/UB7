"use client";
import Section from "../../Section/Section";
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

type Props = {};
const SectionsSnapCSS = (props: Props) => {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    ScrollTrigger.defaults({
      markers: true,
      start: "top top",
      end: "bottom bottom",
      toggleActions: "restart pause resume reverse",
      scroller: container.current,
      onUpdate: (self) => {
        // Calculate which section we're currently in
        const totalSections = sections.length;
        const currentProgress = self.progress;
        const currentSectionIndex = Math.floor(currentProgress * totalSections);

        // Update all progress bars
        sections.forEach((section, index) => {
          const progressEl = document.getElementById(`progress-${section.id}`);
          if (!progressEl) return;

          if (index < currentSectionIndex) {
            // Previous sections are complete
            gsap.to(progressEl, {
              width: "100%",
              duration: 0.3,
              ease: "power2.out",
            });
          } else if (index === currentSectionIndex) {
            // Current section progress
            const sectionProgress = (currentProgress * totalSections) % 1;
            gsap.to(progressEl, {
              width: `${Math.round(sectionProgress * 100)}%`,
              duration: 0.3,
              ease: "power2.out",
            });
          } else {
            // Future sections are empty
            gsap.to(progressEl, {
              width: "0%",
              duration: 0.3,
              ease: "power2.out",
            });
          }
        });
      },
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
                className={`absolute top-0 left-0 w-none h-full bg-pink-500`}
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
