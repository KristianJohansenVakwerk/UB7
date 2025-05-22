import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const usePortfolioAnimations = (
  scroller: any,
  text: string,
  container: any,
  active: boolean
) => {
  const tl = useRef<any>(null);
  useGSAP(
    () => {
      tl.current = gsap.timeline({
        id: "portfolio-timeline",
        ease: "power4.out",
        delay: 0.5,
        paused: true,
      });

      // Text reveal animation
      const lines = text.split("\n");

      // Set initial state immediately, outside of timeline
      lines.forEach((_, index) => {
        gsap.set(`.section-animation-portfolio .line-${index}`, {
          y: -20,
          visibility: "hidden",
        });
      });

      lines.forEach((_, index) => {
        tl.current.to(`.section-animation-portfolio .line-${index}`, {
          y: 0,
          visibility: "visible",
          duration: 0.2,
          ease: "power4.out",
          stagger: 0.1,
        });
      });

      // Accordion animation comes here
      tl.current.fromTo(
        ".accordion-item",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power4.out",
          stagger: 0.2,
        }
      );
    },
    { scope: container, dependencies: [text] }
  );

  useEffect(() => {
    console.log("active", tl?.current);
    // const tl = gsap?.getById("portfolio-timeline");
    if (active) {
      tl?.current?.play();
    } else {
      // tl?.current?.reverse();
    }
  }, [active]);
};
