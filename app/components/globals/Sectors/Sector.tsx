"use client";

import React, { useEffect, useRef } from "react";
import Slider from "../../shared/Slider/Slider";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Props = {
  data: any;
  index: number;
  currentIndex: number | null;
};
const Sector = (props: Props) => {
  const { data, index, currentIndex } = props;
  const draggableRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(draggableRef.current, {
      y: getTranslation(index, currentIndex || 0),
      scale: getScale(index, currentIndex || 0),
      duration: 0.8,
      ease: "elastic",
    });
  }, [currentIndex]);

  return (
    <div
      className="sector-draggable-container absolute inset-0  flex items-center justify-center  "
      style={{
        perspective: "1000px",
        zIndex: getZIndex(index),
        pointerEvents: currentIndex === index ? "auto" : "none",
      }}
    >
      <div
        ref={draggableRef}
        className="sector-draggable h-[80vh] w-[calc(80vh*0.46)] bg-white  rounded-[26px] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pointer-events-auto "
        data-lenis-prevent
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transformOrigin: "center center",
        }}
      >
        <div className="h-auto w-full py-2  flex flex-col gap-8">
          <div className={"font-mono text-sm px-2"}>{data.sector}</div>
          <div className={"flex flex-col gap-4"}>
            <div className={"font-sans text-md px-2"}>{data.title}</div>

            <div className={"flex flex-col gap-2 px-2"}>
              <div className={"font-sans text-sm"}>Details</div>
              <div>
                {data?.details &&
                  data.details.length > 0 &&
                  data.details.map((detail: any, index: number) => (
                    <div
                      key={index}
                      className={"flex flex-row items-start justify-between "}
                    >
                      <span className="font-sans text-sm flex-1">
                        {detail.title}
                      </span>
                      <span className={"font-mono text-sm flex-1"}>
                        {detail.value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className={"flex flex-col gap-1"}>
              <div
                className={
                  "flex flex-row items-center justify-start gap-1 px-2"
                }
              >
                {data?.socials &&
                  data.socials.length > 0 &&
                  data.socials.map((s: any, index: number) => (
                    <div
                      key={index}
                      className="clickable font-mono text-xs text-light-grey bg-gray-100 rounded-xl px-1 py-0.5"
                    >
                      <a
                        href={s.url}
                        target="_blank"
                        className="team-member-social opacity-100"
                      >
                        {s.platform}
                      </a>
                    </div>
                  ))}
              </div>

              <div className="w-full flex flex-col gap-4">
                {data?.slides && data.slides.length > 0 && (
                  <Slider
                    settings={{
                      slidesPerView: 1.5,
                      spaceBetween: 10,
                      slidesOffsetBefore: 32,
                      slidesOffsetAfter: 32,
                      freeMode: {
                        enabled: true,
                        momentum: false,
                      },
                    }}
                    type={"media"}
                    data={data.slides}
                  />
                )}

                {data?.text && (
                  <div
                    className={"font-sans text-base px-2 flex flex-col gap-2"}
                    dangerouslySetInnerHTML={{ __html: data.text }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sector;

export const getScale = (index: number, currentIndex: number) => {
  if (index === currentIndex) {
    return 1; // First item centered
  } else if (index === currentIndex + 1) {
    return 0.95; // Second item moved up
  } else if (index === currentIndex + 2) {
    return 0.9; // Third item moved up more
  } else {
    return 0.9; // Rest of the items below
  }
};

export const getTranslation = (index: number, currentIndex: number) => {
  if (index === currentIndex) {
    return "0"; // First item centered
  } else if (index === currentIndex + 1) {
    return "-3vh"; // Second item moved up
  } else if (index === currentIndex + 2) {
    return "-6vh"; // Third item moved up more
  } else {
    return "-6vh"; // Rest of the items below
  }
};

const getZIndex = (index: number) => {
  return 100 - index; // This will make earlier items appear on top
};
