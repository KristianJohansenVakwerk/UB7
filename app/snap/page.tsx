"use client";

import { useInView } from "react-intersection-observer";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import IntroPixi from "../components/globals/IntroPixi/IntroPixi";
import SectionIntro from "../components/globals/Section/SectionIntro";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import SectionContact from "../components/globals/Section/SectionContact/SectionContact";
import SectionAbout from "../components/globals/Section/SectionAbout/SectionAbout";
import SectionPortfolio from "../components/globals/Section/SectionPortfolio/SectionPortfolio";
import { portfolioData, sectionsData } from "../utils/data";
import { useStore } from "@/store/store";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const sections = sectionsData;

console.log("sections: ", sections);

export default function Home() {
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { introStoreDone } = useStore();

  // Create ScrollSmoother
  useGSAP(() => {
    // Clean up existing smoother if it exists
    if (smootherRef.current) {
      smootherRef.current.kill();
    }

    smootherRef.current = ScrollSmoother.create({
      wrapper: ".smooth-wrapper",
      content: ".smooth-content",
      smooth: 0.7,
      effects: true,
      normalizeScroll: false,
      smoothTouch: 0.2,
      onUpdate: () => {
        setScrolling(true);

        // // Clear existing timeout before setting a new one
        // if (timerRef.current) {
        //   clearTimeout(timerRef.current);
        // }

        // timerRef.current = setTimeout(() => {
        //   setScrolling(false);
        // }, 100);
      },
    });

    const sections = gsap.utils.toArray(".section");

    const tops = sections.map((section: any, index: number) => {
      return ScrollTrigger.create({
        id: `section-${section?.id}`,
        trigger: section as HTMLElement,
        start: "top top",
        end: "bottom center",
        markers: false,
      });
    });

    if (!smootherRef.current) return;

    ScrollTrigger.create({
      id: `snapper`,
      trigger: ".smooth-content",
      scroller: ".smooth-wrapper",
      start: "top top",
      markers: false,
      onUpdate: (self) => {},
      onSnapComplete: () => {
        setScrolling(false);
      },
      snap: {
        snapTo: (progress, self) => {
          let panelStarts = tops.map((st: any) => st.start);
          let panelEnds = tops.map((st: any) => st.end);

          const snapScrollStart = gsap.utils.snap(
            panelStarts,
            self?.scroll() || 0
          );

          const normalizedStartValue = gsap.utils.normalize(
            self?.start as number,
            self?.end as number,
            snapScrollStart
          );

          const currentScroll = self?.scroll() || 0;

          let currentSectionIndex = -1;
          for (let i = 0; i < panelStarts.length; i++) {
            const nextSectionStart =
              i < panelStarts.length - 1 ? panelStarts[i + 1] : Infinity;

            if (
              currentScroll >= panelStarts[i] &&
              currentScroll < panelEnds[i]
            ) {
              currentSectionIndex = i;
              break;
            }
          }

          console.log("currentSectionIndex: ");

          // // Handle the boundary between about and contact sections
          if (currentSectionIndex === 2) {
            // About section
            const totalScrollHeight = self?.end || 0;
            const distanceFromEnd =
              totalScrollHeight - currentScroll - window.innerHeight;

            console.log("distanceFromEnd: ", distanceFromEnd);

            // If we've scrolled more than 100px into the contact section, switch to contact
            if (distanceFromEnd < window.innerHeight - 300 && self?.direction) {
              console.log("switching to contact section");
              currentSectionIndex = 3; // Switch to contact section
            }
          }

          if (currentSectionIndex === 3) {
            const totalScrollHeight = self?.end || 0;
            const distanceFromEnd =
              totalScrollHeight - currentScroll - window.innerHeight;
            console.log("distanceFromEnd: ", distanceFromEnd);

            if (distanceFromEnd > 200 && !self?.direction) {
              currentSectionIndex = 2; // Switch to contact section
            }
          }

          // Snap to the start of the intro and portfolio
          if (currentSectionIndex <= 1) {
            console.log("intro and portfolio section");
            return normalizedStartValue;
          }

          // About section (index 2) - snap to top only
          if (currentSectionIndex === 2) {
            // If we're very close to the start of the about section, snap to it
            const aboutSectionStart = panelStarts[2];
            const distanceFromStart = Math.abs(
              currentScroll - aboutSectionStart
            );
            // const distanceFromEnd = Math.abs(currentScroll - aboutSectionEnd);

            const normalizedAboutSectionStart = gsap.utils.normalize(
              self?.start as number,
              self?.end as number,
              aboutSectionStart
            );

            // const normalizedAboutSectionEnd = gsap.utils.normalize(
            //   self?.start as number,
            //   self?.end as number,
            //   aboutSectionEnd
            // );

            if (distanceFromStart < 100) {
              console.log(
                "about section is not scroll past 100px from the top"
              );
              // Threshold of 100px
              return normalizedAboutSectionStart;
            }

            console.log("Free scrolling within the about section");
            // Otherwise, allow free scrolling within the about section
            return progress;
          }

          // Last section (contact) - snap normally
          if (currentSectionIndex === 3) {
            return normalizedStartValue;
          }
          // Default fallback
          return normalizedStartValue;
        },
        duration: 0.3,
        delay: 0.01,
        ease: "power4.inOut",
      },
    });

    ScrollTrigger.normalizeScroll(true);
  }, []);

  useEffect(() => {
    if (introStoreDone) {
      smootherRef?.current?.paused(false);
    } else {
      smootherRef?.current?.paused(true);
    }
  }, [introStoreDone]);

  return (
    <>
      <div
        className={clsx(
          "smooth-wrapper z-10",
          scrolling ? "pointer-events-none" : "pointer-events-auto"
        )}
      >
        <div className="smooth-content">
          {sections.map((section, index) => {
            switch (section.id) {
              case "intro":
                return (
                  <div
                    id="intro"
                    key={section.id}
                    className="section h-[100svh] lg:h-screen w-full"
                  >
                    <SectionIntro inView={true} />
                  </div>
                );
                break;

              case "portfolio":
                return (
                  <div
                    id="portfolio"
                    key={section.id}
                    className="section relative h-[100svh] lg:h-screen w-full"
                  >
                    <SectionPortfolio
                      data={portfolioData}
                      title={section.text}
                    />
                  </div>
                );
                break;

              case "about":
                return (
                  <div
                    id="about"
                    key={section.id}
                    className="section h-[auto] w-full"
                  >
                    <SectionAbout title={section.text} />
                  </div>
                );
                break;

              case "contact":
                return (
                  <div
                    key={section.id}
                    id={section.id}
                    className="section h-[100svh] lg:h-screen w-full"
                  >
                    <SectionContact
                      key={section.id}
                      title={section?.text || ""}
                    />
                  </div>
                );
                break;
            }
          })}
        </div>
      </div>
      {/* <IntroPixi /> */}
    </>
  );
}
