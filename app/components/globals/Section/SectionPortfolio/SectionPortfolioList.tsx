"use client";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
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
  currentIndex: number;
};

const SectionPortfolioList = (props: Props) => {
  const { data, onExpandViewMode, onShowBackground, active, currentIndex } =
    props;
  const { accordionAnis, iconAnis, setupAccordion, cleanupAccordion } =
    useAccordionSetup();
  const { playAccordion, resetAccordion, resetAccordionMobile } =
    useAccordionControls();
  const { setHoverSector, setDisableScroll } = useStore();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Single useGSAP call with proper cleanup
  useGSAP(() => {
    setupAccordion();

    return () => {
      console.log("cleaning up accordion");
      cleanupAccordion();
    };
  }, [setupAccordion, cleanupAccordion]); // Add dependencies

  const handleMouseEnter = useCallback(
    (index: number, sector: string) => {
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

  const { timelineRef } = useSectorListAnimation(currentIndex);

  const pendingExpansionRef = useRef<{
    entryIndex: number;
    sector: string;
  } | null>(null);

  useSectorListEvents("onReverseComplete", () => {
    console.log("onReverseComplete");
    if (!pendingExpansionRef.current) return;
    gsap.to(
      ["#progress", "#section-title-portfolio", "#menu", ".section-title"],
      {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power4.inOut",
      }
    );

    onExpandViewMode(
      pendingExpansionRef.current.entryIndex,
      pendingExpansionRef.current.sector
    );
    pendingExpansionRef.current = null;
  });

  const showExpandedectors = (
    slug: string,
    sector: string,
    entryIndex: number
  ) => {
    if (!active) {
      console.log("showExpandedectors blocked - component not active");
      return;
    }

    pendingExpansionRef.current = { entryIndex, sector };

    resetAccordion(accordionAnis, iconAnis);

    if (timelineRef?.current) {
      timelineRef.current.seek(1);
      timelineRef.current.reverse();
    }

    setDisableScroll(true);
  };

  useEffect(() => {
    if (currentIndex !== 1) {
      if (ScrollTrigger.isTouch) {
        onShowBackground("");
        setHoverSector(false);
        resetAccordion(accordionAnis, iconAnis);
        resetAccordionMobile();
      }
      if (timelineRef?.current) {
        timelineRef.current.seek(1);
        timelineRef.current.reverse();
      }
    }
  }, [currentIndex]);

  return (
    <div className="w-full relative flex flex-col lg:flex-row items-start justify-start">
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
            {...(!isTouchDevice && {
              onMouseLeave: () => {
                return handleMouseLeave();
              },
            })}
          >
            <div
              className="relative lg:absolute left-0 sector-item-trigger w-[100%] h-[53px] rounded-[30px] border-2 border-[rgba(255,255,255,0.7)] z-10 bg-[rgba(255,255,255,0)]"
              {...(isTouchDevice
                ? {
                    onTouchStart: () => {
                      return handleMouseEnter(index, sector.title);
                    },
                  }
                : {
                    onMouseEnter: () => {
                      return handleMouseEnter(index, sector.title);
                    },
                  })}
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

            <div className="absolute top-[53px] left-0 w-full h-fit sector-item-content opacity-0  rounded-[27px] overflow-hidden z-20 pointer-events-none lg:pointer-events-auto">
              <div className="sector-item-content-inner w-full pt-2 px-2 pb-2 lg:pb-2  flex flex-col gap-0.5 lg:gap-0.5">
                {sector.entries.map((entry: any, ix: number) => {
                  return (
                    <div
                      key={index + ix}
                      className={clsx(
                        "sector-item-content-entry opacity-0 translate-y-[-5px] hover:text-light-grey hover:pl-1 transition-all duration-400 cursor-pointer "
                      )}
                    >
                      <div
                        className={"flex row justify-between items-center"}
                        onClick={(e) => {
                          e.stopPropagation();
                          showExpandedectors(
                            entry.slug,
                            entry.sector,
                            realIndex + ix
                          );
                        }}
                      >
                        <span className="text-base">{entry.title}</span>
                        <div>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 12H19"
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 5L19 12L12 19"
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
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
