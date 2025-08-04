"use client";

import Box from "../../../ui/Box/Box";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefObject, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import clsx from "clsx";
import { TeamMember, teamMembers } from "@/app/utils/data";
import SectionTitle from "../SectionTitle";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
const SectionAbout = (props: any) => {
  const { title } = props;

  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const aboutTriggerOneRef = useRef<HTMLDivElement | null>(null);
  const teamMemberWrapperRef = useRef<HTMLDivElement | null>(null);
  const clickCloseRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [showTitle, setShowTitle] = useState<boolean>(false);
  const [showClose, setShowClose] = useState<boolean>(false);
  const itemsContainer = useRef<HTMLDivElement | null>(null);
  const itemsContainerSlider = useRef<HTMLDivElement | null>(null);

  // const lenis = useLenis();

  const items = useMemo(() => {
    return [{ type: "box" }, ...teamMembers];
  }, []);

  useGSAP(() => {
    const items = gsap.utils.toArray(".item");
    const viewportWidth = window.innerWidth;

    // Calculate total width of all team member slides
    const totalSlidesWidth = items.reduce((total: number, entry: any) => {
      const w = (entry as HTMLElement).offsetWidth;
      const gap = 48;
      return total + w + gap;
    }, 0);

    const scrollDistance = totalSlidesWidth + 48 - viewportWidth;

    // Create a single timeline for all animations
    const tl = gsap
      .timeline({
        id: "about-timeline",
        paused: true,
        lazy: true,
        immediateRender: false,
        scrollTrigger: {
          id: "about-trigger",
          trigger: aboutTriggerOneRef.current,
          start: "top top+=10px",
          end: `+=${scrollDistance + 10} bottom+=9px`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.1,
          markers: false,

          onEnter: () => {
            setTimeout(() => {
              setShowTitle(true);
            }, 100);

            gsap.to(textRef.current, {
              id: "about-text-enter",
              autoAlpha: 1,
              duration: 0.3,
              delay: 0.9,
              ease: "power2.inOut",
            });
            gsap.killTweensOf(items);
            gsap.to(items, {
              id: "about-items-enter",
              autoAlpha: 1,
              duration: 0.2,
              stagger: 0.1,
              delay: 1.2,
              ease: "power2.inOut",
            });
          },
          onEnterBack: () => {
            setTimeout(() => {
              setShowTitle(true);
            }, 100);
          },

          onLeaveBack: () => {
            setTimeout(() => {
              setShowTitle(false);
            }, 100);

            gsap.killTweensOf(items);

            gsap.to(textRef.current, {
              id: "about-text-leave-back",

              autoAlpha: 0,
              duration: 0.3,
              delay: 0.4,
              ease: "expo.inOut",
            });
          },
        },
      })
      .addLabel("startScroll")
      .to(
        itemsContainerSlider.current,
        {
          x: -scrollDistance,
          duration: 1,
          ease: "none",
        },
        "+=0.1"
      );
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
      const smoother = ScrollSmoother.get();

      console.log("About:click on video", state);
      const tl = gsap.getById("about-timeline") as gsap.core.Timeline;

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
        smoother?.paused(true);

        tl?.tweenTo("startScroll", {
          duration: 0.8, // Animation duration
          ease: "power2.inOut",
          onComplete: () => {
            console.log("ABOUT: ready scale the video");
          },
        });

        gsap.to(
          [
            "#progress",
            "#menu",
            "#section-title-about",
            ".text-about",
            ".item-team-member",
          ],
          {
            autoAlpha: 0,
            duration: 0.4,
            delay: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
              setShowClose(true);
              gsap.to(imageContainerRef.current, {
                opacity: 1,
                duration: 0.8,
                ease: "power4.inOut",
              });
              gsap.to(image, {
                scale: scale,
                y: 112 - padding.top,
                transformOrigin: "left bottom",
                willChange: "transform",
                duration: 0.8,
                ease: "power4.inOut",
                onComplete: () => {
                  setShowClose(true);
                },
              });
            },
          }
        );
      } else {
        setShowClose(false);
        smoother?.paused(false);

        if (smoother) {
          gsap.to(smoother, {
            scrollTop: smoother?.offset(document.getElementById("about")),
            duration: 0,
            ease: "none",
          });
        }

        gsap.to(
          [
            "#progress",
            "#menu",
            "#section-title-about",
            ".text-about",
            ".item",
          ],
          {
            autoAlpha: 1,
            duration: 0.4,
            delay: 0.5,
            ease: "power2.inOut",
          }
        );
        gsap.to(imageRef.current, {
          scale: 1,
          y: 0,
          transformOrigin: "left bottom",
          duration: 0.8,
          ease: "power4.inOut",
          onComplete: () => {},
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
  }, []);

  return (
    <div
      ref={aboutTriggerOneRef}
      className="relative w-full h-screen flex flex-col items-start justify-between"
    >
      <div
        ref={clickCloseRef}
        className={clsx(
          "absolute top-2 right-2 z-9999 w-[48px] h-[48px] rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md  flex items-center justify-center text-dark-grey cursor-pointer opacity-0 transition-all duration-300 ease",
          showClose && "opacity-100"
        )}
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
      <div className="pt-7 px-3 flex flex-row gap-3">
        <div className="flex-2">
          <SectionTitle title={title} id={"about"} play={showTitle} />
        </div>

        <div
          ref={textRef}
          className="text-about flex-1 text-light-grey text-base/none opacity-0 lg:translate-y-[15px]"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </div>

      <div
        ref={itemsContainer}
        className="relative w-full pb-7  will-change-transform relative"
      >
        <div
          ref={itemsContainerSlider}
          className="flex flex-row items-start gap-3 px-3"
        >
          <TeamMembers
            items={items}
            imageContainerRef={imageContainerRef}
            imageRef={imageRef}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionAbout;

export const TeamMembers = ({
  items,
  imageContainerRef,
  imageRef,
}: {
  items: (TeamMember | { type: string })[];
  imageContainerRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
}) => {
  return items.map((m, index: number) => {
    // @ts-ignore
    if (m.type === "box") {
      return (
        <Box
          ref={imageContainerRef}
          key={index}
          className="item item-box rounded-2xl w-[80vw] lg:w-[30vw] lg:min-w-[768px] h-[420px] opacity-0 will-change-opacity cursor-pointer"
        >
          <img
            ref={imageRef}
            src="/Reel.jpg"
            width={"693"}
            height={"376"}
            className="w-full h-full object-cover object-center rounded-2xl"
          />
        </Box>
      );
    }

    if ("name" in m) {
      return (
        <Box
          key={index}
          className="item item-team-member bg-white rounded-2xl w-[30vw] min-w-[768px] h-[420px] opacity-0 will-change-opacity"
        >
          <Box className="px-3 py-3 flex flex-col gap-1 h-full">
            <Box className="team-member-name text-light-grey text-base/none opacity-100">
              {m.name}
            </Box>
            <Box className="flex flex-row items-stretch justify-start gap-2 h-full">
              <Box className="team-member-image  h-full opacity-100 flex items-center justify-center flex-1">
                <img
                  src={m.image}
                  width={267}
                  height={312}
                  className="w-full h-full object-cover object-center"
                />
              </Box>
              <Box className="text-light-grey  flex-2 mr-3 h-full">
                <Box className="flex flex-col gap-2 h-full justify-between">
                  <Box className="team-member-text text-base opacity-100">
                    {m.text}
                  </Box>

                  <Box className="flex flex-row items-center justify-between gap-1 w-full">
                    {m.socials.map((s, index) => (
                      <Box
                        key={index}
                        className="font-mono text-sm text-light-grey bg-gray-100 rounded-full px-1 py-0.5 flex-1 "
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
        </Box>
      );
    }
  });
};
