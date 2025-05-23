"use client";

import Box from "../../ui/Box/Box";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Section from "../Section/Section";
import React from "react";

// Register plugins
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const sections = [
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
  const container = useRef<any>(null);
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);

  useGSAP(
    () => {
      let sectionsContainers = gsap.utils.toArray(".section-container");
      let scrollDirection = 1;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          toggleActions: "restart none reverse none",
          start: "top top",
          end: `+=400%`,
          scrub: 0.05,
          markers: true,
          pin: false,
          pinSpacing: false,
          anticipatePin: 1,
          snap: {
            snapTo: (value, snapTarget) => {
              const sectionCount = 4;
              const sectionSize = 1 / sectionCount;
              const currentIndex = Math.floor(value / sectionSize);
              const positionInSection = value - currentIndex * sectionSize;
              const section = sections[currentIndex];
              console.log("section id", section.id);

              if (scrollDirection === 1 && positionInSection > 0.05) {
                console.log("next section");
                // if (section.id === "about") {
                //   return value;
                // }

                return (currentIndex + 1) * sectionSize;
              } else if (scrollDirection === -1 && positionInSection < 0.3) {
                console.log("previous section");
                return currentIndex * sectionSize;
                // return currentIndex * sectionSize;
              } else {
                console.log("current section");
                return currentIndex * sectionSize;
              }
            },
            delay: 0.01,
            duration: { min: 0.2, max: 0.3 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            scrollDirection = self.direction;
            // Calculate which section is most visible

            const progress = self.progress;

            const sectionIndex = Math.round(
              progress * (sectionsContainers.length - 1)
            );
            setActiveSection(sections[sectionIndex].id);
          },
          onEnter: (self) => {
            console.log("enter", self);
          },
          onEnterBack: (self) => {
            console.log("enter back", self);
          },
        },
      });

      sectionsContainers.forEach((sectionContainer: any, index: number) => {
        tl.addLabel(`section-${index}`).to(sectionContainer, {
          ease: "none",
        });

        // If this is the about section, create a nested ScrollTrigger
        // if (sections[index]?.id === "about") {
        //   const tl = gsap.timeline({
        //     scrollTrigger: {
        //       trigger: sectionContainer,
        //       start: "top top",
        //       end: "+=100%", // This makes it take up 2x the normal scroll space
        //       pin: true,
        //       pinSpacing: true,
        //       toggleActions: "none none none none",
        //       // scrub: 0.1,
        //       markers: true, // Helpful for debugging
        //       anticipatePin: 1, // Helps prevent jittering
        //       onUpdate: (self) => {
        //         if (self.progress === 1 && self.direction === 1) {
        //           gsap.to(".section-animation-about__reel", {
        //             xPercent: -200,
        //             duration: 1,
        //             ease: "none",
        //           });

        //           gsap.to(".section-animation-about__slider", {
        //             x: 0,
        //             duration: 1,
        //             ease: "none",
        //           });
        //         } else if (self.progress === 0 && self.direction === -1) {
        //           gsap.to(".section-animation-about__reel", {
        //             xPercent: 0,
        //             ease: "none",
        //           });
        //           gsap.to(".section-animation-about__slider", {
        //             x: "100%",
        //             duration: 1,
        //             ease: "none",
        //           });
        //         }
        //       },
        //     },
        //   });

        // // Set initial positions
        // tl.set(".section-animation-about__reel", {
        //   xPercent: 0,
        // });

        // tl.set(".section-animation-about__slider", {
        //   x: "100%",
        // });

        // // Add the animations with duration instead of position
        // tl.to(".section-animation-about__reel", {
        //   xPercent: -200,
        //   duration: 1,
        //   ease: "power2.inOut",
        // });

        // tl.to(
        //   ".section-animation-about__slider",
        //   {
        //     x: 0,
        //     duration: 1,
        //     ease: "power2.inOut",
        //   },
        //   "<"
        // ); // The "<" makes this animation start at the same time as the previous one
        // }
      });
    },
    { scope: container, dependencies: [sections] }
  );

  return (
    <>
      <Box className="fixed top-3 left-3 right-3 h-[4px] z-10  flex flex-row gap-2 items-start justify-start">
        {sections.map((entry, index) => {
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
        className="overflow-hidden"
        // style={{ overscrollBehavior: "none", scrollSnapType: "y mandatory" }}
      >
        {sections.map((entry, index) => {
          return (
            <React.Fragment key={index}>
              <Box
                className={`section-container h-screen w-full section-container-${entry.id} border border-red-500`}
                // style={{ scrollSnapAlign: "start" }}
                data-progress={`progress-${entry.id}`}
              >
                <Section
                  entry={entry}
                  activeSection={activeSection}
                  parent={container.current}
                />
              </Box>
            </React.Fragment>
          );
        })}
      </Box>
    </>
  );
};

export default SectionsSnapCSS;
