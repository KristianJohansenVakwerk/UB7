"use client";
import { useAboutAnimations } from "@/app/hooks/AboutAnimations";
import Box from "../../ui/Box/Box";
import SplitText from "../../shared/SplitText/SplitText";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  entry: any;
  scroller?: any;
  active: boolean;
};

const text = `About us ad minim veniam, quis \n nostrud exercitation ullamco \n laboris nisi ut novarbus.`;
const SectionAbout = (props: Props) => {
  const { entry, scroller, active } = props;
  const container = useRef<HTMLDivElement>(null);
  useAboutAnimations(scroller, text, container, active);

  const { contextSafe } = useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: container.current,
        scroller: scroller,
        start: "top center",
        end: "+=200%",
        markers: true,
        onUpdate: (self) => {
          const progress = self.progress;
          console.log(progress);
          if (progress >= 0.25) {
            gsap.to(".section-animation-about__reel", {
              opacity: 0,
              duration: 0.5,
              y: -20,
              ease: "power4.inOut",
            });

            gsap.to(".section-animation-about__slider", {
              opacity: 1,
              duration: 0.5,
              delay: 0.5,
              y: 0,
              ease: "power4.inOut",
            });
          }

          if (progress >= 1) {
            gsap.to(
              [".split-text-container", ".section-animation-about__slider"],
              {
                opacity: 0,
                duration: 0.5,
                y: -20,
                ease: "power4.inOut",
              }
            );
          }
        },
      });
    },
    { scope: container, dependencies: [scroller, active] }
  );
  const handleClick = contextSafe(() => {
    const viewportWidth = window.innerWidth;
    const scaleFactor = viewportWidth < 768 ? 1.2 : 1.1; // Larger scale on mobile

    gsap.to(".section-animation-about__reel", {
      scale: scaleFactor,
      ease: "power4.inOut",
    });
  });

  return (
    <>
      <Box
        ref={container}
        className="section section-animation-about w-full h-full flex flex-col items-start justify-between px-3 py-7"
      >
        <div className="fixed top-7 z-10 split-text-container">
          <SplitText text={text} className={"text-4xl"} />
        </div>
        <div></div>

        <div
          className="fixed bottom-7 opacity-0 section-animation-about__reel"
          onClick={handleClick}
        >
          <img src="/reel.jpg" width={"693"} height={"376"} />
        </div>

        <div className="fixed bottom-7 opacity-0 section-animation-about__slider">
          Slider goes here
        </div>
      </Box>
    </>
  );
};

export default SectionAbout;
