"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import Box from "../../ui/Box/Box";
import Slider from "../../shared/Slider/Slider";
import SectionPortfolio from "../Section/SectionPortfolio/SectionPortfolio";
import SectionAbout from "../Section/SectionAbout/SectionAbout";
import SectionTitle from "../Section/SectionTitle";
import { globalSectionTriggers } from "@/app/utils/gsapUtils";
import SectionContact from "../Section/SectionContact/SectionContact";
import { portfolioData, sectionsData } from "@/app/utils/data";
import React from "react";
/* Plugins */
gsap.registerPlugin(useGSAP, ScrollTrigger);

const SmoothScroll = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  useGSAP(() => {
    const sections = gsap.utils.toArray(".section");

    sections.forEach((section: any, index: number) => {
      ScrollTrigger.create({
        trigger: section,
        start: globalSectionTriggers[index]?.start,
        end: globalSectionTriggers[index]?.end,
        markers: false,
        id: `section-${index}`,

        onEnter: () => {
          setActiveSection(index);
        },
        onEnterBack: () => {
          setActiveSection(index);
        },
      });
    });
    ScrollTrigger.refresh();
  }, []);

  return (
    <div>
      <div className="w-screen h-screen spacer"></div>
      {sectionsData.map((section: any, index: number) => {
        return (
          <React.Fragment key={index}>
            <SectionTitle title={section.text} id={section.id} />
            <div
              id={section.id}
              className={clsx(
                "relative section flex flex-col items-start justify-start w-screen bg-[#E5E5E5]",
                ` section-${index + 1}`,
                `section-${section.id}`,
                section.id === "portfolio" && "h-[100vh] ",
                section.id === "about" && "h-[auto] px-0",
                section.id === "contact" && "h-[100vh] bg-yellow-300"
              )}
            >
              {section.id === "portfolio" ? (
                <SectionPortfolio data={portfolioData} />
              ) : section.id === "about" ? (
                <SectionAbout />
              ) : section.id === "contact" ? (
                <SectionContact />
              ) : (
                <div>missing id</div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SmoothScroll;
