"use client";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useRef, useState } from "react";
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

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

type Props = {
  data: any;
  onExpandViewMode: (entryIndex: number, sector: string) => void;
  onShowBackground: (sector: string) => void;
};

const SectionPortfolioList = (props: Props) => {
  const { data, onExpandViewMode, onShowBackground } = props;
  const { accordionAnis, iconAnis, setupAccordion } = useAccordionSetup();
  const { playAccordion, resetAccordion } = useAccordionControls();

  const [deactivateMouseEvents, setDeactivateMouseEvents] =
    useState<boolean>(true);

  const { setHoverSector } = useStore();

  // Init the animation that controls the sector list
  useSectorListAnimation();

  useSectorListEvents("onComplete", () => {
    setupAccordion();
    setDeactivateMouseEvents(false);
  });

  useSectorListEvents("onReverseComplete", () => {
    setDeactivateMouseEvents(true);
  });

  useSectorListEvents("onScrollTriggerLeave", () => {
    resetAccordion(accordionAnis, iconAnis);
    setHoverSector(false);
    onShowBackground("");
  });

  const handleMouseEnter = useCallback(
    (index: number, sector: string) => {
      if (deactivateMouseEvents) return;

      playAccordion(index, accordionAnis, iconAnis);
      setHoverSector(true);
      onShowBackground(sector);
    },
    [deactivateMouseEvents]
  );

  const handleMouseLeave = useCallback(() => {
    if (deactivateMouseEvents) return;

    resetAccordion(accordionAnis, iconAnis);
    setHoverSector(false);
    onShowBackground("");
  }, [deactivateMouseEvents]);

  const { timelineRef } = useSectorListAnimation();
  const showExpandedectors = (
    slug: string,
    sector: string,
    entryIndex: number
  ) => {
    // Pause smooth scroll when opening sectors
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);
    setDeactivateMouseEvents(true);

    resetAccordion(accordionAnis, iconAnis, () => {
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
    });
  };

  return (
    <div className="w-full relative flex flex-row items-start justify-start">
      {data.map((sector: any, index: number) => {
        const realIndex = index * sector.entries.length;
        return (
          <div
            key={index}
            className="sector-item relative w-[53px] opacity-0"
            onMouseEnter={() => handleMouseEnter(index, sector.title)}
            onMouseLeave={() => handleMouseLeave()}
          >
            <div className="absolute left-0 sector-item-trigger w-[100%] h-[53px] rounded-[30px] border-2 border-[rgba(255,255,255,0.7)] z-10 bg-[rgba(255,255,255,0)] ">
              <div
                className={clsx(
                  "sector-item-trigger-content opacity-0 w-full h-full flex flex-row items-center justify-between px-2 cursor-pointer ",
                  deactivateMouseEvents && "cursor-auto pointer-events-none"
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

            <div className="absolute top-0 left-0 w-full h-[53px] sector-item-content-background bg-[rgba(0,0,0,0)] rounded-[27px] z-0" />

            <div className="absolute top-[53px] left-0 w-full h-fit sector-item-content opacity-0  rounded-[27px] overflow-hidden z-20">
              <div className="sector-item-content-inner  w-full pt-[53px] px-1 pb-2">
                {sector.entries.map((entry: any, ix: number) => {
                  return (
                    <div
                      key={index + ix}
                      className={clsx(
                        "sector-item-content-entry opacity-0 translate-y-[-5px] hover:text-light-grey hover:pl-1 transition-all duration-400 cursor-pointer",
                        deactivateMouseEvents &&
                          "pointer-events-none cursor-auto"
                      )}
                    >
                      <div
                        onClick={() =>
                          showExpandedectors(
                            entry.slug,
                            entry.sector,
                            realIndex + ix
                          )
                        }
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
