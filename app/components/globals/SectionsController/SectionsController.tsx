"use client";
import { portfolioData, sectionsData } from "@/app/utils/data";
import React from "react";
import SectionPortfolio from "../Section/SectionPortfolio/SectionPortfolio";
import SectionAbout from "../Section/SectionAbout/SectionAbout";
import SectionContact from "../Section/SectionContact/SectionContact";
import clsx from "clsx";
import { useMappedSections } from "@/app/hooks/useMappedSections";
import SectionIntro from "../Section/SectionIntro";

const SectionsController = () => {
  const mappedSections = useMappedSections(sectionsData);

  return (
    <div>
      {mappedSections.length &&
        mappedSections.map((group: any, index: number) => {
          return (
            <div
              key={index}
              className={
                group.type === "snap" ? "snap-container" : "free-container"
              }
            >
              {group.sections.map((section: any, ix: number) => {
                return (
                  <React.Fragment key={index + ix}>
                    <div
                      id={section.id}
                      className={clsx(
                        "relative section flex flex-col items-start justify-start w-screen",
                        ` section-${index + 1}`,
                        `section-${section.id}`,
                        section.id === "about" && "h-[auto] px-0",
                        section.id !== "about" && "h-screen ",
                        section.id === "portfolio" && "h-sreen justify-center "
                      )}
                    >
                      {section.id === "portfolio" ? (
                        <SectionPortfolio
                          data={portfolioData}
                          title={section.text}
                        />
                      ) : section.id === "about" ? (
                        <SectionAbout title={section.text} />
                      ) : section.id === "contact" ? (
                        <SectionContact title={section.text} />
                      ) : section.id === "intro" ? (
                        <SectionIntro />
                      ) : (
                        <div>missing id</div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

export default SectionsController;
