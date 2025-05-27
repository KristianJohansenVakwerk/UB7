"use client";
import { useAboutAnimations } from "@/app/hooks/AboutAnimations";
import Box from "../../ui/Box/Box";
import SplitText from "../../shared/SplitText/SplitText";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Slider from "../../shared/Slider/Slider";

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
  const reelContainerRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const secondAnimationRef = useRef<HTMLDivElement>(null);
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
          pinSpacing: false,
          pinnedContainer: scroller,
          markers: false,
          scrub: 0.1,
          onUpdate: (self) => {
            const progress = self.progress;

            if (progress === 0) {
              gsap.to(secondAnimationRef.current, {
                x: 0,
                ease: "power4.inOut",
              });

              gsap.to(".team-member-item", {
                opacity: 0,
                stagger: 0.2,
                duration: 0.5,
                ease: "power2.inOut",
              });
            }

            if (progress === 1) {
              gsap.to(secondAnimationRef.current, {
                x: "-100vw",
                ease: "power4.inOut",
              });

              gsap.to(".team-member-item", {
                opacity: 1,
                stagger: 0.2,
                duration: 0.5,
                delay: 0.2,
                ease: "power2.inOut",
              });
            }
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert(); // cleanup
  }, [scroller]);
  const handleClick = contextSafe(() => {
    const viewportWidth = window.innerWidth;
    const scaleFactor = viewportWidth < 768 ? 1.2 : 1.1; // Larger scale on mobile
    console.log("clicks");
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

        <Box
          ref={secondAnimationRef}
          className="absolute bottom-7 left-3 flex flex-row items-end justify-start flex-nowrap w-[200vw] h-auto"
        >
          <div
            ref={reelContainerRef}
            className="relative h-full w-[100vw] section-animation-about__reel"
            onClick={handleClick}
          >
            <img
              src="/Reel.jpg"
              width={"693"}
              height={"376"}
              className="w-auto h-full"
            />
          </div>

          <div
            ref={sliderContainerRef}
            className="relative w-[100vw] min-h-[376px] h-auto"
          >
            <Slider />
          </div>
        </Box>
      </Box>
    </>
  );
};

export default SectionAbout;
