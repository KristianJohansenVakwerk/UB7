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
      start: "top top",
      markers: true,
      snap: {
        snapTo: (progress, self) => {
          let panelStarts = tops.map((st: any) => st.start);
          const snapScroll = gsap.utils.snap(panelStarts, self?.scroll() || 0);

          const normalizedValue = gsap.utils.normalize(
            self?.start as number,
            self?.end as number,
            snapScroll
          );

          console.log(
            "normalizedValue: ",
            "trigger start: ",
            self?.start,
            "trigger end: ",
            self?.end,
            "norm: ",
            normalizedValue,
            "snap scroll: ",
            snapScroll,
            "panelStarts: ",
            panelStarts
          );

          if (progress > 0.28 && progress < 0.68) {
            console.log("progress: ", progress);
            return progress;
          }

          return normalizedValue;
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
        "section  flex items-center justify-center",
        background,
        id === "about" ? "h-[300vh]" : "h-screen"
      )}
      id={id}
    >
      <h1 className="test text-4xl font-bold rotate-0 opacity-0">{`Section ${title}`}</h1>
    </section>
  );
};
