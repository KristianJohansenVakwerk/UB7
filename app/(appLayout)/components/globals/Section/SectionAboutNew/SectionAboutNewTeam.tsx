"use client";

import {
  checkLangString,
  classFormatter,
  classFormatterClsx,
} from "@/app/(appLayout)/utils/utils";
import CustomImage from "../../../shared/Image/Image";
import { RichText } from "../../../shared/RichText";
import { RefObject, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import SplitTextComp from "../../SplitTextComp/SplitTextComp";
import SplitRichTextComp from "../../SplitRichTextComp/SplitRichTextComp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useStore } from "@/store/store";

export interface TeamMember {
  type: "team" | "box";
  name: string;
  description: any;
  image: any;
  links: any[];
}

const TeamMembers = ({
  items,
  lang,
  currentIndex,
  scrollingDown,
}: {
  items: (TeamMember | { type: string })[];
  lang: string;
  currentIndex: number;
  scrollingDown: boolean;
}) => {
  const computedItems: (TeamMember | { type: string })[] = useMemo(() => {
    return [{ type: "box" }, ...items];
  }, [items]);

  useGSAP(() => {
    if (currentIndex === 2) {
      gsap.delayedCall(3, () => {
        gsap.to(".item", {
          opacity: 1,
          duration: 0.5,
          stagger: 0.3,
          ease: "expo.inOut",
        });
      });
    } else if (!scrollingDown && currentIndex <= 2) {
      gsap.to(".item", {
        opacity: 0,
        duration: 0.5,
        stagger: -0.3,
        ease: "expo.inOut",
      });
    }
  }, [currentIndex, scrollingDown]);

  return (
    <
      // className={classFormatter([
      //   "flex",
      //   "flex-row",
      //   "w-full",
      //   "gap-2",
      //   "lg:gap-3",
      // ])}
    >
      {computedItems.map((m, index: number) => {
        // @ts-ignore
        return (
          <TeamMemberItem key={index} item={m} lang={lang} index={index} />
        );
      })}
    </>
  );
};

export default TeamMembers;

const TeamMemberItem = (props: {
  item: TeamMember | { type: string };
  lang: string;
  index: number;
}) => {
  const { item, lang, index } = props;

  const { setAboutVideoExpanded } = useStore();

  const { ref, inView } = useInView({
    threshold: 0.8,
    triggerOnce: true,
  });

  switch (item.type) {
    case "box":
      return (
        <div
          id="videoBox"
          ref={ref}
          className={classFormatter([
            "item",
            "item-box",
            "rounded-2xl",
            "opacity-0",
            "will-change-opacity",
            "cursor-pointer",
            "w-[280px]",
            "md:w-[750px]",
            "lg:w-[940px]",
            "h-auto",
            "md:h-auto",
            "flex-shrink-0",
            "max-md:aspect-[340/640]",
          ])}
          onClick={() => setAboutVideoExpanded(true)}
        >
          <img
            src="/Reel.jpg"
            width={"693"}
            height={"376"}
            className={classFormatter([
              "w-full",
              "h-full",
              "object-cover",
              "object-center",
              "rounded-2xl",
            ])}
          />
        </div>
      );
      break;

    default:
      if (!("name" in item)) return null;

      return (
        <div
          ref={ref}
          className={classFormatter([
            "item",
            "item-team-member",
            "relative",
            "bg-white",
            "rounded-2xl",
            "w-[310px]",
            "md:w-[750px]",
            "lg:w-[820px]",
            "opacity-0",
            "will-change-opacity",
            "h-auto",
            "md:h-auto",
            "flex-shrink-0",
          ])}
        >
          <div
            className={classFormatter([
              "px-1",
              "md:px-2",
              "lg:px-3",
              "py-1",
              "md:py-2",
              "lg:py-3",
              "flex",
              "flex-col",
              "gap-1",
              "h-full",
            ])}
          >
            <div
              className={classFormatter([
                "team-member-name",
                "text-light-grey",
                "text-sm/none",
                "md:text-base/none",
                "opacity-100",
              ])}
            >
              <SplitTextComp text={item.name} active={inView} />
            </div>
            <div
              className={classFormatter([
                "flex",
                "flex-col",
                "md:flex-row",
                "items-stretch",
                "justify-start",
                "gap-1",
                "lg:gap-2",
                "h-full",
              ])}
            >
              <div
                className={classFormatter([
                  "team-member-image",
                  "aspect-[266/312]",
                  "h-full",
                  "opacity-100",
                  "flex",
                  "items-center",
                  "justify-center",
                  "flex-1",
                  "w-4/4",
                  "md:w-1/2",
                  "max-h-[425px]",
                  "max-w-[363px]",
                  "bg-button-grey",
                  "rounded-[10px]",
                  "m-auto",
                ])}
              >
                <CustomImage
                  asset={item.image}
                  className={classFormatterClsx(
                    [
                      "w-full",
                      "h-full",
                      "object-cover",
                      "object-center",
                      "rounded-[10px]",
                      "transition-opacity",
                      "duration-300",

                      "delay-300",
                      "ease-in-out",
                    ],
                    [inView ? "opacity-100" : "opacity-0"]
                  )}
                />
              </div>
              <div
                className={classFormatter([
                  "text-light-grey",
                  "flex-2",
                  "lg:mr-3",
                  "h-full",
                ])}
              >
                <div
                  className={classFormatter([
                    "flex",
                    "flex-col",
                    "gap-1",
                    "lg:gap-2",
                    "h-full",
                    "justify-between",
                  ])}
                >
                  <div
                    className={classFormatter([
                      "team-member-text",
                      "text-sm",
                      "md:text-base",
                      "opacity-100",
                    ])}
                  >
                    <SplitRichTextComp
                      lang={lang}
                      text={item.description}
                      active={inView}
                    />
                  </div>

                  <div
                    className={classFormatter([
                      "flex",
                      "flex-row",
                      "items-center",
                      "justify-start",
                      "gap-1",
                      "w-full",
                    ])}
                  >
                    {item.links.map((s: any, index: number) => (
                      <div
                        key={index}
                        className={classFormatterClsx([
                          "flex",
                          "items-center",
                          "justify-center",
                          "font-mono",
                          "text-xs",
                          "md:text-sm",

                          "text-light-grey",
                          "bg-button-grey",
                          "rounded-[100px]",
                          "py-1",
                          "px-1",
                          "lg:px-2",
                          "flex-shrink-0",
                          "hover:bg-button-grey-hover",
                          "hover:text-white",
                          "transition-all",
                          "duration-300",
                          "ease-in-out",
                        ])}
                      >
                        <span
                          className={classFormatterClsx(
                            [
                              "team-member-social",
                              "transition-opacity",
                              "duration-300",
                              "ease-in-out",
                            ],
                            [inView ? "opacity-100" : "opacity-0"]
                          )}
                          style={{
                            transitionDelay: `${index * 0.3}s`,
                          }}
                        >
                          <a href={s.link} target="_blank">
                            {checkLangString(lang, s.title)}
                          </a>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      break;
  }
};
