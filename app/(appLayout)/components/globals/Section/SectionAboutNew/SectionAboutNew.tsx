"use client";

import { useRef } from "react";
import AboutSectionText from "./SectionAboutText";
import SectionAboutNewTeam from "./SectionAboutNewTeam";
import SectionAboutNewAnimationController from "./SectionAboutNewAnimationController";

const SectionAboutNew = (props: any) => {
  const { data, currentIndex, scrollingDown, lang } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerScrollerRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-4 justify-end items-start h-full w-full pb-[124px] lg:pb-[115px]"
    >
      <SectionAboutNewAnimationController
        container={containerRef?.current}
        scroller={containerScrollerRef?.current}
        currentIndex={currentIndex}
      >
        <div className="w-full overflow-hidden">
          <div
            id="aboutSlider"
            ref={containerScrollerRef}
            className="flex w-full px-2 lg:px-3"
          >
            <div className="w-[45%] flex-shrink-0 ">
              <div className="w-full lg:w-1/2 h-full">
                <AboutSectionText
                  lang={lang}
                  currentIndex={currentIndex}
                  scrollingDown={scrollingDown}
                  data={data}
                />
              </div>
            </div>
            <div className="flex-shrink-0 w-auto">
              <SectionAboutNewTeam
                items={data.team}
                imageContainerRef={imageContainerRef}
                imageRef={imageRef}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </SectionAboutNewAnimationController>
    </div>
  );
};

export default SectionAboutNew;
