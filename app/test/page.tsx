"use client";

import { useInView } from "react-intersection-observer";
import ScrollTrigger from "gsap/ScrollTrigger";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

export default function TestPage() {
  const boundsRef = useRef<HTMLDivElement>(null);

  const observer = useRef<any>(null);
  const currentIndex = useRef(0);
  const boxesPos = useRef<any>([]);
  const lastTime = useRef(0);
  const direction = useRef<1 | -1>(1);
  const isDragging = useRef(false);

  useGSAP(() => {
    const boxes = gsap.utils.toArray(".box");

    boxes.forEach((_, index) => {
      boxesPos.current[index] = { x: 0 };
    });

    if (boundsRef.current) {
      const getCurrentBox = () => boxes[currentIndex.current] as HTMLElement;

      const getPreviousBox = () => {
        console.log("getPreviousBox", currentIndex.current);
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
        console.log(
          "before current index",
          currentIndex.current,
          direction.current,
          boxes.length - 1
        );
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

        console.log(
          "after current index",
          currentIndex.current,
          direction.current,
          boxes.length - 1
        );
      };

      // Set cursor
      const setCursor = (cursor: string) => {
        const box = getCurrentBox();
        if (box) {
          box.style.cursor = cursor;
        }
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
            console.log("Drag started", currentIndex.current);
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

          if (
            currentIndex.current === boxes.length - 1 &&
            direction.current === 1
          ) {
            gsap.to(activeBox, {
              x: 0,
              y: 0,
              rotation: 0,
              duration: 1.2,
              ease: "expo.inOut",
              onComplete: () => {
                activeBoxPos.x = 0;
                gsap.killTweensOf(activeBox);
              },
            });

            return;
          }

          console.log("onRelease", currentIndex.current !== boxes.length - 1);

          if (Math.abs(activeBoxPos.x) > 100) {
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
          } else {
            gsap.to(activeBox, {
              x: 0,
              y: 0,
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
    if (currentIndex.current === 0) return;
    const boxes = gsap.utils.toArray(".box");
    currentIndex.current -= 1;

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
    <div className="relative h-[100svh] w-screen overflow-hidden">
      <div
        className="absolute top-3 left-3  z-10 cursor-pointer"
        onClick={handlePrev}
      >
        Prev
      </div>
      <div
        className="absolute top-3 right-3 z-10 cursor-pointer"
        onClick={handleNext}
      >
        Next
      </div>
      <div
        ref={boundsRef}
        className="bounds absolute top-0 left-0 bg-red-500 h-full w-screen flex items-center justify-center user-select-none"
        style={{
          touchAction: "pan-x pan-y",
          overscrollBehavior: "none",
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            data-index={index}
            className="box absolute top-2 lg:top-1/2  left-1/2 -translate-x-1/2 lg:-translate-y-1/2 h-[80vh] w-[calc(100vw-3rem)] p-2 lg:p-3 lg:w-[calc(80vh*0.55)] lg:w-[calc(80vh*0.46)] bg-white  rounded-[26px] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-manipulation user-select-none  bg-gray-300"
            style={{ zIndex: 1000 - index, touchAction: "pan-x pan-y" }}
          >
            <div className=" bg-yellow-500">start {index}</div>
            <div className="h-[300px] bg-blue-500">content</div>
            <div className="disable-drag h-[300px] bg-purple-500">
              Not draggable
            </div>
            <div className="h-[800px] bg-gray-500">content</div>
            <div className=" bg-green-500">end</div>
          </div>
        ))}
      </div>
    </div>
  );
}
