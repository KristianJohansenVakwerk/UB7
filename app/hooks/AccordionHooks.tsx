"use client";
import { useCallback, useRef } from "react";
import gsap from "gsap";

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
          duration: 0.2,
          ease: "power2.inOut",
        })
        .to(sector, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.inOut",
        })
        .to(sector.querySelectorAll(".sector-item-content-entry"), {
          opacity: 1,
          y: 0,
          duration: 0.2,
          stagger: 0.1,
          ease: "power2.inOut",
        });
    });

    iconAnis.current = sectors.map((sector: any, index: number) => {
      return gsap
        .timeline({ paused: true, id: `icon-${index}` })
        .to(`.sector-icon-${index} path:first-child`, {
          rotation: 90,
          duration: 0.2,
          transformOrigin: "center center",
          ease: "power2.inOut",
        });
    });
  }, []);

  // Add cleanup function
  const cleanupAccordion = useCallback(() => {
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
  const activeIndexRef = useRef<number | null>(null);

  const playAccordion = useCallback(
    (index: number, accordionAnis: any[], iconAnis: any[]) => {
      // If hovering over the same accordion, do nothing
      console.log("playAccordion: ", index);
      // gsap.killTweensOf(accordionAnis, iconAnis);

      const sectors = gsap.utils.toArray(
        ".sector-item-content"
      ) as HTMLElement[];
      const sectorHeight = sectors[index].scrollHeight;
      accordionAnis[index].getChildren()[0].vars.height = sectorHeight + 53;

      if (activeIndexRef.current === index) return;

      // If there's an active accordion, reset it while playing the new one
      if (activeIndexRef.current !== null) {
        const currentAccordion = accordionAnis[activeIndexRef.current];
        const currentIcon = iconAnis[activeIndexRef.current];

        // Reset the current accordion (no await)
        if (currentAccordion && currentAccordion.progress() > 0) {
          currentAccordion.reverse();
        }
        if (currentIcon && currentIcon.progress() > 0) {
          currentIcon.reverse();
        }
      }

      // Play the new accordion immediately (in sync with reset)
      iconAnis[index]?.play();
      accordionAnis[index].play();

      activeIndexRef.current = index;
    },
    []
  );

  const resetAccordion = useCallback(
    (accordionAnis: any[], iconAnis: any[], cb?: () => void) => {
      console.log(
        "resetAccordion called with activeIndex:",
        activeIndexRef.current,
        "callback:",
        !!cb
      );

      // gsap.killTweensOf(accordionAnis, iconAnis);

      if (activeIndexRef.current !== null) {
        const currentAccordion = accordionAnis[activeIndexRef.current];
        const currentIcon = iconAnis[activeIndexRef.current];

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

        activeIndexRef.current = null;
      } else {
        console.log("No active index - nothing to reset");
      }
    },
    []
  );

  return {
    playAccordion,
    resetAccordion,
    // activeIndexRef: activeIndexRef.current,
  };
};
