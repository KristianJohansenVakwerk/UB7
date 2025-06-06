"use client";

import React from "react";
import Slider from "../../shared/Slider/Slider";
type Props = {
  data: any;
  index: number;
};
const Sector = (props: Props) => {
  const { data, index } = props;

  console.log(data.title);

  // Calculate the translation based on index
  // Calculate the translation based on index
  const getTranslation = () => {
    if (index === 0) {
      return "translateY(0) translateZ(0px)"; // First item centered
    } else if (index === 1) {
      return "translateY(-100px) scale(0.95)"; // Second item moved up
    } else if (index === 2) {
      return "translateY(-200px) scale(0.9)"; // Third item moved up more
    } else {
      return "translateY(-200px) scale(0.9)"; // Rest of the items below
    }
  };

  const getZIndex = () => {
    return 100 - index; // This will make earlier items appear on top
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ perspective: "1000px", zIndex: getZIndex() }}
    >
      <div
        className="h-[80vh] w-[calc(80vh*0.46)] bg-white  rounded-[26px] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        data-lenis-prevent
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease-out",
          transform: getTranslation(),
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
                      className="font-mono text-xs text-light-grey bg-gray-100 rounded-xl px-1 py-0.5"
                    >
                      <span className="team-member-social opacity-100">
                        {s.platform}
                      </span>
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
