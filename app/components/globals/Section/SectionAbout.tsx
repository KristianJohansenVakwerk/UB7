import Box from "../../ui/Box/Box";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Slider from "../../shared/Slider/Slider";
import clsx from "clsx";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const SectionAbout = () => {
  const container = useRef<HTMLDivElement>(null);

  const animationRef = useRef<any>(null);

  useGSAP(() => {
    animationRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        scroller: "body",
        start: "top +=20%", // ~80% scroll
        end: "+=50%",
        markers: true,
        scrub: true,
        toggleActions: "play none reverse reverse",
        // onUpdate: (self) => {
        //   const progress = self.progress;
        //   const opacity = progress < 0.2 ? progress * 2 : 1;
        //   gsap.set(container.current, { opacity });
        // },
        onEnter: () => {
          gsap.to(container.current, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.inOut",
          });
        },
        onEnterBack: () => {
          gsap.to(container.current, {
            x: 0,
            force3D: true,
            willChange: "transform",
            ease: "power3.inOut",
            duration: 0.5,
          });
        },
        onLeave: () => {
          console.log("leave");
          gsap.to(container.current, {
            x: "-100vw",
            force3D: true,
            willChange: "transform",
            ease: "power3.inOut",
            duration: 0.5,
          });
        },
        onLeaveBack: () => {
          gsap.to(container.current, {
            opacity: 0,
            ease: "power2.inOut",
            duration: 0.3,
          });
        },
      },
    });
  }, []);
  return (
    <div
      className={clsx(
        "sticky top-[55%] flex flex-row gap-0 w-full overflow-hidden "
      )}
    >
      <Box
        ref={container}
        className="relative flex flex-row items-end justify-start flex-nowrap w-[200vw] h-auto opacity-0"
      >
        <div className="relative h-full w-screen">
          <img
            src="/Reel.jpg"
            width={"693"}
            height={"376"}
            className="w-auto h-full"
          />
        </div>

        <div className="relative w-[100vw] min-h-[376px] h-auto">
          <Slider />
        </div>
      </Box>
    </div>
  );
};

export default SectionAbout;
