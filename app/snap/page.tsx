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

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const sections = [
  {
    id: "intro",
    title: "Intro",
    background: "bg-red-500",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    background: "bg-blue-500",
  },
  {
    id: "about",
    title: "About",
    background: "bg-green-500",
  },
  {
    id: "contact",
    title: "Contact",
    background: "bg-yellow-500",
  },
];

export default function Home() {
  const smootherRef = useRef<ScrollSmoother | null>(null);

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
      effects: false,
      normalizeScroll: true,
      smoothTouch: 0.2,
    });

    const sections = gsap.utils.toArray(".section");

    const tops = sections.map((section, index) => {
      return ScrollTrigger.create({
        id: `sections`,
        trigger: section as HTMLElement,
        start: "top top",
        markers: true,
      });
    });

    if (!smootherRef.current) return;

    ScrollTrigger.create({
      id: `snapper`,
      trigger: ".smooth-content",
      scroller: ".smooth-wrapper",
      start: "top top",
      markers: true,
      onUpdate: (self) => {
        console.log(self.progress);
      },
      snap: {
        snapTo: (progress, self) => {
          let panelStarts = tops.map((st: any) => st.start);
          let panelEnds = tops.map((st: any) => st.end);

          const snapScrollStart = gsap.utils.snap(
            panelStarts,
            self?.scroll() || 0
          );
          const snapScrollEnd = gsap.utils.snap(panelEnds, self?.scroll() || 0);

          const normalizedStartValue = gsap.utils.normalize(
            self?.start as number,
            self?.end as number,
            snapScrollStart
          );

          const normalizedEndValue = gsap.utils.normalize(
            self?.start as number,
            self?.end as number,
            snapScrollEnd
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

          console.log("currentSectionIndex: ", currentSectionIndex);

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
            console.log("contact section - snapping to end");
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
  }, []);

  return (
    <>
      <div className="smooth-wrapper">
        <div className="smooth-content">
          {sections.map((section, index) => {
            return (
              <Section
                key={section.id}
                id={section.id}
                title={section.title}
                background={section.background}
              />
            );
          })}
        </div>
      </div>
      {/* <IntroPixi /> */}
    </>
  );
}

const Section = ({
  id,
  title,
  background,
}: {
  id: string;
  title: string;
  background: string;
}) => {
  return (
    <section
      className={clsx(
        "section flex items-center justify-center",
        background,
        id === "about" ? "h-[300vh]" : "h-screen"
      )}
      id={id}
    >
      <h1 className="test text-4xl font-bold rotate-0 opacity-0">{`Section ${title}`}</h1>
    </section>
  );
};
