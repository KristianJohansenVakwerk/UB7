import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(useGSAP);

export const useAboutAnimations = (
  scroller: any,
  text: string,
  container: any,
  active: boolean
) => {
  const tl = useRef<any>(null);
  useGSAP(
    () => {
      tl.current = gsap.timeline({
        id: "about-timeline",
        ease: "power4.out",
        delay: 0.5,
        paused: true,
        immediateRender: false,
      });

      // Split text into lines
      const lines = text.split("\n");

      // Set initial state immediately, outside of timeline
      lines.forEach((_, index) => {
        gsap.set(`.section-animation-about .line-${index}`, {
          y: -20,
          visibility: "hidden",
        });
      });

      lines.forEach((_, index) => {
        tl.current.to(`.section-animation-about .line-${index}`, {
          y: 0,
          visibility: "visible",
          duration: 0.2,
          ease: "power4.out",
          stagger: 0.1,
        });
      });

      gsap.set(`.section-animation-about__reel`, {
        opacity: 0,
        y: -20,
      });

      tl.current.to(`.section-animation-about__reel`, {
        opacity: 1,
        y: 0,
        duration: 0.4,

        ease: "power4.out",
      });
    },
    { scope: container, dependencies: [text] }
  );

  useEffect(() => {
    if (active) {
      tl.current?.play();
    }
  }, [active]);
};
