import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(useGSAP);

export const useContactAnimations = (
  scroller: any,
  text: string,
  container: any,
  active: boolean
) => {
  const tl = useRef<any>(null);
  useGSAP(
    () => {
      tl.current = gsap.timeline({
        id: "contact-timeline",
        ease: "power4.out",
        delay: 0.5,
        paused: true,
      });

      // Split text into lines
      const lines = text.split("\n");

      // Set initial state immediately, outside of timeline
      lines.forEach((_, index) => {
        gsap.set(`.section-animation-contact .line-${index}`, {
          y: -20,
          visibility: "hidden",
        });
      });

      lines.forEach((_, index) => {
        tl.current.to(`.section-animation-contact .line-${index}`, {
          y: 0,
          visibility: "visible",
          duration: 0.2,
          ease: "power4.out",
          stagger: 0.1,
        });
      });

      tl.current.to(`.section-animation-contact .info-item`, {
        opacity: 1,
        duration: 0.2,
        delay: 0.3,
        ease: "power4.out",
        stagger: 0.1,
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
