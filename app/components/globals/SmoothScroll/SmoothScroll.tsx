"use client";
import clsx from "clsx";
import SectionPortfolio from "../Section/SectionPortfolio/SectionPortfolio";
import SectionAbout from "../Section/SectionAbout/SectionAbout";
import SectionContact from "../Section/SectionContact/SectionContact";
import { portfolioData, sectionsData } from "@/app/utils/data";
import React from "react";

const SmoothScroll = () => {
  return (
    <div>
      <div className="w-screen h-screen spacer"></div>
      {sectionsData.map((section: any, index: number) => {
        return (
          <React.Fragment key={index}>
            <div
              id={section.id}
              className={clsx(
                "relative section flex flex-col items-start justify-start w-screen",
                ` section-${index + 1}`,
                `section-${section.id}`,
                section.id === "portfolio" && "h-[100vh] ",
                section.id === "about" && "h-[auto] px-0",
                section.id === "contact" && "h-screen"
              )}
            >
              {section.id === "portfolio" ? (
                <SectionPortfolio data={portfolioData} title={section.text} />
              ) : section.id === "about" ? (
                <SectionAbout title={section.text} />
              ) : section.id === "contact" ? (
                <SectionContact title={section.text} />
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
