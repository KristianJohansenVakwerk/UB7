"use client";
import clsx from "clsx";
import SectionPortfolio from "../Section/SectionPortfolio/SectionPortfolio";
import SectionAbout from "../Section/SectionAbout/SectionAbout";
import SectionContact from "../Section/SectionContact/SectionContact";
import { portfolioData, sectionsData } from "@/app/(appLayout)/utils/data";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
import React, { useEffect, useMemo, useState } from "react";
import { useLenis } from "lenis/react";

const SmoothScroll = () => {
  const lenis = useLenis();
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    console.log("scroll state:", scroll);

    if (!scroll) return;

    requestAnimationFrame(() => {
      setTimeout(() => {
        lenis?.scrollTo(".free-wrapper", {
          offset: 0,
          duration: 0.4,
          easing: (t) => {
            return -(Math.cos(Math.PI * t) - 1) / 2;
          },
          immediate: false,
          onComplete: () => {
            console.log("✅ Scrolled to next wrapper");
          },
        });
      }, 1000); // small timeout to let GSAP release control
    });
  }, [scroll, lenis]);

  useGSAP(() => {
    const wrappers = gsap.utils.toArray(".snap-wrapper");
    const freeWrappers = gsap.utils.toArray(".free-wrapper");

    wrappers.forEach((wrapper: any, index: number) => {
      const sections = gsap.utils.toArray(".snap-section", wrapper);

      if (sections.length > 1) {
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          markers: true,
          snap: {
            snapTo: 1 / sections.length - 1,
            duration: 0.4,
            delay: 0.2,
            ease: "power1.inOut",
          },
          onLeaveBack: () => {
            setScroll(false);
          },
        });

        const nextWrapper = freeWrappers[0] as HTMLElement;

        if (index === 0 && nextWrapper) {
          ScrollTrigger.create({
            id: "test",
            trigger: wrapper,
            start: "bottom bottom", // when the whole wrapper is leaving view
            end: "+=100", // minimal scroll after that
            markers: false,
            onLeave: (self) => {
              setScroll(true);
            },
          });
        }
      } else {
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top bottom",
          end: "bottom bottom",
          markers: false,
          snap: { snapTo: 1, duration: 0.4, ease: "power2.inOut", delay: 0.2 },
        });
      }
    });
    // const sections = gsap.utils.toArray(".snap-section");
    // console.log(sections);
    // ScrollTrigger.create({
    //   trigger: "#scroller ",
    //   start: "top top",
    //   end: "bottom bottom",
    //   markers: true,
    //   snap: {
    //     snapTo: (progress) => {
    //       const snapCount = sections.length;
    //       const snappedProgress = Math.round(progress * snapCount) / snapCount;
    //       console.log("snappedProgress", snappedProgress);
    //       return snappedProgress;
    //     },
    //     duration: 0.4,
    //     ease: "power1.inOut",
    //   },
    //   onUpdate: (self) => {},
    // });
  }, [lenis]);

  const mappedSections = useMemo(() => {
    console.log("section", sectionsData);
    const groups = [] as any;
    let currentGroup = [] as any;

    sectionsData.forEach((section: any, index: number) => {
      if (section.id === "intro" || section.id === "portfolio") {
        currentGroup.push(section);
      } else {
        if (currentGroup.length) {
          groups.push({ type: "snap", sections: [...currentGroup] });
          currentGroup = [];
        }

        if (section.id === "about") {
          groups.push({ type: "free", sections: [section] });
        }

        if (section.id === "contact") {
          groups.push({ type: "snap", sections: [section] });
        }
      }
    });

    return groups;
  }, []);

  return (
    <div id="scroller">
      {mappedSections.length &&
        mappedSections.map((group: any, index: number) => {
          return (
            <div
              key={index}
              className={
                group.type === "snap" ? "snap-wrapper" : "free-wrapper"
              }
            >
              {group.sections.map((section: any, ix: number) => {
                return (
                  <React.Fragment key={index + ix}>
                    <div
                      id={section.id}
                      className={clsx(
                        "relative section flex flex-col items-start justify-start w-screen",
                        ` section-${index + 1}`,
                        `section-${section.id}`,
                        section.id === "portfolio" && "h-[100vh] ",
                        section.id === "about" &&
                          "h-[auto] px-0 border-2 border-red-500 border-dashed",
                        section.id === "contact" && "h-screen",
                        section.id !== "about" && "snap-section"
                      )}
                    >
                      {section.id === "portfolio" ? (
                        <SectionPortfolio
                          data={portfolioData}
                          title={section.text}
                        />
                      ) : section.id === "about" ? (
                        <SectionAbout title={section.text} />
                      ) : section.id === "contact" ? (
                        <SectionContact title={section.text} />
                      ) : section.id === "intro" ? (
                        <div className="w-screen h-screen spacer"></div>
                      ) : (
                        <div>missing id</div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      {/* {sectionsData.map((section: any, index: number) => {
        return (
          <React.Fragment key={index}>
            <div
              id={section.id}
              className={clsx(
                "relative section flex flex-col items-start justify-start w-screen",
                ` section-${index + 1}`,
                `section-${section.id}`,
                section.id === "portfolio" && "h-[100vh] ",
                section.id === "about" && "h-[auto] px-0",
                section.id === "contact" && "h-screen",
                section.id !== "about" && "snap-section"
              )}
            >
              {section.id === "portfolio" ? (
                <SectionPortfolio data={portfolioData} title={section.text} />
              ) : section.id === "about" ? (
                <SectionAbout title={section.text} />
              ) : section.id === "contact" ? (
                <SectionContact title={section.text} />
              ) : section.id === "intro" ? (
                <div className="w-screen h-screen spacer"></div>
              ) : (
                <div>missing id</div>
              )}
            </div>
          </React.Fragment>
        );
      })} */}
    </div>
  );
};

export default SmoothScroll;
