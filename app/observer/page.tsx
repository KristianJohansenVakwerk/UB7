"use client";

import ScrollTrigger from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import IntroPixi from "../components/globals/IntroPixi/IntroPixi";
import SectionIntro from "../components/globals/Section/SectionIntro";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";

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
  const observerRef = useRef<Observer | null>(null);
  useGSAP(() => {
    const sections = gsap.utils.toArray("section"); // Select your sections
    let isAnimating = false;
    let currentIndex = 0;
    gsap.to(window, { scrollTop: 0, duration: 0 });

    const scrollToSection = (index: number) => {
      isAnimating = true;

      const wrap = gsap.utils.wrap(0, sections.length);

      const ix = wrap(index);

      const target = sections[index] as HTMLElement;

      gsap.to(window, {
        scrollTo: { y: target, autoKill: true },
        duration: 0.8,
        ease: "expo.inOut",
        onComplete: () => {
          currentIndex = ix;
          isAnimating = false;
        },
      });
    };

    observerRef.current = Observer.create({
      target: window,
      type: "wheel,touch",
      ignore: "#about",
      onUp: () => {
        console.log("onUp: ", isAnimating, currentIndex);
        if (isAnimating) return;

        if (currentIndex > 0) {
          console.log("up");

          scrollToSection(currentIndex - 1);
        }
      },
      onDown: () => {
        if (isAnimating) return;

        if (currentIndex < sections.length - 1) {
          scrollToSection(currentIndex + 1);
        }
      },
      onStop: (self) => {
        // if (direction === 1) {
        //   scrollToSection(currentIndex + 1);
        //   // self.scrollY(200);
        // } else {
        //   scrollToSection(currentIndex - 1);
        //   // self.scrollY(200);
        // }
      },

      wheelSpeed: 1,
      tolerance: 200,
      preventDefault: true,
    });

    Observer.create({
      target: "#about",
      type: "wheel,touch",
      onUp: () => {
        console.log("onUp about: ");
        if (isAnimating) return;
        scrollToSection(currentIndex - 1);
      },
      onDown: () => {
        console.log("onDown about: ");
        if (isAnimating) return;
        scrollToSection(currentIndex + 1);
      },

      wheelSpeed: 1,
      tolerance: 200,
      preventDefault: true,
    });

    // ScrollTrigger.create({
    //   trigger: "#about",
    //   start: "top top",
    //   end: "bottom bottom",
    //   markers: true,
    //   onEnter: () => {
    //     console.log("onEnter");
    //     currentIndex = 3;
    //     isAnimating = false;
    //     // observerRef.current?.disable();
    //   },
    //   onEnterBack: () => {
    //     console.log("onEnterBack");
    //     // observerRef.current?.disable();
    //   },
    //   onLeave: () => {
    //     console.log("onLeave");

    //     gsap.to(window, {
    //       scrollTo: { y: sections[3] as HTMLElement, autoKill: false },
    //       duration: 0.4,
    //       onComplete: () => {},
    //     });
    //     // observerRef.current?.enable();
    //   },
    //   onLeaveBack: () => {
    //     console.log("onLeaveBack");
    //     currentIndex = 1;
    //     isAnimating = false;

    //     gsap.to(window, {
    //       scrollTo: { y: sections[1] as HTMLElement, autoKill: true },
    //       duration: 0.3,
    //       onComplete: () => {},
    //     });
    //     // observerRef.current?.enable();
    //   },
    // });

    // sections.forEach((section, index) => {
    //   ScrollTrigger.create({
    //     trigger: section as any,
    //     start: "top top",
    //     end: "bottom bottom",
    //     markers: true,
    //   });
    // });
  }, []);

  return (
    <>
      <div className="relative z-20">
        {sectionsData.map((section, index) => {
          return (
            <Section key={section.id} id={section.id} title={section.title} />
          );
        })}
      </div>

      {/* <IntroPixi /> */}
    </>
  );
}

const Section = ({ id, title }: { id: string; title: string }) => {
  return (
    <section
      id={id}
      className={clsx(
        "section relative w-screen h-screen border-2 border-red-500  flex items-center justify-center"
      )}
    >
      {id !== "about" ? (
        <h1 className="test text-4xl font-bold  opacity-100">{`Section ${title}`}</h1>
      ) : (
        <div
          className={"absolute bottom-7 right-0 w-[400px] h-[400px] bg-red-500"}
        ></div>
      )}
    </section>
  );
};
