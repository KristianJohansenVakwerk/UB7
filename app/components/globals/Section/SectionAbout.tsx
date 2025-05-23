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
  const sectionRef = useRef<HTMLDivElement>(null);
  useAboutAnimations(scroller, text, sectionRef, active);

  const { contextSafe } = useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller, // <- IMPORTANT
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          scrub: 0.1,
          markers: true,
        },
      });

      // tl.to(sectionRef.current, {
      //   yPercent: -100,
      //   duration: 1,
      // });
    }, sectionRef);

    return () => ctx.revert(); // cleanup
  }, [scroller]);
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
        ref={sectionRef}
        className="section section-animation-about w-full h-full flex flex-col items-start justify-between px-3 py-7 relative"
      >
        <div className=" z-10 split-text-container">
          <SplitText text={text} className={"text-4xl"} />
        </div>
        <div></div>

        <div
          className="absolute bottom-7 left-3  section-animation-about__reel"
          onClick={handleClick}
        >
          <img src="/reel.jpg" width={"693"} height={"376"} />
        </div>

        <div className="absolute bottom-7 left-3 w-full bg-red-500 h-[376] translate-x-[100%] section-animation-about__slider">
          Slider goes here
        </div>
      </Box>
    </>
  );
};

export default SectionAbout;
