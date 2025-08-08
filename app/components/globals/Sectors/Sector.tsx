"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Slider from "../../shared/Slider/Slider";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import InertiaPlugin from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useGSAP } from "@gsap/react";
gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger);

type Props = {
  data: any;
  index: number;
  currentIndex: number | null;
  active: boolean;
  onDragged: (index: number) => void;
};
const Sector = (props: Props) => {
  const { data, index, currentIndex, active, onDragged } = props;
  const draggableRef = useRef<HTMLDivElement>(null);

  // Add utility function to check if element is out of bounds
  const isElementOutOfBounds = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const margin = 300; // 150px margin on each side

    // Check if element is out of bounds
    return (
      rect.right < margin || // Element is completely to the left
      rect.left > windowWidth - margin // Element is completely to the right
    );
  };

  useGSAP(() => {
    if (currentIndex === null) {
      gsap.set(draggableRef.current, {
        id: `sector-card-reset-${index}`,
        y: "-100vh",
        x: 0,
        scale: 0.9,
        autoAlpha: 1,
        rotation: 0,
      });
    } else {
      if (index < currentIndex) {
        return;
      }

      gsap.to(draggableRef.current, {
        id: `sector-card-${index}`,
        y: getTranslation(index, currentIndex || 0),
        scale: getScale(index, currentIndex || 0),
        autoAlpha: 1,
        rotation: 0,
        duration: 0.4,
        delay: (index - currentIndex) * 0.1,
        ease: "power2.inOut",
      });
    }
  }, [currentIndex]);

  const dragDirRef = useRef<number>(1);

  useGSAP(() => {
    if (typeof window !== "undefined") {
      Draggable.create(draggableRef.current, {
        ...draggableConfig,
        onDrag: (self) => {
          const el = draggableRef.current;

          if (el) {
            const vx = InertiaPlugin.getVelocity(el, "x");

            const directionX = vx > 0 ? 1 : vx < 0 ? -1 : 1;

            dragDirRef.current = directionX;

            gsap.to(el, {
              rotation: vx * 0.01,
              duration: 0.5,
              ease: "power2.out",
            });
          }
        },
        onRelease: () => {
          if (ScrollTrigger.isTouch) {
            const el = draggableRef.current;

            if (!el) return;

            const isOutOfBounds = isElementOutOfBounds(el);

            if (isOutOfBounds) {
              gsap.to(el, {
                x: function () {
                  const currentX = gsap.getProperty(el, "x") as number;
                  return (
                    currentX +
                    (dragDirRef.current === 1
                      ? window.innerWidth - currentX
                      : -window.innerWidth + currentX)
                  );
                },
                duration: 0.8,
                delay: 0.2,
                ease: "expo.out",
              });

              onDragged(index);
            }
          }
        },
        onDragEnd: () => {
          const el = draggableRef.current;

          if (!el) return;

          if (ScrollTrigger.isTouch) {
            return;
          }

          gsap.to(el, {
            x: function () {
              const currentX = gsap.getProperty(el, "x") as number;

              return (
                currentX +
                (dragDirRef.current === 1
                  ? window.innerWidth
                  : -window.innerWidth)
              );
            },
            duration: 1.2,
            delay: 0.4,
            ease: "expo.out",
            onComplete: () => {},
          });
          gsap.delayedCall(0.4, () => {
            onDragged(index);
          });
        },
      });
    }
  }, []);

  const shouldBeDraggable = useMemo(() => {
    if (currentIndex === null) return false;
    // Current sector is always draggable
    if (index === currentIndex) return true;
    // Previous sector should be draggable when user wants to go back
    if (index === currentIndex - 1) return true;
    return false;
  }, [currentIndex, index]);

  return (
    // <div
    //   className="sector-draggable-container absolute inset-0  flex items-start lg:items-center justify-center pt-2 lg:pt-0"
    //   style={{
    //     perspective: "1000px",
    //     zIndex: getZIndex(index),
    //     pointerEvents: shouldBeDraggable ? "auto" : "none",
    //   }}
    // >
    <div
      ref={draggableRef}
      className="sector-draggable absolute top-1/2  left-1/2  h-[74vh] w-[calc(80vh*0.55)] lg:w-[calc(80vh*0.46)] bg-white  rounded-[26px] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        transformOrigin: "center center",
        zIndex: getZIndex(index),
        pointerEvents: shouldBeDraggable ? "auto" : "none",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="h-auto w-full py-2  flex flex-col gap-4 lg:gap-8">
        <div className={"font-mono text-sm px-2 lg:px-3"}>
          Category: {data.sector}
        </div>
        <div className={"flex flex-col gap-4 lg:gap-8"}>
          <div className={"font-sans text-md px-2"}>{data.title}</div>

          <div className={"flex flex-col gap-3 px-2 lg:px-3"}>
            <div className={"font-sans text-base"}>Details</div>
            <div className={"flex flex-col gap-[0.2rem]"}>
              {data?.details &&
                data.details.length > 0 &&
                data.details.map((detail: any, index: number) => (
                  <div
                    key={index}
                    className={"flex flex-row items-start justify-between"}
                  >
                    <span className="font-sans text-base flex-1">
                      {detail.title}
                    </span>
                    <span className={"font-mono text-base flex-1"}>
                      {detail.value}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div>
          <div className={"flex flex-col gap-1 lg:gap-2"}>
            <div
              className={
                "flex flex-row items-center justify-start gap-1 px-2 lg:px-3"
              }
            >
              {data?.socials &&
                data.socials.length > 0 &&
                data.socials.map((s: any, index: number) => (
                  <div
                    key={index}
                    className="clickable font-mono text-xs/none text-light-grey bg-button-grey rounded-2xl px-1 py-1 flex items-center justify-center"
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
                  className={"px-2 lg:px-3 flex flex-col gap-2"}
                  dangerouslySetInnerHTML={{ __html: data.text }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Sector;

/// Draggable config
export const draggableConfig = {
  type: "x" as const,
  edgeResistance: 0.65,
  inertia: true,
  allowNativeTouchScrolling: true,
  cursor: "grab",
  activeCursor: "grabbing",
  dragClickables: false,
  minimumMovement: ScrollTrigger.isTouch ? 30 : 0,
  lockAxis: ScrollTrigger.isTouch ? true : false,
  clickableTest: (el: Element) => {
    if (el instanceof HTMLImageElement) {
      return true;
    }
    return false;
  },
};

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
