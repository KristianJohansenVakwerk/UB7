"use client";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Slider from "../../shared/Slider/Slider";
import { useAccordionControls } from "@/app/(appLayout)/hooks/AccordionHooks";

import { useSectorListAnimation } from "@/app/(appLayout)/hooks/AnimationsHooks";
import { useStore } from "@/store/store";
import { RichText } from "../../shared/RichText";
import { checkLangString } from "@/app/(appLayout)/utils/utils";
import CustomImage from "../../shared/Image/Image";
gsap.registerPlugin(ScrollTrigger);

type Props = {
  data: any;
  entriesFrom: number;
  active: boolean;
  updateBackground: (sector: string) => void;
  onClose: () => void;
  lang: string;
};
const DraggableObserver = (props: Props) => {
  const { data, entriesFrom, active, updateBackground, onClose, lang } = props;

  const { setDisableScroll } = useStore();

  const containerRef = useRef<HTMLDivElement>(null);

  const { resetAccordionMobile } = useAccordionControls();

  // Set state for initial setup to hide the UI
  const [ready, setReady] = useState(false);

  // Flatten the data to have a single array of entries
  const [entries, setEntries] = useState<any[]>(
    data.flatMap((sector: any, sectorIndex: number) =>
      sector.entries.map((entry: any) => ({
        ...entry,
        sectorIndex,
        media: sector.media,
      }))
    )
  );

  useEffect(() => {
    currentIndex.current = entriesFrom;
    setCurrentStateIndex(entriesFrom);
  }, [entriesFrom]);

  // State for the current index of the entry to update react stuff
  const [currentStateIndex, setCurrentStateIndex] = useState(entriesFrom);

  // Ref for the bounds of the observer
  const boundsRef = useRef<HTMLDivElement>(null);

  // Refs for the observer
  const observer = useRef<any>(null);
  const currentIndex = useRef(entriesFrom);
  const boxesPos = useRef<any>([]);
  const lastTime = useRef(0);
  const direction = useRef<1 | -1>(1);
  const isDragging = useRef(false);
  const dragStartPos = useRef(0);

  // Refs to handle boxes
  const activeBoxes = useRef<HTMLElement[]>([]);
  const inActiveBoxes = useRef<HTMLElement[]>([]);

  // GSAP for the initial setup
  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set(containerRef.current, {
      autoAlpha: 0,
    });

    if (active) {
      gsap.to(containerRef.current, {
        autoAlpha: 1,
        duration: 0.4,
        delay: 0.8,
        ease: "expo.inOut",
      });
      const boxes = gsap.utils.toArray(".box");

      if (!ScrollTrigger.isTouch) {
        // Set initial positioning for all boxes
        gsap.set(boxes, {
          xPercent: -50,
          yPercent: -50,
        });
      }

      // Active boxes are the ones that are visible
      const activeBoxesArray = boxes.slice(entriesFrom);
      activeBoxes.current = activeBoxesArray as HTMLElement[];

      // Inactive boxes are the ones that are not visible
      const inActiveBoxesArray = boxes.slice(0, entriesFrom);
      inActiveBoxes.current = inActiveBoxesArray as HTMLElement[];

      if (inActiveBoxesArray.length > 0) {
        // Set the inactive boxes to the right of the screen
        gsap.set(inActiveBoxesArray, {
          x:
            window.innerWidth / 2 +
            (inActiveBoxesArray[0] as HTMLElement).clientWidth,
          y: 0,
          scale: 1,
          rotation: 0,
        });
        // Figure out how to set the init box pos of the in-active boxes to window.innerWidth / 2 +
        // (inActiveBoxesArray[0] as HTMLElement).clientWidth,

        boxes.forEach((box, index) => {
          const inactiveIndex = inActiveBoxesArray.indexOf(box);

          if (inactiveIndex !== -1) {
            boxesPos.current[index] = {
              x:
                window.innerWidth / 2 +
                (inActiveBoxesArray[0] as HTMLElement).clientWidth,
            };
          } else {
            boxesPos.current[index] = { x: 0 };
          }
        });
      }

      // Set the active boxes to the top of the screen
      gsap.set(activeBoxesArray, { y: -window.innerHeight });

      // Delay the initial setup to allow the boxes to be set
      gsap.delayedCall(1, () => {
        setReady(true);
        (activeBoxesArray as HTMLElement[]).forEach(
          (box: HTMLElement, index: number) => {
            gsap.to(box, {
              y: getTranslation(index + entriesFrom, entriesFrom),
              scale: getScale(index + entriesFrom, entriesFrom),
              duration: 0.55,
              delay: index * 0.05,
              ease: "expo.inOut",
            });
          }
        );
      });
    }
  }, [active, entriesFrom]);

  // Function to update the background image based on the index
  const updateBackgroundOnRelease = useCallback(
    (index: number) => {
      updateBackground(entries[index].sector);
    },
    [entries, updateBackground]
  );

  useGSAP(() => {
    const boxes = gsap.utils.toArray(".box");

    boxes.forEach((_, index) => {
      boxesPos.current[index] = { x: 0 };
    });

    if (boundsRef.current) {
      const getCurrentBox = () => boxes[currentIndex.current] as HTMLElement;

      const getPreviousBox = () => {
        const prevIndex =
          currentIndex.current === 0 ? 0 : currentIndex.current - 1;
        return boxes[prevIndex] as HTMLElement;
      };

      const getPreviousBoxPos = () => {
        const prevIndex =
          currentIndex.current === 0 ? 0 : currentIndex.current - 1;
        return boxesPos.current[prevIndex];
      };

      const getCurrentBoxPos = () => boxesPos.current[currentIndex.current];

      const setDirection = (deltaX: number) => {
        if (deltaX > 0) {
          direction.current = 1;
        } else {
          direction.current = -1;
        }
      };

      const updateCurrentIndex = (direction: number) => {
        const next = currentIndex.current + direction;

        if (next >= 0 && next < boxes.length) {
          currentIndex.current = next;
        } else if (next < 0) {
          currentIndex.current = 0;
        } else {
          currentIndex.current = boxes.length - 1;
        }

        setCurrentStateIndex(currentIndex.current);
      };

      // Set cursor
      const setCursor = (cursor: string) => {
        const box = getCurrentBox();
        if (box) {
          box.style.cursor = cursor;
        }
      };

      const setPositions = (
        boxPos: number,
        currentBoxIndex: number,
        isForward: boolean
      ) => {
        (boxes as HTMLElement[]).forEach((box: HTMLElement, index: number) => {
          const boxDataIndex = parseFloat(box.dataset.index as string);
          const distanceFromCurrent = boxDataIndex - currentBoxIndex;

          // Only animate boxes that are within the visible range
          if (distanceFromCurrent < 0 || distanceFromCurrent > 2) {
            return; // Skip boxes that are too far away
          }

          // Skip the current box from positions updates
          if (boxDataIndex === currentBoxIndex) {
            return;
          }

          gsap.killTweensOf(box);

          // Calculate drag progress based on direction and position
          let dragProgress = 0;

          if (isForward) {
            // Forward movement: positive progress for positive positions

            dragProgress = Math.max(0, Math.min(boxPos / 100, 1));
          } else {
            // Backward movement: need to calculate relative to starting position
            const currentPos = gsap.getProperty(box, "x") as number;
            const dragDistance = Math.abs(currentPos - dragStartPos.current);

            dragProgress = Math.max(0, Math.min(dragDistance / 100, 1));
          }

          const threshold = 0.8; // Adjust this value as needed
          if (dragProgress > threshold) {
            dragProgress = 1;
          }

          // Get base positions
          const baseY = getTranslationNum(boxDataIndex, currentBoxIndex);
          const baseScale = getScaleNum(boxDataIndex, currentBoxIndex);

          let finalY = baseY;
          let finalScale = baseScale;

          // Moving forward - boxes cascade up and scale UP
          switch (distanceFromCurrent) {
            case 0:
              // Current box stays at center

              const targetY0 = isForward ? 0 : -3;
              const targetScale0 = isForward ? 1 : 0.95;

              finalY = gsap.utils.interpolate(baseY, targetY0, dragProgress);

              finalScale = gsap.utils.interpolate(
                baseScale,
                targetScale0,
                dragProgress
              );
              break;
            case 1:
              // Next box: interpolate between -3vh (base) and 0vh (forward) or -6vh (backward)
              const targetY1 = isForward ? 0 : -3;
              const targetScale1 = isForward ? 1 : 0.95;
              finalY = gsap.utils.interpolate(baseY, targetY1, dragProgress);
              finalScale = gsap.utils.interpolate(
                baseScale,
                targetScale1,
                dragProgress
              );
              break;
            case 2:
              // Next box: interpolate between -3vh (base) and 0vh (forward) or -6vh (backward)
              const targetY2 = isForward ? -3 : -6;
              const targetScale2 = isForward ? 0.95 : 0.9;
              finalY = gsap.utils.interpolate(baseY, targetY2, dragProgress);
              finalScale = gsap.utils.interpolate(
                baseScale,
                targetScale2,
                dragProgress
              );
              break;
            default:
              // Other boxes stay as they are
              finalY = baseY;
              finalScale = baseScale;
              break;
          }

          gsap.to(box, {
            y: `${finalY}vh`,
            x: 0,
            scale: finalScale,
            ease: "power1.out",
          });
        });
      };

      // Function to calc when update and animate the current box out on release both directions
      const shouldUpdateOnRelease = (boxPos: number) => {
        const threshold = ScrollTrigger.isTouch ? 100 : 200;
        let currentPos = 0;

        if (direction.current === 1) {
          currentPos = gsap.getProperty(getCurrentBox(), "x") as number;
          return boxPos > threshold;
        }

        if (direction.current === -1) {
          currentPos = gsap.getProperty(getPreviousBox(), "x") as number;

          return true;
        }

        return false;
      };

      // Animations
      const xTo = (activeBox: HTMLElement, value: number) => {
        return gsap.quickTo(activeBox, "x", {
          ease: "power1.out",
          duration: ScrollTrigger.isTouch ? 0.05 : 0.05,
        })(value);
      };

      const rTo = (activeBox: HTMLElement, value: number) => {
        return gsap.quickTo(activeBox, "rotation", {
          ease: "power1.out",
          duration: ScrollTrigger.isTouch ? 0.05 : 0.3,
        })(value);
      };

      observer.current = ScrollTrigger.observe({
        target: boundsRef.current,
        type: "touch, pointer",
        preventDefault: false,
        dragMinimum: ScrollTrigger.isTouch ? 40 : 0,
        tolerance: ScrollTrigger.isTouch ? 10 : 0,
        ignore: ".disable-drag",
        onDrag: (self: any) => {
          // Only handle horizontal drags, ignore vertical ones
          if (Math.abs(self.deltaX) < Math.abs(self.deltaY)) {
            return; // Allow vertical scrolling to pass through
          }

          if (ScrollTrigger.isTouch && Math.abs(self.deltaX) < 10) {
            return;
          }

          if (!isDragging.current) {
            isDragging.current = true;

            // Set direction
            setDirection(self.deltaX);
          }

          const now = Date.now();
          const deltaTime = now - lastTime.current;

          console.log(boxesPos.current);

          // Ensure 60fps for desktop (16.67ms per frame)
          if (!ScrollTrigger.isTouch && deltaTime < 16.67) {
            return;
          }

          const activeBox =
            direction.current === 1 ? getCurrentBox() : getPreviousBox();
          const activeBoxPos =
            direction.current === 1 ? getCurrentBoxPos() : getPreviousBoxPos();

          // Kill tween
          gsap.killTweensOf(activeBox);

          // Calculate velocity with deltaTime for smooth animation
          const v = ScrollTrigger.isTouch
            ? (self.deltaX * 2 * 16.67) / Math.max(deltaTime, 1)
            : (self.deltaX * 2 * 16.67) / Math.max(deltaTime, 1);
          const r = v * 0.07;

          // Update current position
          activeBoxPos.x = activeBoxPos.x + v;

          // Update position and rotation
          xTo(activeBox, activeBoxPos.x);
          rTo(activeBox, r);

          setPositions(
            activeBoxPos.x,
            parseFloat(activeBox.dataset.index as string),
            direction.current === 1 ? true : false
          );

          lastTime.current = now;
        },
        onPress: (self: any) => {
          setCursor("grabbing");
        },
        onRelease: (self: any) => {
          if (!isDragging.current) {
            return;
          }

          isDragging.current = false;

          const activeBox =
            direction.current === 1 ? getCurrentBox() : getPreviousBox();
          const activeBoxPos =
            direction.current === 1 ? getCurrentBoxPos() : getPreviousBoxPos();

          setCursor("grab");

          // Kill any existing tweens to prevent conflicts
          gsap.killTweensOf(activeBox);

          // if last box disable animation out
          if (
            currentIndex.current === boxes.length - 1 &&
            direction.current === 1
          ) {
            gsap.to(activeBox, {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 1.2,
              ease: "expo.inOut",
              onComplete: () => {
                activeBoxPos.x = 0;
                gsap.killTweensOf(activeBox);
              },
            });

            return;
          }

          if (shouldUpdateOnRelease(activeBoxPos.x)) {
            gsap.to(activeBox, {
              x:
                direction.current === 1
                  ? window.innerWidth / 2 + activeBox.clientWidth
                  : 0,
              rotation: 0,
              scale: 1,
              duration: 0.8,
              ease: "expo.out",
              onComplete: () => {
                if (direction.current === 1) {
                  gsap.delayedCall(0.2, () => {
                    activeBox.scrollTo({ top: 0 });
                  });
                }

                direction.current === -1 && gsap.set(activeBox, { x: 0 });

                activeBoxPos.x =
                  direction.current === 1
                    ? window.innerWidth / 2 + activeBox.clientWidth
                    : 0;
                updateBackgroundOnRelease(currentIndex.current);
                // gsap.killTweensOf(activeBox);
              },
            });

            updateCurrentIndex(direction.current);
          } else {
            setPositions(
              0,
              parseFloat(activeBox.dataset.index as string),
              false
            );

            gsap.to(activeBox, {
              x: 0,
              rotation: 0,
              duration: 0.5,
              ease: "power2.out",
              onComplete: () => {
                gsap.killTweensOf(activeBox);
              },
            });
          }
        },
      });
    }
  }, []);

  // Enable/disable observer
  useEffect(() => {
    if (active) {
      observer.current.enable();
    } else {
      observer.current.disable();
    }
  }, [active]);

  const { timelineRef } = useSectorListAnimation(0);

  /// Reset boxes on close
  const resetBoxes = () => {
    gsap.set(inActiveBoxes.current, {
      y: -window.innerHeight,
      x: 0,
      scale: 1,
      rotation: 0,
    });

    gsap.set(activeBoxes.current, {
      y: -window.innerHeight,
      x: 0,
      scale: 1,
      rotation: 0,
    });

    gsap.delayedCall(0.3, () => {
      activeBoxes.current = [];
      inActiveBoxes.current = [];
    });
  };

  const handleClose = useCallback(() => {
    // reset for mobile
    resetAccordionMobile();
    gsap.to(containerRef.current, {
      autoAlpha: 0,
      duration: 0.4,
      ease: "expo.inOut",
      onComplete: () => {
        resetBoxes();
        setDisableScroll(false);

        if (timelineRef?.current) {
          timelineRef.current.seek(0);
          timelineRef.current.play(0);

          setCurrentStateIndex(0);
          currentIndex.current = 0;
          onClose();
        }
      },
    });
  }, []);

  const updatePositionsClick = useCallback(
    (currentIndex: number, isForward: boolean, drag: boolean = false) => {
      const boxes = gsap.utils.toArray(".box");

      (boxes as HTMLElement[]).forEach((box: HTMLElement, index: number) => {
        const boxDataIndex = parseInt(box.dataset.index as string);

        const distanceFromCurrent = boxDataIndex - currentIndex;

        // Only animate boxes that are within the visible range
        if (distanceFromCurrent < 0 || distanceFromCurrent > 2) {
          return; // Skip boxes that are too far away
        }

        // Skip the current box from positions updates
        if (boxDataIndex === currentIndex) {
          return;
        }

        gsap.killTweensOf(box);

        const baseY = getTranslationNum(boxDataIndex, currentIndex);
        const baseScale = getScaleNum(boxDataIndex, currentIndex);

        let finalY = 0;
        let finalScale = 1;

        switch (distanceFromCurrent) {
          case 0:
            const targetY0 = isForward ? 0 : -3;
            const targetScale0 = isForward ? 1 : 0.95;

            finalY = targetY0;
            finalScale = targetScale0;

            break;
          case 1:
            // Next box: interpolate between -3vh (base) and 0vh (forward) or -6vh (backward)
            const targetY1 = isForward ? 0 : -3;
            const targetScale1 = isForward ? 1 : 0.95;

            finalY = targetY1;
            finalScale = targetScale1;

            break;
          case 2:
            // Next box: interpolate between -3vh (base) and 0vh (forward) or -6vh (backward)
            const targetY2 = isForward ? -3 : -6;
            const targetScale2 = isForward ? 0.95 : 0.9;

            finalY = targetY2;
            finalScale = targetScale2;

            break;
          default:
            // Other boxes stay as they are
            finalY = baseY;
            finalScale = baseScale;
            break;
        }

        gsap.to(box, {
          x: 0,
          y: `${finalY}vh`,
          rotation: 0,
          scale: finalScale,
          duration: 0.5,
          ease: "power2.out",
        });
      });
    },
    []
  );

  const handleNext = useCallback(() => {
    const boxes = gsap.utils.toArray(".box");
    if (currentIndex.current === boxes.length - 1) return;

    const activeBox = boxes[currentIndex.current] as HTMLElement;
    const activeBoxWidth = activeBox.clientWidth;
    // const activeBoxPos = gsap.getProperty(activeBox, "x") as number;
    // console.log(activeBoxPos);

    updatePositionsClick(currentIndex.current, true);

    currentIndex.current += 1;
    setCurrentStateIndex((prev) => prev + 1);

    gsap.to(activeBox, {
      x: window.innerWidth / 2 + activeBoxWidth,
      y: Math.random() * 100 - 50,
      rotation: Math.random() * 10,
      duration: 2.2,
      ease: "expo.out",
      onComplete: () => {
        gsap.killTweensOf(activeBox);
        // setPositions(0, currentIndex.current, true);
        updateBackgroundOnRelease(currentIndex.current);
      },
    });
  }, []);

  const handlePrev = useCallback(() => {
    const boxes = gsap.utils.toArray(".box");
    if (currentIndex.current === 0) {
      return;
    }

    currentIndex.current -= 1;

    setCurrentStateIndex((prev) => prev - 1);
    updatePositionsClick(currentIndex.current, false);

    const activeBox = boxes[currentIndex.current] as HTMLElement;

    gsap.to(activeBox, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 1.2,
      ease: "expo.out",
      onComplete: () => {
        gsap.killTweensOf(activeBox);
        updateBackgroundOnRelease(currentIndex.current);
      },
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[100svh] w-full overflow-hidden"
    >
      <CloseButton onClick={handleClose} />
      <PrevButton onClick={handlePrev} currentIndex={currentStateIndex} />
      <NextButton
        onClick={handleNext}
        currentIndex={currentStateIndex}
        entriesLength={entries.length}
      />
      <div
        ref={boundsRef}
        className="bounds absolute top-0 left-0 h-full w-screen flex items-center justify-center user-select-none"
        style={{
          touchAction: "pan-x pan-y",
          overscrollBehavior: "none",
          visibility: ready ? "visible" : "hidden",
        }}
      >
        {entries.map((entry, index) => (
          <Entry
            key={index}
            data={entry}
            index={index}
            currentIndex={currentStateIndex}
            lang={lang}
          />
          // <div key={index}>{JSON.stringify(entry.sector)}</div>
        ))}
      </div>
    </div>
  );
};

const CloseButton = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className=" absolute bottom-1 lg:bottom-auto lg:top-2 translate-x-1/2 lg:translate-x-0 right-1/2 lg:right-3 z-9999 w-[48px] h-[48px] rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md flex items-center justify-center text-dark-grey cursor-pointer"
      onClick={onClick}
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
  );
};

const PrevButton = (props: any) => {
  const { onClick, currentIndex } = props;

  const isDisabled = currentIndex === 0;

  return (
    <div
      className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-3 z-9999 w-[48px] h-[48px]  cursor-pointer w-[48px] h-[48px] rounded-full  bg-[rgba(255,255,255,0.6)] backdrop-blur-md  items-center justify-center text-dark-grey cursor-pointer transition-opacity duration-300"
      onClick={onClick}
      style={{
        pointerEvents: isDisabled ? "none" : "auto",
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      <svg
        width="25"
        height="25"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.5 5L7.5 10L12.5 15"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const NextButton = (props: any) => {
  const { onClick, currentIndex, entriesLength } = props;

  const isDisabled = currentIndex === entriesLength - 1;

  return (
    <div
      className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-2 z-[9999] cursor-pointer w-[48px] h-[48px] rounded-full  bg-[rgba(255,255,255,0.6)] backdrop-blur-md  items-center justify-center text-dark-grey cursor-pointer transition-opacity duration-300"
      onClick={onClick}
      style={{
        pointerEvents: isDisabled ? "none" : "auto",
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      <svg
        width="25"
        height="25"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.5 5L12.5 10L7.5 15"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const Entry = (props: any) => {
  const { data, index, currentIndex, lang } = props;
  return (
    <div
      className="box absolute top-1 md:top-1/2 lg:top-1/2  left-[20px] md:left-1/2 lg:left-1/2  h-[78vh] sm:h-[92vh] md:h-[92vh] lg:mx-0 w-[calc(100vw-40px)] sm:w-[calc(92vh*(820/1180))] smd:w-[calc(92vh*(1030/978))] smd-max:w-[calc(92vh*1.46)] bg-white sm:bg-red-500 md:bg-blue-500 rounded-[26px] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-manipulation user-select-none"
      style={{
        zIndex: 1000 - index,
        touchAction: "pan-x pan-y",
        pointerEvents: index === currentIndex ? "auto" : "none",
        // transform: "translate(-50%, -50%)", // Apply the transform via inline style instead of Tailwind
      }}
      data-index={index}
    >
      <div className="h-auto w-full py-2 px-2 flex flex-col gap-4 lg:gap-8">
        <div className={"font-mono text-sm"}>
          {lang === "en" ? "Category" : "Categoria"}:{" "}
          {checkLangString(lang, data.sector)}
        </div>
        <div className={"flex flex-col gap-4 lg:gap-8"}>
          <div className={"font-sans text-md"}>
            {checkLangString(lang, data.title)}
          </div>

          <div className="flex flex-row gap-0">
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              <div className={"grid grid-cols-[max-content_auto] gap-[0.5rem]"}>
                {data?.details &&
                  data.details.length > 0 &&
                  data.details.map((detail: any, index: number) => (
                    <div key={index} className={"contents"}>
                      <span className="font-sans text-base grid-col-span-1">
                        {checkLangString(lang, detail.title)}
                      </span>
                      <span className={"font-mono text-base grid-col-span-2"}>
                        {checkLangString(lang, detail.value)}
                      </span>
                    </div>
                  ))}
              </div>

              <div className={"flex flex-col gap-1 lg:gap-2"}>
                <div
                  className={"flex flex-row items-center justify-start gap-1"}
                >
                  {data?.socials &&
                    data.socials.length > 0 &&
                    data.socials.map((s: any, index: number) => (
                      <div
                        key={index}
                        className="clickable text-light-grey hover:text-white bg-button-grey hover:bg-button-grey-hover  rounded-2xl px-1 smd-max:px-2 py-1 flex items-center justify-center transition all duration-300 ease-in-out"
                      >
                        <a
                          href={s.url}
                          target="_blank"
                          className="team-member-social opacity-100 font-mono text-xs/none"
                        >
                          {checkLangString(lang, s.title)}
                        </a>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="hidden lg:flex w-2/3">
              {data?.text && (
                /// Out portable content from sanity here instead
                <div
                  className={
                    "flex flex-col gap-[1.3rem]  smd:pr-3 smd-max:pr-0 smd-max:max-w-2/3 "
                  }
                >
                  <RichText content={checkLangString(lang, data.text)} />
                </div>
              )}
            </div>
          </div>

          <div className=" w-full flex flex-col gap-4">
            <div className={"disable-drag "}>
              <span className="block lg:hidden">
                {data?.slides && data.slides.length > 0 && (
                  <Slider type={"media"} data={data.slides} />
                )}
              </span>

              <div className="hidden lg:grid grid-cols-[var(--grid-slides)] gap-2">
                {data?.slides &&
                  data.slides.length > 0 &&
                  data.slides.map((slide: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className="aspect-[450/275] rounded-2xl overflow-hidden"
                      >
                        <CustomImage
                          asset={slide.asset}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
              </div>
            </div>

            {data?.text && (
              /// Out portable content from sanity here instead

              <div
                className={"flex lg:hidden px-2 lg:px-3 flex flex-col gap-2"}
              >
                <RichText content={checkLangString(lang, data.text)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getScale = (index: number, currentIndex: number) => {
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

const getTranslation = (index: number, currentIndex: number) => {
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

const getScaleNum = (index: number, currentIndex: number) => {
  if (index === currentIndex) {
    return 1; // First item centered
  } else if (index === currentIndex + 1) {
    return 0.95; // Second item moved up
  } else {
    return 0.9; // Rest of the items below
  }
};
const getTranslationNum = (index: number, currentIndex: number) => {
  if (index === currentIndex) {
    return 0; // First item centered
  } else if (index === currentIndex + 1) {
    return -3; // Second item moved up
  } else {
    return -6; // Rest of the items below
  }
};

export default DraggableObserver;
