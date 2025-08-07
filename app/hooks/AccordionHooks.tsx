"use client";
import { useCallback, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export const useAccordionSetup = () => {
  const accordionAnis = useRef<any>(null);
  const iconAnis = useRef<any>(null);

  const setupAccordion = useCallback(() => {
    console.log("setupAccordion called - cleaning up existing animations");

    // Kill existing animations first
    if (accordionAnis.current) {
      console.log(
        "Killing existing accordion animations:",
        accordionAnis.current.length
      );
      accordionAnis.current.forEach((anim: any) => {
        if (anim) anim.kill();
      });
    }
    if (iconAnis.current) {
      console.log("Killing existing icon animations:", iconAnis.current.length);
      iconAnis.current.forEach((anim: any) => {
        if (anim) anim.kill();
      });
    }

    const sectors = gsap.utils.toArray(".sector-item-content");

    const sectorContentBackgrounds = gsap.utils.toArray(
      ".sector-item-content-background"
    );

    accordionAnis.current = sectors.map((sector: any, index: number) => {
      return gsap
        .timeline({ paused: true, id: `accordion-${index}` })
        .to(sectorContentBackgrounds[index] as HTMLElement, {
          height: 100,
          duration: ScrollTrigger.isTouch ? 0.5 : 0.2,
          ease: "expo.inOut",
          onReverseComplete: () => {
            gsap.set(sectors[index] as HTMLElement, {
              pointerEvents: "none",
            });
          },
        })
        .addLabel("backgroundComplete", "+=0")
        .to(sector, {
          opacity: 1,
          duration: 0.2,
          ease: "expo.inOut",
        })
        .addLabel("sectorVisible", "+=0")
        .to(sector.querySelectorAll(".sector-item-content-entry"), {
          opacity: 1,
          y: 0,
          duration: 0.2,
          stagger: 0.1,
          ease: "expo.inOut",
          onComplete: () => {
            gsap.set(sectors[index] as HTMLElement, {
              pointerEvents: "auto",
            });
          },
        })
        .addLabel("sectorComplete", "+=0");
    });

    iconAnis.current = sectors.map((sector: any, index: number) => {
      return gsap
        .timeline({ paused: true, id: `icon-${index}` })
        .to(`.sector-icon-${index} path:first-child`, {
          rotation: 90,
          duration: 0.2,
          transformOrigin: "center center",
          ease: "expo.inOut",
        });
    });
  }, []);

  // Add cleanup function
  const cleanupAccordion = useCallback(() => {
    console.log("cleaning up on unmount!");

    if (accordionAnis.current) {
      accordionAnis.current.forEach((anim: any) => {
        if (anim) anim.kill();
      });
      accordionAnis.current = null;
    }
    if (iconAnis.current) {
      iconAnis.current.forEach((anim: any) => {
        if (anim) anim.kill();
      });
      iconAnis.current = null;
    }
  }, []);

  return {
    accordionAnis: accordionAnis.current,
    iconAnis: iconAnis.current,
    setupAccordion,
    cleanupAccordion,
  };
};

export const useAccordionControls = () => {
  const previousIndexRef = useRef<number | null>(null);

  const playAccordion = useCallback(
    (index: number, accordionAnis: any[], iconAnis: any[]) => {
      if (previousIndexRef.current === index && !ScrollTrigger.isTouch) return;

      const isTouch = ScrollTrigger.isTouch;
      const items = gsap.utils.toArray(".sector-item");

      const sectors = gsap.utils.toArray(
        ".sector-item-content"
      ) as HTMLElement[];

      // get height for selected sector
      const sectorHeight = sectors[index].scrollHeight;
      // set height for selected sector
      accordionAnis[index].getChildren()[0].vars.height = sectorHeight + 53;

      // Mobile specific behaviour
      if (isTouch) {
        // get all sector items

        // if the active index is the same as the index, close all sectors
        if (previousIndexRef.current === index) {
          console.log("we clicked the same sector close all");
          accordionAnis[index]?.reverse();
          iconAnis[index]?.reverse();

          items.forEach((item: any, ix: number) => {
            gsap.to(item, {
              y: 0,
              duration: 0.5,
              ease: "expo.inOut",
              delay: 0.6, // Based on the duration of the accordionToClose timeline
            });
          });

          // accordionToClose.eventCallback("onReverseComplete", () => {

          // });

          previousIndexRef.current = null;
          return;
        }

        // Expand the touched sector and close the rest
      }

      // If there's an active accordion, reset it while playing the new one
      if (previousIndexRef.current !== null) {
        console.log(
          "we clicked a different sector open the new one and close the previous"
        );
        const previousAccordion = accordionAnis[previousIndexRef.current];
        const previousIcon = iconAnis[previousIndexRef.current];

        // Reset the current accordion (no await)
        if (previousAccordion && previousAccordion.progress() > 0) {
          previousAccordion.reverse();

          if (isTouch) {
            previousAccordion.eventCallback("onReverseComplete", () => {
              //   console.log("onReverseComplete triggered - executing callback");

              items.forEach((item: any, ix: number) => {
                gsap.to(item, {
                  y: ix > index ? sectorHeight : 0,
                  duration: 0.5,
                  ease: "expo.inOut",
                });
              });
              iconAnis[index]?.play();
              accordionAnis[index].play();
            });
          }
        }
        if (previousIcon && previousIcon.progress() > 0) {
          previousIcon.reverse();
        }
      } else {
        if (isTouch) {
          console.log("sectorHeight: ", sectors[index], sectorHeight);
          items.forEach((item: any, ix: number) => {
            gsap.to(item, {
              y: ix > index ? sectorHeight : 0,
              duration: 0.5,
              ease: "expo.inOut",
            });
          });
          iconAnis[index]?.play();
          accordionAnis[index].play();
        }
      }

      console.log("Play the new accordion immediately (in sync with reset)");
      // Play the new accordion immediately (in sync with reset)
      !isTouch && iconAnis[index]?.play();
      !isTouch && accordionAnis[index].play();

      previousIndexRef.current = index;
    },
    []
  );

  const resetAccordionMobile = useCallback(() => {
    if (ScrollTrigger.isTouch) {
      const items = gsap.utils.toArray(".sector-item");

      items.forEach((item: any, ix: number) => {
        gsap.to(item, {
          y: 0,
          duration: 0.5,
          ease: "expo.inOut",
        });
      });

      console.log("resetAccordionMobile called");
    }
  }, []);

  const resetAccordion = useCallback(
    (accordionAnis: any[], iconAnis: any[], cb?: () => void) => {
      console.log(
        "resetAccordion called with activeIndex:",
        previousIndexRef.current,
        "callback:",
        !!cb
      );

      if (previousIndexRef.current !== null) {
        const currentAccordion = accordionAnis[previousIndexRef.current];
        const currentIcon = iconAnis[previousIndexRef.current];

        // Clear any existing callbacks FIRST, before reversing
        console.log("Clearing existing callback");
        currentAccordion.eventCallback("onReverseComplete", null);

        // Set the new callback BEFORE reversing (if one is provided)
        if (cb) {
          console.log("Setting new callback");
          currentAccordion.eventCallback("onReverseComplete", () => {
            console.log("onReverseComplete triggered - executing callback");
            cb();
          });
        } else {
          console.log(
            "No callback provided - ensuring no event callback is set"
          );
          // Double-check that no callback is set
          currentAccordion.eventCallback("onReverseComplete", null);
        }

        console.log("Reversing animations");
        if (currentAccordion) {
          currentAccordion.reverse();
        }
        if (currentIcon) {
          currentIcon.reverse();
        }

        previousIndexRef.current = null;
      } else {
        console.log("No active index - nothing to reset");
      }
    },
    []
  );

  return {
    playAccordion,
    resetAccordion,
    resetAccordionMobile,
    // activeIndexRef: activeIndexRef.current,
  };
};
