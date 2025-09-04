"use client";

import { checkLangString, classFormatter } from "@/app/(appLayout)/utils/utils";
import CustomImage from "../../../shared/Image/Image";
import { RichText } from "../../../shared/RichText";
import { RefObject, useMemo } from "react";

export interface TeamMember {
  type: "team" | "box";
  name: string;
  description: any;
  image: any;
  links: any[];
}

const TeamMembers = ({
  items,
  imageContainerRef,
  imageRef,
  lang,
}: {
  items: (TeamMember | { type: string })[];
  imageContainerRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
  lang: string;
}) => {
  const computedItems: (TeamMember | { type: string })[] = useMemo(() => {
    return [{ type: "box" }, ...items];
  }, [items]);

  return (
    <div className={classFormatter(["flex", "w-full", "gap-3"])}>
      {computedItems.map((m, index: number) => {
        // @ts-ignore
        if (m.type === "box") {
          return (
            <div
              ref={imageContainerRef}
              key={index}
              className={classFormatter([
                "item",
                "item-box",
                // "aspect-[var(--aspect-ratio-box)]",
                // "lg:aspect-[var(--aspect-ratio-box-lg)]",
                // "h-full",
                // "lg:h-auto",
                // "w-auto",
                // "lg:min-h-none",
                // "lg:max-h-none",
                // "lg:min-w-[768px]",
                "rounded-2xl",
                "opacity-100",
                "will-change-opacity",
                "cursor-pointer",
                "w-[940px]",
                "h-auto",
              ])}
            >
              <img
                ref={imageRef}
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
        }

        if ("name" in m) {
          return (
            <div
              key={index}
              className={classFormatter([
                "item",
                "item-team-member",
                "relative",
                "bg-white",
                "rounded-2xl",
                "h-auto",
                "w-[820px]",
                "border--2",
                "border-yellow-500",
                "opacity-100",
                "will-change-opacity",
              ])}
            >
              <div
                className={classFormatter([
                  "px-2",
                  "lg:px-3",
                  "py-2",
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
                    "text-base/none",
                    "opacity-100",
                  ])}
                >
                  {m.name}
                </div>
                <div
                  className={classFormatter([
                    "flex",
                    "flex-col",
                    "lg:flex-row",
                    "items-stretch",
                    "justify-start",
                    "gap-2",
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
                      "w-1/2",
                      "max-h-[425px]",
                      "max-w-[363px]",
                    ])}
                  >
                    <CustomImage
                      asset={m.image}
                      className={classFormatter([
                        "w-full",
                        "h-full",
                        "object-cover",
                        "object-center",
                      ])}
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
                        "gap-2",
                        "h-full",
                        "justify-between",
                      ])}
                    >
                      <div
                        className={classFormatter([
                          "team-member-text",
                          "text-base",
                          "opacity-100",
                        ])}
                      >
                        <RichText
                          content={checkLangString(lang, m.description)}
                        />
                      </div>

                      <div
                        className={classFormatter([
                          "flex",
                          "flex-row",
                          "items-center",
                          "justify-between",
                          "gap-1",
                          "w-full",
                        ])}
                      >
                        {m.links.map((s: any, index: number) => (
                          <div
                            key={index}
                            className={classFormatter([
                              "flex",
                              "items-center",
                              "justify-center",
                              "font-mono",
                              "text-sm",
                              "text-light-grey",
                              "bg-gray-100",
                              "rounded-2xl",
                              "py-1",
                              "flex-1",
                            ])}
                          >
                            <span
                              className={classFormatter([
                                "team-member-social",
                                "opacity-100",
                              ])}
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
        }
      })}
    </div>
  );
};

export default TeamMembers;
