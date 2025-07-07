"use client";

import ScrollTrigger from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import IntroPixi from "../components/globals/IntroPixi/IntroPixi";
import SectionIntro from "../components/globals/Section/SectionIntro";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Observer, ScrollTrigger, ScrollToPlugin);

const sectionsData = [
  {
    id: "intro",
    title: "Intro",
  },
  {
    id: "portfolio",
    title: "Portfolio",
  },
  {
    id: "about",
    title: "About",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

export default function ObserverPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useGSAP(() => {
    const sections = gsap.utils.toArray("section"); // Select your sections

    Observer.create({
      target: window,
      type: "wheel,touch",
      onUp: () => {
        if (currentIndex > 0) {
          console.log("up");
          scrollToSection(currentIndex - 1);
        }
      },
      onDown: () => {
        if (currentIndex < sections.length - 1) {
          console.log("down", currentIndex);
          scrollToSection(currentIndex + 1);
        }
      },
      wheelSpeed: 1,
      tolerance: 10,
      preventDefault: true,
    });

    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section as any,
        start: "top top",
        end: "bottom bottom",
        markers: true,
      });
    });

    const scrollToSection = (index: number) => {
      const target = sections[index] as HTMLElement;

      gsap.to(window, {
        scrollTo: { y: target, autoKill: false },
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          setCurrentIndex(index);
        },
      });
    };
  }, [currentIndex]);

  return (
    <>
      <div className="relative z-20">
        {sectionsData.map((section, index) => {
          return (
            <Section key={section.id} id={section.id} title={section.title} />
          );
        })}
      </div>

      <IntroPixi />
    </>
  );
}

const Section = ({ id, title }: { id: string; title: string }) => {
  return (
    <section
      className="section w-screen border-2 border-red-500 h-screen flex items-center justify-center"
      id={id}
    >
      <h1 className="test text-4xl font-bold  opacity-100">{`Section ${title}`}</h1>
    </section>
  );
};
