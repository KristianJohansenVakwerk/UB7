"use client";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Slider from "../../shared/Slider/Slider";
gsap.registerPlugin(ScrollTrigger);

type Props = {
  data: any;
  entriesFrom: number;
};
const DraggableObserver = (props: Props) => {
  const { data, entriesFrom } = props;

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

  // State for the current index of the entry to update react stuff
  const [currentStateIndex, setCurrentStateIndex] = useState(0);

  // Ref for the bounds of the observer
  const boundsRef = useRef<HTMLDivElement>(null);

  // Refs for the observer
  const observer = useRef<any>(null);
  const currentIndex = useRef(entriesFrom);
  const boxesPos = useRef<any>([]);
  const lastTime = useRef(0);
  const direction = useRef<1 | -1>(1);
  const isDragging = useRef(false);

  // Refs to handle boxes
  const activeBoxes = useRef<HTMLElement[]>([]);
  const inActiveBoxes = useRef<HTMLElement[]>([]);

  // GSAP for the initial setup
  useGSAP(() => {
    const boxes = gsap.utils.toArray(".box");

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
            onComplete: () => {
              if (index === activeBoxesArray.length - 1) {
                activeBoxes.current.shift();
              }
            },
          });
        }
      );
    });
  }, []);

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

      const updateCurrentIndex = () => {
        console.log("updateCurrentIndex");
        if (direction.current === 1) {
          // Moving forward
          if (currentIndex.current < boxes.length - 1) {
            currentIndex.current += 1;
          } else {
            currentIndex.current = boxes.length - 1;
          }
        } else {
          // Moving backward
          if (currentIndex.current > 0) {
            currentIndex.current -= 1;
          } else {
            currentIndex.current = 0;
          }
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
        activeBoxes.current.forEach((box: HTMLElement, index: number) => {
          console.log(box.dataset.index, index, currentBoxIndex);
          if (index + currentBoxIndex > currentBoxIndex) {
            gsap.killTweensOf(box);
          }

          const dragProgress = isForward
            ? Math.max(0, Math.min(boxPos / 100, 1))
            : 0;

          const boxIndex = index + currentBoxIndex;
          const distanceFromCurrent = boxIndex - currentBoxIndex;

          // Get base positions
          const baseY = getTranslationNum(boxIndex, currentBoxIndex);
          const baseScale = getScaleNum(boxIndex, currentBoxIndex);

          let finalY = baseY;
          let finalScale = baseScale;

          // Moving forward - boxes cascade up and scale UP
          switch (distanceFromCurrent) {
            case 0:
              // Current box stays at center

              const targetY0 = boxPos > 0 ? 0 : -3;
              const targetScale0 = boxPos > 0 ? 1 : 0.95;

              finalY = gsap.utils.interpolate(baseY, targetY0, dragProgress);

              finalScale = gsap.utils.interpolate(
                baseScale,
                targetScale0,
                dragProgress
              );
              break;
            case 1:
              // Next box: interpolate between -3vh (base) and 0vh (forward) or -6vh (backward)
              const targetY1 = boxPos > 0 ? -3 : -6;
              const targetScale1 = boxPos > 0 ? 0.95 : 0.9;
              finalY = gsap.utils.interpolate(baseY, targetY1, dragProgress);
              finalScale = gsap.utils.interpolate(
                baseScale,
                targetScale1,
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
            scale: finalScale,
            ease: "power1.inOut",
          });
        });
      };

      // Animations
      const xTo = gsap.utils.pipe((value: number) => {
        const activeBox =
          direction.current === 1 ? getCurrentBox() : getPreviousBox();
        return gsap.quickTo(activeBox, "x", { ease: "power2" })(value);
      });

      const rTo = gsap.utils.pipe((value: number) => {
        const activeBox =
          direction.current === 1 ? getCurrentBox() : getPreviousBox();
        return gsap.quickTo(activeBox, "rotation", { ease: "power4" })(value);
      });

      observer.current = ScrollTrigger.observe({
        target: boundsRef.current,
        type: "touch, pointer",
        preventDefault: false,
        dragMinimum: 10,
        tolerance: 10,
        ignore: ".disable-drag",
        onDrag: (self: any) => {
          // Only handle horizontal drags, ignore vertical ones
          if (Math.abs(self.deltaX) < Math.abs(self.deltaY)) {
            return; // Allow vertical scrolling to pass through
          }

          if (!isDragging.current) {
            isDragging.current = true;

            // Set direction
            setDirection(self.deltaX);
          }

          const activeBox =
            direction.current === 1 ? getCurrentBox() : getPreviousBox();
          const activeBoxPos =
            direction.current === 1 ? getCurrentBoxPos() : getPreviousBoxPos();
          const now = Date.now();
          const deltaTime = now - lastTime.current;

          // Kill tween
          gsap.killTweensOf(activeBox);

          // Calculate velocity
          const v = (self.deltaX * 2) / (deltaTime / 16.67);
          const r = v * 0.05;

          // Update current position
          activeBoxPos.x = activeBoxPos.x + v;

          // Update position and rotation
          xTo(activeBoxPos.x);
          rTo(r);
          lastTime.current = now;

          if (direction.current === 1) {
            setPositions(
              activeBoxPos.x,
              parseFloat(activeBox.dataset.index as string),
              true
            );
          }
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

          if (Math.abs(activeBoxPos.x) > 200) {
            gsap.to(activeBox, {
              x:
                direction.current === 1
                  ? window.innerWidth / 2 + activeBox.clientWidth
                  : 0,

              rotation: 0,
              duration: 1.2,
              delay: 0.4,
              ease: "expo.out",
              onComplete: () => {
                gsap.delayedCall(0.2, () => {
                  activeBox.scrollTo({ top: 0 });
                });
                activeBoxPos.x = gsap.getProperty(activeBox, "x");
                gsap.killTweensOf(activeBox);
              },
            });

            updateCurrentIndex();

            // Remove or add the current box to the beginning of activeBoxes array
            if (direction.current === 1) {
              console.log("shift", activeBox.dataset.index);
              activeBoxes.current.shift();
              // setPositions(100);
            } else {
              // Add the current box back to the beginning of activeBoxes array
              console.log("unshift", activeBox.dataset.index);
              activeBoxes.current.unshift(activeBox);

              gsap.delayedCall(2, () => {
                setPositions(
                  0,
                  parseFloat(activeBox.dataset.index as string),
                  false
                );
              });
            }
          } else {
            console.log("else");
            // setPositions(activeBoxPos.x);
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

      observer.current.enable();
    }
  });

  const handleNext = useCallback(() => {
    const boxes = gsap.utils.toArray(".box");
    if (currentIndex.current === boxes.length - 1) return;

    const activeBox = boxes[currentIndex.current] as HTMLElement;
    const activeBoxWidth = activeBox.clientWidth;
    const activeBoxPos = boxesPos.current[currentIndex.current];

    currentIndex.current += 1;
    setCurrentStateIndex(currentIndex.current);

    gsap.to(activeBox, {
      x: window.innerWidth / 2 + activeBoxWidth,
      y: Math.random() * 100 - 50,
      rotation: Math.random() * 10,
      duration: 2.2,
      ease: "expo.out",
      onComplete: () => {
        gsap.killTweensOf(activeBox);
      },
    });
  }, []);

  const handlePrev = useCallback(() => {
    const boxes = gsap.utils.toArray(".box");
    if (currentIndex.current === 0) {
      gsap.to(boxes[0] as HTMLElement, {
        x: -50,
        y: 0,
        rotation: Math.random() * 5 - 2.5,
        yoyo: true,
        repeat: 1,
        duration: 0.4,
        ease: "expo.out",
      });

      return;
    }

    currentIndex.current -= 1;

    setCurrentStateIndex(currentIndex.current);

    const activeBox = boxes[currentIndex.current] as HTMLElement;
    const activeBoxPos = boxesPos.current[currentIndex.current];

    gsap.to(activeBox, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 1.2,
      ease: "expo.out",
      onComplete: () => {
        gsap.killTweensOf(activeBox);
      },
    });
  }, []);

  return (
    <div className="relative h-[100svh] w-screen overflow-hidden  bg-red-500">
      <CloseButton onClick={() => {}} />
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
          <Entry key={index} data={entry} index={index} />
        ))}
      </div>
    </div>
  );
};

const CloseButton = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className=" absolute bottom-2 lg:bottom-auto lg:top-2 translate-x-1/2 lg:translate-x-0 right-1/2 lg:right-3 z-9999 w-[48px] h-[48px] rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md flex items-center justify-center text-dark-grey cursor-pointer"
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

export const Entry = (props: any) => {
  const { data, index } = props;
  return (
    <div
      className="box absolute top-2 lg:top-1/2 border-5 border-blue-500  left-1/2 -translate-x-1/2 lg:-translate-y-1/2 h-[80vh] lg:h-[74vh] w-[calc(100vw-3rem)]  lg:w-[calc(80vh*0.46)] lg:w-[calc(80vh*0.46)] bg-white  rounded-[26px] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-manipulation user-select-none"
      style={{ zIndex: 1000 - index, touchAction: "pan-x pan-y" }}
      data-index={index}
    >
      <div className="h-auto w-full py-2  flex flex-col gap-4 lg:gap-8">
        <div className={"font-mono text-sm px-2 lg:px-3"}>
          Category: {data.sector} {index}
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

            <div className=" w-full flex flex-col gap-4">
              <div className={"disable-drag"}>
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
              </div>

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
  );
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

export const getScaleNum = (index: number, currentIndex: number) => {
  if (index === currentIndex) {
    return 0.95; // First item centered
  } else if (index === currentIndex + 1) {
    return 0.9; // Second item moved up
  } else {
    return 0.9; // Rest of the items below
  }
};
export const getTranslationNum = (index: number, currentIndex: number) => {
  if (index === currentIndex) {
    return -3; // First item centered
  } else if (index === currentIndex + 1) {
    return -6; // Second item moved up
  } else {
    return -6; // Rest of the items below
  }
};

export default DraggableObserver;
