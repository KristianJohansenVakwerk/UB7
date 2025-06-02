"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import SplitText from "../../shared/SplitText/SplitText";
import Box from "../../ui/Box/Box";
import Slider from "../../shared/Slider/Slider";
import SectionPortfolio from "../Section/SectionPortfolio/SectionPortfolio";
import SectionAbout from "../Section/SectionAbout";
/* Plugins */
gsap.registerPlugin(useGSAP, ScrollTrigger);
const sectionsData = [
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
    const sections = gsap.utils.toArray(".section");

    const tl = gsap.timeline({
      scrollTrigger: {
        start: "top top",
        end: "bottom bottom",
        markers: false,
      },
    });

    // Define different start/end points for each section
    const sectionTriggers = [
      { start: "top center", end: "bottom center" }, // Portfolio section
      { start: "top top", end: "top top" }, // About section
      { start: "top 70%", end: "bottom 30%" }, // Contact section
    ];

    sections.forEach((section: any, index: number) => {
      ScrollTrigger.create({
        trigger: section,
        start: sectionTriggers[index].start,
        end: sectionTriggers[index].end,
        markers: false,
        onEnter: () => {
          setActiveSection(index);
        },
        onEnterBack: () => {
          setActiveSection(index);
        },
      });
    });
  }, []);

  return (
    <div>
      <div>
        {sectionsData.map((section: any, index: number) => {
          return (
            <div
              key={index}
              className={clsx(
                "section flex flex-col items-start justify-start w-screen  p-3 ",
                ` section-${index + 1}`,
                section.id === "portfolio" && "h-[120vh]",
                section.id === "about" && "h-[200vh]",
                section.id === "contact" && "h-screen"
              )}
            >
              <SectionTitle
                title={section.text}
                activeIndex={activeSection}
                index={index}
              />

              {section.id === "portfolio" ? (
                <SectionPortfolio
                  data={[
                    {
                      title: "Football",
                      entries: [
                        { title: "Manchester City Football Club" },
                        { title: "Peak Performance Technologies" },
                        { title: "Everyday Steps" },
                        { title: "Manchester City Football Club" },
                        { title: "Manchester City Football Club" },
                      ],
                      media: "/test-media/sectors/sector_1.jpg",
                    },
                    {
                      title: "Sport",
                      entries: [
                        { title: "NextGen Esports League" },
                        { title: "Peak Performance Technologies" },
                        { title: "Everyday Steps" },
                      ],
                      media: "/test-media/sectors/sector_2.jpg",
                    },
                    {
                      title: "Entertainment",
                      entries: [
                        { title: "NextGen Esports League" },
                        { title: "Peak Performance Technologies" },
                        { title: "Everyday Steps" },
                      ],
                      media: "/test-media/sectors/sector_3.jpg",
                    },
                    {
                      title: "Philanthropy",
                      entries: [
                        { title: "NextGen Esports League" },
                        { title: "Peak Performance Technologies" },
                        { title: "Everyday Steps" },
                      ],
                      media: "/test-media/sectors/sector_4.jpg",
                    },
                  ]}
                />
              ) : section.id === "about" ? (
                <SectionAbout />
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
