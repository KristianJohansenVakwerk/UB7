"use client";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useState } from "react";
import { useStore } from "@/store/store";
import clsx from "clsx";
import {
  getTimeline,
  useSectorListAnimation,
  useSectorListEvents,
} from "../../../../hooks/AnimationsHooks";

import {
  useAccordionSetup,
  useAccordionControls,
} from "../../../../hooks/AccordionHooks";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

type Props = {
  data: any;
  onExpandViewMode: (entryIndex: number, sector: string) => void;
  onShowBackground: (sector: string) => void;
  active: boolean;
};

const SectionPortfolioList = (props: Props) => {
  const { data, onExpandViewMode, onShowBackground, active } = props;
  const { accordionAnis, iconAnis, setupAccordion } = useAccordionSetup();
  const { playAccordion, resetAccordion } = useAccordionControls();
  const { setHoverSector } = useStore();

  // Add state to track if expanded view mode is active
  const [isExpandedMode, setIsExpandedMode] = useState(false);

  // Init the animation that controls the sector list and the accordions
  useSectorListAnimation();
  useGSAP(() => {
    setupAccordion();
  });

  useSectorListEvents("onScrollTriggerLeave", () => {
    console.log("onScrollTriggerLeave");
    resetAccordion(accordionAnis, iconAnis);
    setHoverSector(false);
    onShowBackground("");
  });

  const handleMouseEnter = useCallback(
    (index: number, sector: string) => {
      console.log("handleMouseEnter", active);
      playAccordion(index, accordionAnis, iconAnis);
      setHoverSector(true);
      onShowBackground(sector);
    },
    [accordionAnis, iconAnis]
  );

  const handleMouseLeave = useCallback(() => {
    console.log("handleMouseLeave", active);
    if (!active) return;

    resetAccordion(accordionAnis, iconAnis);
    setHoverSector(false);
    onShowBackground("");
  }, [accordionAnis, iconAnis, active]);

  const { timelineRef } = useSectorListAnimation();

  const showExpandedectors = (
    slug: string,
    sector: string,
    entryIndex: number
  ) => {
    // Pause smooth scroll when opening sectors
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);

    resetAccordion(accordionAnis, iconAnis);

    console.log("showExpandedectors callback");
    if (timelineRef?.current) {
      timelineRef.current.seek(1);
      timelineRef.current.reverse();
      timelineRef.current.eventCallback("onReverseComplete", () => {
        gsap.to(["#progress", "#section-title-portfolio", "#menu"], {
          opacity: 0,
          duration: 0.4,
          ease: "power4.inOut",
        });
        onExpandViewMode(entryIndex, sector);
      });
    }
  };

  return (
    <div className="w-full relative flex flex-row items-start justify-start">
      {data.map((sector: any, index: number) => {
        const realIndex = data
          .slice(0, index)
          .reduce(
            (sum: number, prevSector: any) => sum + prevSector.entries.length,
            0
          );

        return (
          <div
            key={index}
            className="sector-item relative w-[53px] opacity-0"
            onMouseLeave={() => handleMouseLeave()}
          >
            <div
              className="absolute left-0 sector-item-trigger w-[100%] h-[53px] rounded-[30px] border-2 border-[rgba(255,255,255,0.7)] z-10 bg-[rgba(255,255,255,0)]"
              onMouseEnter={() => handleMouseEnter(index, sector.title)}
            >
              <div
                className={clsx(
                  "sector-item-trigger-content opacity-0 w-full h-full flex flex-row items-center justify-between px-2 cursor-pointer"
                )}
              >
                <div className={"font-mono text-sm"}>{sector.title}</div>

                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={clsx(
                    `currentColor sector-icon`,
                    `sector-icon-${index}`
                  )}
                >
                  <path
                    d="M12 5V19"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-[53px] sector-item-content-background bg-[rgba(255,255,255,0)] rounded-[27px] z-0" />

            <div className="absolute top-[53px] left-0 w-full h-fit sector-item-content opacity-0  rounded-[27px] overflow-hidden z-20">
              <div className="sector-item-content-inner w-full pt-2 px-2 pb-1">
                {sector.entries.map((entry: any, ix: number) => {
                  return (
                    <div
                      key={index + ix}
                      className={clsx(
                        "sector-item-content-entry opacity-0 translate-y-[-5px] hover:text-light-grey hover:pl-1 transition-all duration-400 cursor-pointer"
                      )}
                    >
                      <div
                        onClick={(e) => {
                          console.log("clicked", entry.title, realIndex + ix);
                          e.stopPropagation();
                          showExpandedectors(
                            entry.slug,
                            entry.sector,
                            realIndex + ix
                          );
                        }}
                      >
                        {entry.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SectionPortfolioList;
