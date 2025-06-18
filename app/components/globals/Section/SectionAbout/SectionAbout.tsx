import Box from "../../../ui/Box/Box";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Slider from "../../../shared/Slider/Slider";
import clsx from "clsx";
import { TeamMember, teamMembers } from "@/app/utils/data";
import SectionTitle from "../SectionTitle";
import { useLenis } from "lenis/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const SectionAbout = (props: any) => {
  const { title } = props;

  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const aboutTriggerOneRef = useRef<HTMLDivElement | null>(null);
  const teamMemberWrapperRef = useRef<HTMLDivElement | null>(null);
  const clickCloseRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [showTitle, setShowTitle] = useState<boolean>(false);
  const lenis = useLenis();

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
          id: "about-trigger",
          trigger: aboutTriggerOneRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.1,
          markers: false,
          onEnter: () => {
            setShowTitle(true);
          },
          onEnterBack: () => {
            setShowTitle(true);
          },
          onLeave: () => {
            setShowTitle(false);
          },
          onLeaveBack: () => {
            setShowTitle(false);
          },
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

  useGSAP(() => {
    if (!imageContainerRef.current || !clickCloseRef.current) return;

    let isScaled = false;

    const handleResize = () => {
      if (!isScaled || !imageRef.current) return;

      const image = imageRef.current;
      const imageWidth = image.offsetWidth;
      const imageHeight = image.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const availableWidth = windowWidth - (48 + 100); // 48px left, 100px right
      const availableHeight = windowHeight - (48 + 48); // 48px top and bottom

      const widthScale = availableWidth / imageWidth;
      const heightScale = availableHeight / imageHeight;
      const scale = Math.min(widthScale, heightScale);

      gsap.to(image, {
        scale: scale,
        duration: 0.3,
        ease: "power2.inOut",
      });
    };

    const handleClick = (state: boolean) => {
      isScaled = state;
      const image = imageRef.current;
      const imageWidth = image?.offsetWidth as number;
      const imageHeight = image?.offsetHeight as number;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const padding = { top: 48, left: 48, button: 48, right: 100 };

      const availableWidth = vw - (padding.left + padding.right);
      const availableHeight = vh - (padding.top + padding.button);

      const scaleX = availableWidth / imageWidth;
      const scaleY = availableHeight / imageHeight;

      const scale = Math.min(scaleX, scaleY);

      if (state) {
        lenis?.stop();
        gsap.to(image, {
          opacity: 1,
          scale: scale,
          y: 112 - padding.top,
          transformOrigin: "left bottom",
          willChange: "transform",
          duration: 0.8,
          ease: "power4.inOut",
        });
      } else {
        lenis?.start();
        gsap.to(imageRef.current, {
          scale: 1,
          y: 0,
          transformOrigin: "left bottom",
          duration: 0.8,
          ease: "power4.inOut",
        });
      }
    };

    clickCloseRef.current.addEventListener("click", () => handleClick(false));
    imageContainerRef.current.addEventListener("click", () =>
      handleClick(true)
    );
    window.addEventListener("resize", handleResize);

    return () => {
      clickCloseRef.current?.removeEventListener("click", () =>
        handleClick(false)
      );
      imageContainerRef.current?.removeEventListener("click", () =>
        handleClick(true)
      );
      window.removeEventListener("resize", handleResize);
    };
  }, [lenis]);

  return (
    <div
      ref={aboutTriggerOneRef}
      className="w-full h-screen flex flex-col items-start justify-between"
    >
      <div className={" pt-7 px-3"}>
        <SectionTitle title={title} id={"about"} play={showTitle} />
      </div>

      <div
        ref={clickCloseRef}
        className="absolute top-2 right-2 z-9999 w-[48px] h-[48px] rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md  flex items-center justify-center text-dark-grey cursor-pointer"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* New wrapper div for horizontal layout */}
      <div className="w-full flex flex-row items-end gap-3 pb-7">
        {/* Image container */}
        <div
          ref={imageContainerRef}
          className="relative w-[50vw] min-w-[300px] max-w-[768px] opacity-100 pl-3"
        >
          <img
            ref={imageRef}
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
          <Box className="team-member-image h-full opacity-100 flex items-center justify-center">
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
