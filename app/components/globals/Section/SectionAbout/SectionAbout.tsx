import Box from "../../../ui/Box/Box";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Slider from "../../../shared/Slider/Slider";
import clsx from "clsx";
import { TeamMember, teamMembers } from "@/app/utils/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const SectionAbout = (props: any) => {
  const { title } = props;
  const container = useRef<HTMLDivElement>(null);
  // const wrapperRef = useRef<HTMLDivElement>(null);
  // const [sliderActive, setSliderActive] = useState(false);
  // const animationRef = useRef<any>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const aboutTriggerOneRef = useRef<HTMLDivElement | null>(null);
  const aboutTriggerTwoRef = useRef<HTMLDivElement | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);
  const teamMemberWrapperRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const slides = gsap.utils.toArray(".team-member");
    const viewportWidth = window.innerWidth;

    // Calculate total width of all team member slides
    const totalSlidesWidth = slides.reduce((total: number, entry: any) => {
      const w = (entry as HTMLElement).offsetWidth;
      const gap = 48;
      return total + w + gap;
    }, 0);

    const scrollDistance = totalSlidesWidth - viewportWidth;

    // Create a single timeline for all animations
    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: aboutTriggerOneRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.1,
          markers: false,
        },
      })

      .to(
        imageContainerRef.current,
        {
          autoAlpha: 0,
          display: "none",
          duration: 0.3,
          ease: "none",
        },
        "+=0.5"
      ) // Add a 1-second delay before fading out
      .to(teamMemberWrapperRef.current, {
        x: -scrollDistance,
        duration: 1,
        ease: "none",
      });
  }, []);

  // useGSAP(() => {
  //   const slides = gsap.utils.toArray(".team-member");
  //   const wrapper = document.querySelector(".slider-wrapper") as HTMLElement;

  //   const endpoint = sliderContainerRef.current?.offsetHeight as number;

  //   gsap.to(aboutTriggerOneRef.current, {
  //     scrollTrigger: {
  //       id: "about-trigger-one",
  //       trigger: aboutTriggerOneRef.current,
  //       start: "top top",
  //       end: `+=50%`,
  //       // markers: { indent: 300 },
  //       markers: false,
  //       pin: true,
  //       pinSpacing: true,
  //       anticipatePin: 1,
  //       onEnter: () => {
  //         gsap.to(imageContainerRef.current, {
  //           opacity: 1,
  //           duration: 0.3,
  //           ease: "power2.inOut",
  //         });
  //       },
  //       onLeave: () => {
  //         gsap.to(imageContainerRef.current, {
  //           opacity: 0,
  //           duration: 0.3,
  //           ease: "power2.inOut",
  //         });
  //       },
  //       onEnterBack: () => {
  //         gsap.to(imageContainerRef.current, {
  //           opacity: 1,
  //           duration: 0.3,
  //           ease: "power2.inOut",
  //         });
  //       },
  //     },
  //     onComplete: () => {},
  //   });

  //   const totalSlidesWidth = slides.reduce(
  //     (total: number, entry: any, index: number) => {
  //       const w = (entry as HTMLElement).offsetWidth;

  //       const gap = 48;

  //       return total + w + gap;
  //     },
  //     0
  //   );

  //   // Calculate the end position
  //   // const viewportWidth = window.innerWidth;
  //   // const endPosition = -(totalSlidesWidth - viewportWidth + 48);
  //   // const wrapperHeight = (teamMemberWrapperRef.current as HTMLElement)
  //   //   .offsetHeight;

  //   // gsap.to(teamMemberWrapperRef.current, {
  //   //   scrollTrigger: {
  //   //     id: "about-trigger-two",
  //   //     trigger: aboutTriggerTwoRef.current,
  //   //     start: `top center-=${wrapperHeight / 2}px`,
  //   //     scrub: true,
  //   //     end: `+=${Math.abs(endPosition / 2)}px`,
  //   //     // markers: { indent: 800 },
  //   //     markers: false,
  //   //     pin: true,
  //   //     pinSpacing: true,
  //   //     anticipatePin: 1,
  //   //     onEnter: () => {
  //   //       // gsap.to(sliderInnerContainerRef.current, {
  //   //       //   opacity: 1,
  //   //       //   duration: 0.3,
  //   //       //   ease: "power2.inOut",
  //   //       // });
  //   //     },
  //   //     onEnterBack: () => {
  //   //       // gsap.to(sliderInnerContainerRef.current, {
  //   //       //   opacity: 1,
  //   //       //   duration: 0.3,
  //   //       //   ease: "power2.inOut",
  //   //       // });
  //   //     },
  //   //     onLeave: () => {
  //   //       // gsap.to(sliderInnerContainerRef.current, {
  //   //       //   opacity: 0,
  //   //       //   duration: 0.3,
  //   //       //   ease: "power2.inOut",
  //   //       // });
  //   //     },
  //   //     onLeaveBack: () => {
  //   //       // gsap.to(sliderInnerContainerRef.current, {
  //   //       //   opacity: 0,
  //   //       //   duration: 0.3,
  //   //       //   ease: "power2.inOut",
  //   //       // });
  //   //     },
  //   //   },
  //   //   x: endPosition,
  //   //   onComplete: () => {},
  //   // });
  // }, []);

  return (
    <div ref={container} className={clsx("relative w-full h-full")}>
      <div
        ref={aboutTriggerOneRef}
        className="w-full h-screen flex flex-col items-start"
      >
        <div className={"text-title font-sans pt-7 px-3"}>{title}</div>

        {/* New wrapper div for horizontal layout */}
        <div className="w-full h-full flex flex-row items-center gap-3">
          {/* Image container */}
          <div
            ref={imageContainerRef}
            className="relative w-[30vw] min-w-[300px] opacity-100 pl-3"
          >
            <img
              src="/Reel.jpg"
              width={"693"}
              height={"376"}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Team members container */}
          <div className="flex-1 overflow-hidden">
            <div
              ref={teamMemberWrapperRef}
              className="flex flex-row gap-3 translate-x-full"
            >
              <TeamMembers />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionAbout;

export const TeamMembers = () => {
  return teamMembers.map((m: TeamMember, index: number) => (
    <Box
      key={index}
      className="team-member bg-white rounded-2xl h-full w-[30vw] min-w-[768px] opacity-100"
    >
      <Box className="px-3 py-2 flex flex-col gap-1 h-full">
        <Box className="team-member-name text-light-grey text-base/none opacity-100">
          {m.name}
        </Box>
        <Box className="flex flex-row items-stretch justify-start gap-2 h-full">
          <Box className="team-member-image h-full opacity-100 flex items-center justify-center ">
            <img
              src={m.image}
              width={267}
              height={312}
              className="w-full h-full object-cover aspect-266/311"
            />
          </Box>
          <Box className="flex-2 text-light-grey flex flex-col justify-between">
            <Box className="team-member-text text-base opacity-100">
              {m.text}
            </Box>
            <Box className="flex flex-row items-center justify-start gap-1">
              {m.socials.map((s, index) => (
                <Box
                  key={index}
                  className="font-mono text-sm text-light-grey bg-gray-100 rounded-xl px-2 py-0.5"
                >
                  <span className="team-member-social opacity-100">
                    {s.platform}
                  </span>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  ));
};
