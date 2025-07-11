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
import { sectionsData } from "../utils/data";

gsap.registerPlugin(Observer, ScrollTrigger, ScrollToPlugin);

export default function ObserverPage() {
  const [globalCurrentIndex, setGlobalCurrentIndex] = useState(0);
  useGSAP(() => {
    let allowScroll = true;
    let isAnimating = false;
    let currentIndex = 0;
    let scrollTimeout = gsap.delayedCall(1, () => (allowScroll = true)).pause(); // controls how long we should wait after an Observer-based animation is initiated before we allow another scroll-related action

    const swipeSections = gsap.utils.toArray(".swipe-section"); // Select your sections
    const swipePanels = gsap.utils.toArray(".swipe-section .panel");
    const swipeSectionInner = gsap.utils.toArray(".swipe-section-inner");
    gsap.set(swipePanels, {
      zIndex: (i) => swipePanels.length - i,
      yPercent: (i) => i * 100,
    });

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

        if (currentIndex === 2) {
          console.log("animateBox", self.direction);
          animateBox(self.deltaY, self.velocityY);
        }
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

    let currentX = 0;
    let targetX = 0;
    let animating = false;

    // const box = gsap.utils.toArray(".about-box");
    const box = document.querySelector(".about-box") as HTMLElement;
    const setX = gsap.quickSetter(box, "x", "px");

    const lerp = (start: number, end: number, amt: number) =>
      start + (end - start) * amt;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const onEdgeReached = (edge: "min" | "max") => {
      if (edge === "max") {
        currentIndex = 3;
        scrollToSection(currentIndex, true);
      } else if (edge === "min") {
        currentIndex = 1;
        scrollToSection(currentIndex, false);
      }

      isAtMin = false;
      isAtMax = false;
      edgeAttempt = 0;
    };

    const isTouchDevice = ScrollTrigger.isTouch;

    let edgeAttempt = 0;
    let isAtMin = false;
    let isAtMax = false;

    const animateBox = (deltaY: number, velocityY: number) => {
      if (!box) return;

      const boxWidth = box?.offsetWidth;
      const minX = 0;
      const maxX = window.innerWidth - boxWidth;

      const direction = deltaY > 0 ? -1 : 1;
      const baseSpeed = isTouchDevice ? 160 : 60;
      const maxDistance = 20;

      const distance = Math.min(Math.abs(velocityY * baseSpeed), maxDistance); // Feel free to tweak
      targetX += direction * distance;
      targetX = clamp(targetX, minX, maxX);

      const nextTargetX = targetX + direction * distance;

      // Overscroll at left edge
      if (nextTargetX < minX) {
        targetX = minX;

        if (!isAtMin) {
          edgeAttempt++;
          if (edgeAttempt >= 20) {
            isAtMin = true;
            isAtMax = false;
            edgeAttempt = 0;
            onEdgeReached("min");
          }
        }
        return;
      }

      // Overscroll at right edge
      if (nextTargetX > maxX) {
        targetX = maxX;

        if (!isAtMax) {
          edgeAttempt++;
          if (edgeAttempt >= 20) {
            isAtMax = true;
            isAtMin = false;
            edgeAttempt = 0;
            onEdgeReached("max");
          }
        }
        return;
      }

      if (!animating) {
        animateLoop();
      }
    };

    const animateLoop = () => {
      animating = true;

      const update = () => {
        currentX = lerp(currentX, targetX, 0.1); // 0.1 = smoothing factor
        setX(currentX);

        if (Math.abs(currentX - targetX) > 0.5) {
          requestAnimationFrame(update);
        } else {
          animating = false;
        }
      };

      requestAnimationFrame(update);
    };

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

      gsap.to(swipeSectionInner, {
        yPercent: -100 * index,
        duration: 0.75,
        ease: "expo.inOut",
      });
      currentIndex = index;
      setGlobalCurrentIndex(index);
    };

    // Pin sections
    ScrollTrigger.create({
      id: "swipe-section",
      trigger: ".swipe-section",
      markers: false,
      pin: true,
      start: "top top",
      end: "+=200", // just needs to be enough to not risk vibration where a user's fast-scroll shoots way past the end
      onEnter: (self) => {
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
  }, []);

  return (
    <>
      <div className="relative z-20">
        <div
          className={
            "swipe-section  relative w-screen h-[100svh] lg:h-screen overflow-hidden "
          }
        >
          <div className="swipe-section-inner w-screen h-screen ">
            <section
              className={
                "panel intro absolute w-full h-full  flex justify-center items-center "
              }
            >
              <SectionIntro inView={true} />
            </section>
            <section
              className={
                "panel portfolio absolute w-full h-full  flex justify-center items-center "
              }
            >
              <SectionPortfolio data={portfolioData} title="Portfolio" />
            </section>

            <section
              className={
                "panel about absolute w-full h-full  flex justify-start items-start"
              }
            >
              <div className="about-box absolute bottom-7 bg-purple-500 left-0 h-[100px] lg:h-[300px] w-[100px] lg:w-[300px]  flex justify-center items-center will-change-transform">
                About box
              </div>
            </section>

            <section
              className={
                "panel contact absolute w-full h-screen  flex justify-center  items-center "
              }
            >
              Contact
            </section>
          </div>
        </div>
      </div>
      <SectionTitles currentIndex={globalCurrentIndex} />
      <IntroPixi />
    </>
  );
}

import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

export const SectionTitles = ({ currentIndex }: { currentIndex: number }) => {
  const [prevIndex, setPrevIndex] = useState(currentIndex);
  const splitRef = useRef<any>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    console.log("currentIndex", currentIndex);
  }, [currentIndex]);

  useGSAP(() => {
    // Initial setup
    gsap.set(".section-title", { opacity: 1 });

    // Only create SplitText if there's actual text content
    if (sectionsData[currentIndex]?.text) {
      splitRef.current = SplitText.create(".splitText", {
        type: "words",
      });

      // Initial animation on mount
      gsap.from(splitRef.current.words, {
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        delay: 4,
        ease: "sine.out",
      });
    }
  }, []);

  useGSAP(() => {
    // Only run this when currentIndex changes (not on initial mount)
    if (prevIndex !== currentIndex) {
      // If there's existing split text, animate it out
      if (splitRef.current) {
        gsap.to(splitRef.current.words, {
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.in",
          onComplete: () => {
            // Revert the old split text
            splitRef.current.revert();
            splitRef.current = null;

            // Update the previous index
            setPrevIndex(currentIndex);

            // If the new section has text, create new split text and animate in
            if (sectionsData[currentIndex]?.text) {
              splitRef.current = SplitText.create(".splitText", {
                type: "words",
              });

              gsap.from(splitRef.current.words, {
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
              });
            }
          },
        });
      } else {
        // No previous text to animate out, just update index
        setPrevIndex(currentIndex);

        // If the new section has text, create split text and animate in
        if (sectionsData[currentIndex]?.text) {
          splitRef.current = SplitText.create(".splitText", {
            type: "words",
          });

          gsap.from(splitRef.current.words, {
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
          });
        }
      }
    }
  }, [currentIndex, prevIndex]);

  return (
    <div className="section-title fixed top-7 left-3 z-20 opacity-0">
      <h1 className="splitText text-sm lg:text-title">
        {sectionsData[currentIndex].text}
      </h1>
    </div>
  );
};
