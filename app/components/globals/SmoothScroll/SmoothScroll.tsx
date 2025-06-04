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
import SectionAbout from "../Section/SectionAbout/SectionAbout";
import SectionTitle from "../Section/SectionTitle";
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
  const [activeSection, setActiveSection] = useState<number | null>(null);
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
      { start: "top top", end: "bottom center" }, // Portfolio section
      { start: "top top", end: "top top" }, // About section
      { start: "top 70%", end: "bottom 30%" }, // Contact section
    ];

    sections.forEach((section: any, index: number) => {
      ScrollTrigger.create({
        trigger: section,
        start: sectionTriggers[index].start,
        end: sectionTriggers[index].end,
        // markers: index === 1 ? true : false,
        id: `section-${index}`,
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
                "section flex flex-col items-start justify-start w-screen  border-2 border-red-500",
                ` section-${index + 1}`,
                `section-${section.id}`,
                section.id === "portfolio" && "h-[120vh]",
                section.id === "about" && "h-auto px-0",
                section.id === "contact" && "h-screen"
              )}
            >
              <SectionTitle title={section.text} id={section.id} />

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
