import Box from "../../../ui/Box/Box";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Slider from "../../../shared/Slider/Slider";
import clsx from "clsx";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const SectionAbout = () => {
  const container = useRef<HTMLDivElement>(null);
  const [sliderActive, setSliderActive] = useState(false);
  const animationRef = useRef<any>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const w = imageContainerRef.current?.clientWidth;

    animationRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        scroller: "body",
        start: "+=20%", // ~80% scroll
        end: "+=30%",
        markers: true,
        scrub: true,
        toggleActions: "play none reverse reverse",
        id: "section-about",
        onEnter: () => {
          gsap.to(container.current, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.inOut",
          });
        },
        onEnterBack: () => {
          gsap.to(sliderContainerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power3.inOut",
            onComplete: () => {
              setSliderActive(false);
              gsap.to(imageContainerRef.current, {
                x: 0,
                opacity: 1,
                delay: 0.2,
                force3D: true,
                willChange: "transform",
                ease: "power2.inOut",
                duration: 0.5,
              });
            },
          });
        },
        onLeave: () => {
          gsap.to(imageContainerRef.current, {
            x: w ? -w - 200 : -100,
            opacity: 0,
            force3D: true,
            willChange: "transform",
            ease: "power2.inOut",
            duration: 0.5,
            onComplete: () => {
              gsap.to(sliderContainerRef.current, {
                opacity: 1,
                duration: 0.5,
                ease: "power3.inOut",
                delay: 0.2,
                onComplete: () => {
                  setSliderActive(true);
                },
              });
            },
          });
        },
        onLeaveBack: () => {
          gsap.to(container.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power3.inOut",
          });
        },
      },
    });
  }, []);

  return (
    <div
      className={clsx(
        "sticky top-[calc(100%-450px)] flex flex-row gap-0 w-full overflow-hidden pl-3 "
      )}
    >
      <Box
        ref={container}
        className="relative flex flex-row items-end justify-start flex-nowrap w-[100vw]  h-[376px] opacity-0"
      >
        <div
          ref={imageContainerRef}
          className="absolute bottom-0 left-0 h-full opacity-100"
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
          className="relative flex-1 w-[100vw] h-full opacity-0"
        >
          <Slider active={sliderActive} />
        </div>
      </Box>
    </div>
  );
};

export default SectionAbout;
