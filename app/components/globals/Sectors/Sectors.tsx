"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Sector from "./Sector";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";

// Register the Draggable plugin
gsap.registerPlugin(Draggable, InertiaPlugin);
type SectorsProps = {
  entries: any;
  entriesFrom: number;
  entriesTo: number;
  active: boolean;
  updateCurrentSector: (sector: string) => void;
};

const Sectors = (props: SectorsProps) => {
  const { entries, updateCurrentSector, active, entriesFrom, entriesTo } =
    props;
  const lenis = useLenis();

  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef<number>(0);
  const sectorsContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const clickNextRef = useRef<HTMLDivElement>(null);
  const clickPrevRef = useRef<HTMLDivElement>(null);
  const draggableContainers = useRef<HTMLElement[]>([]);

  useGSAP(() => {
    draggableContainers.current = gsap.utils.toArray(
      ".sector-draggable-container"
    ) as HTMLElement[];

    draggableContainers.current.forEach((container) => {
      gsap.set(container, { y: "-100%" });
    });
  }, [active]);

  useGSAP(() => {
    if (active) {
      const activeContainers = draggableContainers.current.slice(
        entriesFrom,
        entriesTo
      );

      const inactiveContainers = draggableContainers.current.slice(
        0,
        entriesFrom
      );

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      inactiveContainers.forEach((container) => {
        let randomX =
          Math.random() > 0.5
            ? windowWidth + 500 + Math.random() * 1000 // Right side
            : -500 - Math.random() * 1000; // Left side

        let randomY =
          Math.random() > 0.5
            ? windowHeight + 500 + Math.random() * 1000 // Bottom
            : -500 - Math.random() * 1000; // Top

        // Get the element's dimensions
        const rect = container.getBoundingClientRect();

        // Check if the element is visible in the viewport
        const isVisible =
          randomX + rect.width > 0 &&
          randomX < windowWidth &&
          randomY + rect.height > 0 &&
          randomY < windowHeight;

        // If visible, adjust position to move it further out
        if (isVisible) {
          if (randomX > 0) {
            randomX = windowWidth + 1000 + Math.random() * 1000;
          } else {
            randomX = -1000 - Math.random() * 1000;
          }

          if (randomY > 0) {
            randomY = windowHeight + 1000 + Math.random() * 1000;
          } else {
            randomY = -1000 - Math.random() * 1000;
          }
        }
        gsap.set(container, {
          x: randomX,
          y: randomY,
          opacity: 1,
          rotation: Math.random() * 360,
        });

        setCurrentIndex(entriesFrom);
      });

      gsap.to(sectorsContainerRef.current, {
        opacity: 1,
        display: "block",
        duration: 0.4,
        delay: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to(activeContainers, {
            y: 0,
            stagger: -0.1,
            duration: 0.5,
            ease: "power4.inOut",
          });
        },
      });
    }
  }, [active, entries, entriesFrom, entriesTo]);

  useEffect(() => {
    if (lenis && active) {
      lenis.stop();
    }

    return () => {
      if (lenis) {
        lenis.start();
      }
    };
  }, [lenis, active]);

  useGSAP(() => {
    const selectedItems = gsap.utils.toArray(
      ".sector-draggable"
    ) as HTMLElement[];

    if (typeof window !== "undefined" && selectedItems.length > 0) {
      selectedItems.forEach((item, index) => {
        Draggable.create(item, {
          type: "x,y",
          edgeResistance: 0.65,
          inertia: true,
          allowNativeTouchScrolling: true,
          cursor: "grab",
          activeCursor: "grabbing",

          onDragStart: (self) => {},
          onDrag: (self) => {},
          onDragEnd: (self) => {
            const el = item;

            if (el) {
              const vx = InertiaPlugin.getVelocity(el, "x");
              const vy = InertiaPlugin.getVelocity(el, "y");

              gsap.to(el, {
                rotation: vx * 0.01,
                duration: 0.5,
                ease: "power2.out",

                onComplete: () => {
                  const ww = window.innerWidth;
                  const wh = window.innerHeight;
                  const rect = el.getBoundingClientRect();

                  const isOutSide =
                    rect.left > ww ||
                    rect.right < 0 ||
                    rect.top + rect.height > wh ||
                    rect.bottom + rect.height < 0;

                  if (isOutSide) {
                    const currentIndex = index;

                    currentIndexRef.current = currentIndex;
                    const nextIndex = currentIndexRef.current + 1;

                    setCurrentIndex((prev: any) =>
                      prev <= selectedItems.length - 1 ? nextIndex : prev
                    );
                  }
                },
              });
            }
          },
        });
      });
    }
  }, []);

  useGSAP(() => {
    const handleClick = (direction: "next" | "prev") => {
      // setCurrentIndex((prev) => prev + 1);

      // console.log("currentIndex before", currentIndexRef.current);

      // if (direction === "next") {
      //   setCurrentIndex((prev) => (prev ? prev + 1 : 0));
      // } else {
      //   setCurrentIndex((prev) => (prev ? prev - 1 : 0));
      // }

      gsap.to(draggableContainers.current, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1,
        ease: "power4.inOut",
        stagger: 0.2,
      });
    };

    clickNextRef.current?.addEventListener("click", () => handleClick("next"));
    clickPrevRef.current?.addEventListener("click", () => handleClick("prev"));

    return () => {
      clickNextRef.current?.removeEventListener("click", () =>
        handleClick("next")
      );
      clickPrevRef.current?.removeEventListener("click", () =>
        handleClick("prev")
      );
    };
  }, []);

  useEffect(() => {
    if (!currentIndex) return;

    console.log("currentIndex", currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (!currentIndex) return;

    if (currentIndex <= entries.length - 1) {
      updateCurrentSector(entries[currentIndex].sector);
    } else {
      updateCurrentSector(entries[entries.length - 1].sector);
    }
  }, [currentIndex]);

  return (
    <div
      ref={sectorsContainerRef}
      className={" fixed top-0 left-0 w-full h-full z-50 opacity-0 hidden"}
    >
      <div ref={clickPrevRef} className="absolute top-0 left-0 z-9999">
        Prev
      </div>
      <div ref={clickNextRef} className="absolute top-0 right-0 z-9999">
        Next
      </div>

      <div ref={containerRef} className="relative w-full h-full">
        {entries.map((entry: any, index: number) => (
          <Sector
            key={index}
            data={entry}
            index={index}
            currentIndex={currentIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default Sectors;
