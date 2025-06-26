"use client";

import { useMemo } from "react";
import { portfolioData, sectionsData } from "@/app/utils/data";
import React from "react";
import SectionPortfolio from "../Section/SectionPortfolio/SectionPortfolio";
import SectionAbout from "../Section/SectionAbout/SectionAbout";
import SectionContact from "../Section/SectionContact/SectionContact";
import clsx from "clsx";

const SectionsController = () => {
  const mappedSections = useMemo(() => {
    const groups = [] as any;
    let currentGroup = [] as any;

    sectionsData.forEach((section: any, index: number) => {
      if (section.id === "intro" || section.id === "portfolio") {
        currentGroup.push(section);
      } else {
        if (currentGroup.length) {
          groups.push({ type: "snap", sections: [...currentGroup] });
          currentGroup = [];
        }

        if (section.id === "about") {
          groups.push({ type: "free", sections: [section] });
        }

        if (section.id === "contact") {
          groups.push({ type: "snap", sections: [section] });
        }
      }
    });

    return groups;
  }, []);

  console.log("mappedSections", mappedSections);

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
                        section.id === "about" && "h-[auto] px-0 bg-red-500",
                        section.id !== "about" && "h-screen",
                        section.id === "portfolio" && "justify-center",
                        section.id === "contact" && "bg-yellow-500"
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
                        <div className="w-screen h-screen spacer bg-red-500"></div>
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
