"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import SplitText from "../../shared/SplitText/SplitText";
import Box from "../../ui/Box/Box";
import Slider from "../../shared/Slider/Slider";
/* Plugins */
gsap.registerPlugin(useGSAP, ScrollTrigger);
const sections = [
  {
    title: "portfolio",
    text: `Redefining capital with flair, \n precision, and purpose. \n Operating across four \n strategic sectors.`,
    id: "portfolio",
    color: "",
  },
  {
    title: "about",
    text: `About us ad minim veniam, quis \n nostrud exercitation ullamco \n laboris nisi ut novarbus.`,
    id: "about",
    color: "bg-yellow-500",
  },
  {
    title: "contact",
    text: `Contact ullamco laboris nisi ut \n ad minim veniam, quis nostrud \n exercitation et al.`,
    id: "contact",
    color: "bg-green-500",
  },
];

const SmoothScroll = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        start: "top top",
        end: "bottom bottom",
        markers: false,
        onUpdate: (self) => {
          const progress = self.progress;

          setActiveSection(Math.floor(progress * 2));
        },
      },
    });
  }, []);

  return (
    <div>
      <div>
        {sections.map((section, index) => {
          return (
            <div
              key={index}
              className={clsx(
                "flex flex-col items-start justify-start w-screen h-screen  p-3",
                `section-${index + 1}`
                // section.id === "portfolio" ? "h-[150vh]" : "h-screen"
              )}
            >
              <SectionTitle
                title={section.text}
                activeIndex={activeSection}
                index={index}
              />

              {section.id === "portfolio" ? (
                <Sectors
                  data={[
                    {
                      title: "Football",
                      entries: [],
                    },
                    {
                      title: "Sport",
                      entries: [],
                    },
                    {
                      title: "Entertainment",
                      entries: [],
                    },
                    {
                      title: "Philanthropy",
                      entries: [],
                    },
                  ]}
                />
              ) : section.id === "about" ? (
                <AboutSection />
              ) : section.id === "contact" ? (
                <div>{section.title}</div>
              ) : (
                <></>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmoothScroll;

const SectionTitle = ({
  title,
  activeIndex,
  index,
}: {
  title: string;
  activeIndex: number;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const linesContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.set(ref.current, { opacity: 0, duration: 0.2, ease: "power2.inOut" });

      if (activeIndex === index) {
        tl.to(ref.current, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.inOut",
        });
      }
    },
    { scope: ref, dependencies: [activeIndex] }
  );

  return (
    <div
      ref={ref}
      className={clsx(
        "section-title sticky top-3 mb-6 z-10",
        activeIndex === index ? "opacity-100" : "opacity-0"
      )}
    >
      <SplitText text={title} ref={linesContainerRef} />
    </div>
  );
};

const Sectors = (props: any) => {
  const { data } = props;
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        scroller: "body",
        start: "top top",
        end: "+=20%",
        markers: true,
        toggleActions: "play none reverse reverse",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          console.log("sector progress", progress);
        },
        // snap: {
        //   // snapTo: [0, 1],
        //   duration: 0.2,
        //   delay: 0.01,
        //   ease: "power2.inOut",
        // },
      },
    });

    tl.to(".sector-item", {
      width: "25%",
      stagger: 0.2,
      duration: 0.5,
    });

    tl.to(
      ".sector-item-content",
      {
        opacity: 1,
        stagger: 0.2,
        delay: 2,
      },
      "<"
    );
  }, []);
  return (
    <div
      className={clsx(
        "sticky top-[55%] flex flex-row items-center justify-start gap-0 w-full "
      )}
    >
      {data.map((sector: any, index: number) => {
        return (
          <div
            key={index}
            className="sector-item  rounded-full border-2 border-white opacity-100 w-[53px] h-[53px] flex flex-row items-center justify-start"
          >
            <div className="sector-item-content opacity-0 w-full flex flex-row items-start justify-between px-2">
              <div>{sector.title}</div>

              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="currentColor"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AboutSection = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        scroller: "body",
        start: "top center",
        end: "+=80%",
        markers: true,
        toggleActions: "play none reverse reverse",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          console.log("sector progress", progress);
        },
        // snap: {
        //   // snapTo: [0, 1],
        //   duration: 0.2,
        //   delay: 0.01,
        //   ease: "power2.inOut",
        // },
      },
    });

    tl.to(container.current, {
      x: "-220vw",
      force3D: true,
      willChange: "transform",
    });
  }, []);
  return (
    <div className="sticky top-[calc(50%+100px)] flex flex-row gap-0 w-full">
      <Box
        ref={container}
        className="relative flex flex-row items-end justify-start flex-nowrap w-[200vw] h-auto"
      >
        <div className="relative h-full w-[100vw]">
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
