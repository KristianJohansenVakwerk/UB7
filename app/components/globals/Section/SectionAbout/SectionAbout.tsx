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
  // const wrapperRef = useRef<HTMLDivElement>(null);
  // const [sliderActive, setSliderActive] = useState(false);
  // const animationRef = useRef<any>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderInnerContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const slides = gsap.utils.toArray(".team-member");
    const wrapper = document.querySelector(".slider-wrapper") as HTMLElement;

    const endpoint = sliderContainerRef.current?.offsetHeight as number;

    gsap.to(imageContainerRef.current, {
      scrollTrigger: {
        trigger: imageContainerRef.current,
        start: "top center",
        end: `bottom center`,
        id: "image",
        markers: false,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onEnter: () => {
          gsap.to(imageContainerRef.current, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.inOut",
          });
        },
        onLeave: () => {
          gsap.to(imageContainerRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
          });
        },

        onEnterBack: () => {
          gsap.to(imageContainerRef.current, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.inOut",
          });
        },
      },
      onComplete: () => {},
    });

    gsap.to(sliderContainerRef.current, {
      scrollTrigger: {
        id: "slider-pinned",
        trigger: sliderContainerRef.current,
        start: "top center",
        end: "+=1000px",
        markers: false,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onEnter: () => {
          gsap.to(sliderInnerContainerRef.current, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.inOut",
          });
        },
        onEnterBack: () => {
          gsap.to(sliderInnerContainerRef.current, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.inOut",
          });
        },
        onLeave: () => {
          gsap.to(sliderInnerContainerRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
          });
        },
        onLeaveBack: () => {
          gsap.to(sliderInnerContainerRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
          });
        },
      },
      onComplete: () => {},
    });
  }, []);

  return (
    <div ref={container} className={clsx("relative w-full h-full")}>
      <div className="w-full h-[50vh] spacer"></div>
      <div
        ref={imageContainerRef}
        className="relative  w-full justify-start pl-3 opacity-0"
      >
        <img
          src="/Reel.jpg"
          width={"693"}
          height={"376"}
          className="w-auto h-full h-[25vh] object-cover object-center"
        />
      </div>

      <div ref={sliderContainerRef} className="relative w-full h-[25vh]">
        <div
          ref={sliderInnerContainerRef}
          className={clsx("w-full h-full opacity-0")}
        >
          <Slider />
        </div>
      </div>
    </div>
  );
};

export default SectionAbout;
