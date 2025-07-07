"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Sector, { getScale, getTranslation } from "./Sector";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";
import {
  getTimeline,
  useSectorListAnimation,
} from "@/app/hooks/AnimationsHooks";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the Draggable plugin
gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger);
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

  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef<number>(0);
  const sectorsContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const clickNextRef = useRef<any>(null);
  const clickPrevRef = useRef<any>(null);
  const draggableContainers = useRef<HTMLElement[]>([]);

  useGSAP(() => {
    draggableContainers.current = gsap.utils.toArray(
      ".sector-draggable"
    ) as HTMLElement[];
  }, []);

  useGSAP(() => {
    gsap.set(sectorsContainerRef.current, {
      id: "sectors-container-hide",
      autoAlpha: 0,
    });

    if (active) {
      gsap.to(sectorsContainerRef.current, {
        id: "sectors-container-open-tl",
        autoAlpha: 1,
        duration: 0.4,
        delay: 0.8,
        ease: "power4.inOut",
        onComplete: () => {
          currentIndexRef.current = entriesFrom;
          setCurrentIndex(entriesFrom);
        },
      });
    }
  }, [active, entries, entriesFrom, entriesTo]);

  useGSAP(() => {
    const handleClick = (direction: "next" | "prev") => {
      console.log("handleClick: ", direction);
      if (direction === "next") {
        gsap.to(draggableContainers.current[currentIndexRef.current], {
          id: "sectors-draggable-next",
          x: window.innerWidth,
          y: "-20%",
          rotation: Math.random() * 360,
          duration: 0.5,
          ease: "power4.inOut",
          onComplete: () => {
            currentIndexRef.current += 1;
            setCurrentIndex((prev) => (prev !== null ? prev + 1 : 0));
          },
        });
      } else {
        gsap.to(draggableContainers.current[currentIndexRef.current - 1], {
          id: "sectors-draggable-prev",
          x: 0,
          y: 0,
          rotation: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: "power4.inOut",
          onComplete: () => {
            currentIndexRef.current -= 1;
            setCurrentIndex((prev) => (prev !== null ? prev - 1 : 0));
          },
        });
      }
    };

    const handleClickNext = () => handleClick("next");
    const handleClickPrev = () => handleClick("prev");

    clickNextRef.current?.addEventListener("click", handleClickNext);
    clickPrevRef.current?.addEventListener("click", handleClickPrev);

    return () => {
      clickNextRef.current?.removeEventListener("click", handleClickNext);
      clickPrevRef.current?.removeEventListener("click", handleClickPrev);
    };
  }, []);

  const { timelineRef } = useSectorListAnimation();

  const handleClose = useCallback(() => {
    gsap.to(sectorsContainerRef.current, {
      id: "sectors-container-close",
      autoAlpha: 0,
      duration: 0.5,
      ease: "power4.inOut",
      onComplete: () => {
        if (timelineRef?.current) {
          // timelineRef.current.seek(1);
          // timelineRef.current.reverse();
          console.log(
            "close expanded sectors",
            timelineRef.current,
            timelineRef.current.progress()
          );

          timelineRef.current.seek(0);

          timelineRef.current.play(0);

          setCurrentIndex(null);

          onClose();
        }
      },
    });
  }, [onClose]);

  const handleDragged = useCallback((index: number) => {
    setTimeout(() => {
      console.log("we are handle dragged here", index);
      setCurrentIndex(index + 1);
      currentIndexRef.current = index + 1;
    }, 800);
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
      className={"absolute top-0 left-0 w-full h-full z-50 opacity-0"}
    >
      <div
        className="absolute top-2 right-2 z-9999 w-[48px] h-[48px] rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md  flex items-center justify-center text-dark-grey cursor-pointer"
        onClick={handleClose}
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
        className="absolute top-1/2 -translate-y-1/2 left-2 z-9999 w-[48px] h-[48px] rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md  flex items-center justify-center text-dark-grey cursor-pointer transition-opacity duration-300"
        style={{
          pointerEvents: currentIndex === 0 ? "none" : "auto",
          opacity: currentIndex === 0 ? 0.5 : 1,
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
      <div
        ref={clickNextRef}
        className="absolute top-1/2 -translate-y-1/2 right-2 z-9999 w-[48px] h-[48px] rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md  flex items-center justify-center text-dark-grey cursor-pointer transition-opacity duration-300"
        style={{
          pointerEvents: currentIndex === entries.length - 1 ? "none" : "auto",
          opacity: currentIndex === entries.length ? 0.5 : 1,
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

      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
      >
        {entries.map((entry: any, index: number) => (
          <Sector
            key={index}
            data={entry}
            index={index}
            currentIndex={currentIndex}
            active={active}
            onDragged={handleDragged}
          />
        ))}
      </div>
    </div>
  );
};

export default Sectors;
