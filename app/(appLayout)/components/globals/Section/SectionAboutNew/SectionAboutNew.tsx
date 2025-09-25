"use client";

import { useCallback, useRef } from "react";
import AboutSectionText from "./SectionAboutText";
import SectionAboutNewTeam from "./SectionAboutNewTeam";
import SectionAboutNewAnimationController from "./SectionAboutNewAnimationController";
import { useStore } from "@/store/store";
import clsx from "clsx";
import gsap from "gsap";

const SectionAboutNew = (props: any) => {
  const { data, currentIndex, scrollingDown, lang, onEdgeReached } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerScrollerRef = useRef<HTMLDivElement | null>(null);
  const { aboutVideoExpanded, setAboutVideoExpanded } = useStore();

  return (
    <>
      <div
        className={clsx(
          "fixed top-2 right-2 z-[9999] w-[48px] h-[48px] rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md  flex items-center justify-center text-dark-grey cursor-pointer opacity-0 transition-all duration-300 ease",
          aboutVideoExpanded && "opacity-100"
        )}
        onClick={() => setAboutVideoExpanded(false)}
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        ref={containerRef}
        className="flex flex-col gap-4 justify-end items-start h-full w-full pb-[80px] md:pb-[85px] 2xl:pb-[115px]  translate-y-[460px] md:translate-y-0  "
      >
        <SectionAboutNewAnimationController
          container={containerRef?.current}
          scroller={containerScrollerRef?.current}
          currentIndex={currentIndex}
          onEdgeReached={onEdgeReached}
        >
          <div className="w-full">
            <div
              id="aboutSlider"
              ref={containerScrollerRef}
              className="flex flex-col md:flex-row w-full px-1 md:px-2 lg:px-3 gap-3 md:gap-0 "
            >
              <div className="w-full md:w-[55%] lg:w-[45%] flex-shrink-0">
                <div
                  id="aboutText"
                  className="w-full md:w-3/4 lg:w-3/4 4xl:w-2/4 h-full block "
                >
                  <AboutSectionText
                    lang={lang}
                    currentIndex={currentIndex}
                    scrollingDown={scrollingDown}
                    data={data}
                  />
                </div>
              </div>
              <div className="flex-shrink-0 w-auto flex flex-row gap-2 md:gap-3">
                <SectionAboutNewTeam
                  items={data.team}
                  trailerVideo={data.trailerVideo}
                  fullVideo={data.fullVideo}
                  lang={lang}
                  currentIndex={currentIndex}
                  scrollingDown={scrollingDown}
                />
              </div>
            </div>
          </div>
        </SectionAboutNewAnimationController>
      </div>
    </>
  );
};

export default SectionAboutNew;
