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
import { portfolioData } from "../utils/data";
import SectionPortfolio from "../components/globals/Section/SectionPortfolio/SectionPortfolio";
import SectionAbout from "../components/globals/Section/SectionAbout/SectionAbout";

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
  const intentRef = useRef<any>(null);
  const observerRef = useRef<Observer | null>(null);

  useGSAP(() => {
    let allowScroll = true;
    let isAnimating = false;
    let currentIndex = 0;
    let scrollTimeout = gsap.delayedCall(1, () => (allowScroll = true)).pause(); // controls how long we should wait after an Observer-based animation is initiated before we allow another scroll-related action

    const swipeSections = gsap.utils.toArray(".swipe-section"); // Select your sections
    const swipePanels = gsap.utils.toArray(".swipe-section .panel");
    gsap.set(swipePanels, { zIndex: (i) => swipePanels.length - i });

    let intentRef = ScrollTrigger.observe({
      type: "wheel,touch",
      preventDefault: true,
      onUp: (self: any) => {
        allowScroll && scrollToSection(currentIndex + 1, true);
      },
      onDown: (self: any) => {
        allowScroll && scrollToSection(currentIndex - 1, false);
      },
      tolerance: ScrollTrigger.isTouch ? 10 : 10,
      wheelSpeed: -1,
      onChange: (self: any) => {
        if (!allowScroll) return;
        console.log(
          "onChange observer",
          self.deltaY,
          self.velocityY,
          currentIndex
        );
      },
      onEnable: (self: any) => {
        console.log("onEnable observer");
        allowScroll = false;
        scrollTimeout.restart(true);
        // when enabling, we should save the scroll position and freeze it. This fixes momentum-scroll on Macs, for example.
        let savedScroll = self.scrollY();
        self._restoreScroll = () => self.scrollY(savedScroll); // if the native scroll repositions, force it back to where it should be
        document.addEventListener("scroll", self._restoreScroll, {
          passive: false,
        });
      },
      onDisable: (self: any) =>
        document.removeEventListener("scroll", self._restoreScroll),
    });

    // intentRef.disable();

    const scrollToSection = (index: number, isScrollingDown: boolean) => {
      if (currentIndex === 2) {
        return;
      }

      if (index === swipePanels.length && isScrollingDown) {
        console.log("disable observer");

        intentRef.disable();
        return;
      }

      if (index === -1 && !isScrollingDown) {
        console.log("add the top return");
        return;
      }

      allowScroll = false;
      scrollTimeout.restart(true);

      let target = isScrollingDown
        ? swipePanels[currentIndex]
        : swipePanels[index];

      gsap.to(target as HTMLElement, {
        yPercent: isScrollingDown ? -100 : 0,
        duration: 0.75,
        ease: "expo.inOut",
      });
      currentIndex = index;
    };

    // Pin sections
    ScrollTrigger.create({
      trigger: ".swipe-section",
      markers: true,
      pin: true,
      start: "top top",
      end: "+=200", // just needs to be enough to not risk vibration where a user's fast-scroll shoots way past the end
      onEnter: (self) => {
        console.log("onEnter");
        if (intentRef.isEnabled) {
          return;
        } // in case the native scroll jumped past the end and then we force it back to where it should be.
        self.scroll(self.start + 1); // jump to just one pixel past the start of this section so we can hold there.
        intentRef.enable(); // STOP native scrolling
      },
      onEnterBack: (self) => {
        if (intentRef.isEnabled) {
          return;
        } // in case the native scroll jumped backward past the start and then we force it back to where it should be.
        self.scroll(self.end - 1); // jump to one pixel before the end of this section so we can hold there.
        intentRef.enable(); // STOP native scrolling
      },
    });

    ScrollTrigger.create({
      id: "about",
      trigger: ".about-container",
      start: "top top",
      pin: true,
      end: "+=100%",
      markers: { indent: 400 },
      onEnter: (self) => {},
      onEnterBack: (self) => {
        console.log("onEnterBack about");
      },
    });

    ScrollTrigger.create({
      id: "contact",
      trigger: ".contact",
      start: "top center",
      snap: {
        snapTo: 1,
        duration: 0.75,
        ease: "expo.inOut",
        delay: 0.1,
      },
      markers: { indent: 400 },
      onEnter: (self) => {},
      onEnterBack: (self) => {
        console.log("onEnterBack about");
      },
    });
  }, []);

  return (
    <>
      <div className="relative z-20">
        <div
          className={
            "swipe-section  relative w-screen h-[100svh] lg:h-screen overflow-hidden "
          }
        >
          <section
            className={
              "panel intro absolute w-full h-full bg-blue-500 flex justify-center items-center "
            }
          >
            <SectionIntro inView={true} />
          </section>
          <section
            className={
              "panel portfolio absolute w-full h-full bg-red-500 flex justify-center items-center "
            }
          >
            <SectionPortfolio data={portfolioData} title="Portfolio" />
          </section>

          <section
            className={
              "panel about absolute w-full h-full bg-purple-500 flex justify-start items-start"
            }
          >
            <div className="about-box h-[300px] w-[300px] bg-red-500 flex justify-center items-center">
              About box
            </div>
          </section>

          <section
            className={
              "panel contact absolute w-full h-screen  flex justify-center bg-green-500 items-center "
            }
          >
            Contact
          </section>
        </div>
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
        "swipe-section relative w-screen h-screen overflow-hidden border-2 border-red-500  flex items-center justify-center"
      )}
    >
      <h1 className="test text-4xl font-bold  opacity-100">{`Section ${title}`}</h1>
    </section>
  );
};
