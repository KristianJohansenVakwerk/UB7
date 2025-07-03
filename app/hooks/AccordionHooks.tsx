"use client";
import { useCallback, useRef } from "react";
import gsap from "gsap";

export const useAccordionSetup = () => {
  const accordionAnis = useRef<any>(null);
  const iconAnis = useRef<any>(null);

  const setupAccordion = useCallback(() => {
    const sectors = gsap.utils.toArray(".sector-item-content");
    console.log("sectors", sectors);

    const sectorContentBackgrounds = gsap.utils.toArray(
      ".sector-item-content-background"
    );

    accordionAnis.current = sectors.map((sector: any, index: number) => {
      return gsap
        .timeline({ paused: true })
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
        .timeline({ paused: true })
        .to(`.sector-icon-${index} path:first-child`, {
          rotation: 90,
          duration: 0.2,
          transformOrigin: "center center",
          ease: "power2.inOut",
        });
    });
  }, []);

  return {
    accordionAnis: accordionAnis.current,
    iconAnis: iconAnis.current,
    setupAccordion,
  };
};

export const useAccordionControls = () => {
  const activeIndexRef = useRef<number | null>(null);

  const playAccordion = useCallback(
    (index: number, accordionAnis: any[], iconAnis: any[]) => {
      // If hovering over the same accordion, do nothing

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
      if (activeIndexRef.current !== null) {
        const currentAccordion = accordionAnis[activeIndexRef.current];
        const currentIcon = iconAnis[activeIndexRef.current];

        currentAccordion.reverse();
        currentIcon.reverse();

        currentAccordion.eventCallback("onReverseComplete", () => {
          console.log("resetAccordion");
          cb?.();
        });

        activeIndexRef.current = null;
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
