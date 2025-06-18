"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Sector, { getScale, getTranslation } from "./Sector";
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
  onClose: () => void;
};

const Sectors = (props: SectorsProps) => {
  const {
    entries,
    updateCurrentSector,
    active,
    entriesFrom,
    entriesTo,
    onClose,
  } = props;
  const lenis = useLenis();

  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef<number>(0);
  const sectorsContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const clickNextRef = useRef<HTMLDivElement>(null);
  const clickPrevRef = useRef<HTMLDivElement>(null);
  const clickCloseRef = useRef<HTMLDivElement>(null);
  const draggableContainers = useRef<HTMLElement[]>([]);
  const activeContainersRef = useRef<HTMLElement[]>([]);
  const readyToThrow = useRef<boolean>(false);

  useGSAP(() => {
    draggableContainers.current = gsap.utils.toArray(
      ".sector-draggable"
    ) as HTMLElement[];

    draggableContainers.current.forEach((container) => {
      gsap.set(container, { y: "-200%" });
    });
  }, []);

  useGSAP(() => {
    gsap.set(sectorsContainerRef.current, { autoAlpha: 0 });

    if (active) {
      activeContainersRef.current = draggableContainers.current.slice(
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
          autoAlpha: 0,
          rotation: Math.random() * 360,
        });

        setCurrentIndex(entriesFrom);
      });

      gsap.to(sectorsContainerRef.current, {
        autoAlpha: 1,
        duration: 0.4,
        delay: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to(activeContainersRef.current, {
            y: (index) => getTranslation(index, currentIndex || 0),
            scale: (index) => getScale(index, currentIndex || 0),
            stagger: -0.1,
            duration: 0.5,
            ease: "power4.inOut",
            onComplete: () => {
              readyToThrow.current = true;
              currentIndexRef.current = entriesFrom;
              setCurrentIndex(entriesFrom);
            },
          });
        },
      });
    }
  }, [active, entries, entriesFrom, entriesTo]);

  useGSAP(() => {
    if (active && readyToThrow.current) {
      draggableContainers.current.forEach((container, ix) => {
        if (!currentIndex) return;

        if (ix >= currentIndex) {
          gsap.to(container, {
            y: getTranslation(ix, currentIndex || 0),
            scale: getScale(ix, currentIndex || 0),
            duration: 0.5,
            delay: ix * 0.1,
            ease: "power4.inOut",
          });
        }
      });
    }
  }, [active, currentIndex]);

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
    if (
      typeof window !== "undefined" &&
      draggableContainers.current.length > 0
    ) {
      draggableContainers.current.forEach((item, index) => {
        Draggable.create(item, {
          type: "x,y",
          edgeResistance: 0.65,
          inertia: true,
          allowNativeTouchScrolling: true,
          cursor: "grab",
          activeCursor: "grabbing",

          onDragStart: (self) => {},
          onDrag: () => {
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
                    currentIndexRef.current = nextIndex;

                    setCurrentIndex((prev: any) =>
                      prev <= draggableContainers.current.length - 1
                        ? nextIndex
                        : prev
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
      if (direction === "next") {
        gsap.to(draggableContainers.current[currentIndexRef.current], {
          x: "200vh",
          y: "-20%",
          rotation: Math.random() * 360,
          duration: 0.5,
          ease: "power4.inOut",
          onComplete: () => {
            console.log("oncomplete next");
            currentIndexRef.current += 1;
            setCurrentIndex((prev) => {
              return prev !== null ? prev + 1 : 0;
            });
          },
        });
      } else {
        gsap.to(draggableContainers.current[currentIndexRef.current - 1], {
          x: 0,
          y: 0,
          rotation: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: "power4.inOut",
          onComplete: () => {
            console.log("oncomplete prev");
            currentIndexRef.current -= 1;
            setCurrentIndex((prev) => (prev !== null ? prev - 1 : 0));
          },
        });
      }
    };

    const handleClose = () => {
      readyToThrow.current = false;
      // setCurrentIndex(null);
      // currentIndexRef.current = 0;

      // gsap.to(draggableContainers.current, {
      //   y: Math.random() * 100,
      //   x: Math.random() * 100,
      //   rotation: Math.random() * 360,
      //   duration: 0.5,
      //   ease: "power4.inOut",
      //   onComplete: () => {
      //     onClose();
      //   },
      // });

      gsap.to(sectorsContainerRef.current, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power4.inOut",
        onComplete: () => {
          onClose();
        },
      });
    };

    clickCloseRef.current?.addEventListener("click", () => handleClose());
    clickNextRef.current?.addEventListener("click", () => handleClick("next"));
    clickPrevRef.current?.addEventListener("click", () => handleClick("prev"));

    return () => {
      clickNextRef.current?.removeEventListener("click", () =>
        handleClick("next")
      );
      clickPrevRef.current?.removeEventListener("click", () =>
        handleClick("prev")
      );
      clickCloseRef.current?.removeEventListener("click", () => handleClose());
    };
  }, []);

  useEffect(() => {
    if (!currentIndex) return;

    if (currentIndex <= entries.length - 1) {
      updateCurrentSector(entries[currentIndex]?.sector);
    } else {
      updateCurrentSector(entries[entries.length - 1]?.sector);
    }
  }, [currentIndex]);

  return (
    <div
      ref={sectorsContainerRef}
      className={" fixed top-0 left-0 w-full h-full z-50 opacity-0"}
    >
      <div
        ref={clickCloseRef}
        className="absolute top-2 right-2 z-9999 w-[48px] h-[48px] rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md  flex items-center justify-center text-dark-grey cursor-pointer"
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

      <div
        ref={clickPrevRef}
        className="absolute top-1/2 -translate-y-1/2 left-2 z-9999 w-[48px] h-[48px] rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md  flex items-center justify-center text-dark-grey cursor-pointer"
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
      <div
        ref={clickNextRef}
        className="absolute top-1/2 -translate-y-1/2 right-2 z-9999 w-[48px] h-[48px] rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md  flex items-center justify-center text-dark-grey cursor-pointer"
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

      <div ref={containerRef} className="relative w-full h-full">
        {entries.map((entry: any, index: number) => (
          <Sector
            key={index}
            data={entry}
            index={index}
            currentIndex={currentIndex}
            active={active}
          />
        ))}
      </div>
    </div>
  );
};

export default Sectors;
