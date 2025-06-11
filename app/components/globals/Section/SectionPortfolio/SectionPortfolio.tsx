"use client";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SectionPortfolioBackground from "./SectionPortfolioBackground";
import React from "react";
import { useStore } from "@/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sectors from "../../Sectors/Sectors";

const SectionPortfolio = (props: any) => {
  const { data } = props;
  const [activeSector, setActiveSector] = useState<string | null>(null);

  const [entries, setEntries] = useState<any[]>(
    data.flatMap((sector: any, sectorIndex: number) =>
      sector.entries.map((entry: any) => ({
        ...entry,
        sectorIndex,
        media: sector.media,
      }))
    )
  );
  const [entriesFrom, setEntriesFrom] = useState<number>(0);
  const [entriesTo, setEntriesTo] = useState<number>(entries.length - 1);

  const [ready, setReady] = useState<boolean>(true);
  const [showUI, setShowUI] = useState<boolean>(true);
  const [deactivateMouseEvents, setDeactivateMouseEvents] =
    useState<boolean>(false);
  const [showExpandedSectors, setShowExpandedSectors] =
    useState<boolean>(false);
  const { setHoverSector, setSectorsActive } = useStore();
  const router = useRouter();

  useGSAP((context, contextSafe) => {
    const tl = gsap.timeline({
      onReverseComplete: () => {
        gsap.to(".sector-item-trigger", {
          width: "53px",
          duration: 0.2,
        });
      },
      scrollTrigger: {
        trigger: ".section-portfolio",
        scroller: "body",
        start: "top top",
        end: "+=80%",
        toggleActions: "play none none reverse",
        markers: false,
        scrub: false,

        onUpdate: (self) => {
          // const progress = self.progress;
          // if (progress > 0.5 && progress < 0.85) {
          //   setShowUI(true);
          // } else {
          //   setShowUI(false);
          // }
        },
        // onEnter: () => {
        //   setShowUI(true);
        // },
        // onLeave: () => {
        //   setShowUI(false);
        //   gsap.to(".sector-item", {
        //     opacity: 0,
        //     stagger: 0.2,
        //   });
        // },
        // onEnterBack: () => {
        //   setShowUI(true);
        //   gsap.to(".sector-item", {
        //     opacity: 1,
        //     stagger: 0.2,
        //   });
        // },
      },
    });

    tl.to(".sector-item", {
      width: "25%",
      stagger: 0.2,
      duration: 0.4,
    });

    tl.to(
      ".sector-item-trigger",

      {
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.5)",
        borderColor: "transparent",
        stagger: 0.2,
        duration: 0.4,
      },
      "<"
    );

    tl.to(
      ".sector-item-trigger-content",
      {
        opacity: 1,
        stagger: 0.2,
        delay: 0.5,
        duration: 0.4,
      },
      "<"
    );

    // tl.to(
    //   ".sector-item",
    //   {
    //     opacity: 0,
    //     stagger: 0.2,
    //   },
    //   "+=1.0"
    // );
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setReady(true);
  //   }, 100);
  // }, []);

  const accordionAnis = useRef<any>(null);
  const iconAnis = useRef<any>(null);
  const activeIndexRef = useRef<number | null>(null);

  useGSAP(() => {
    const sectors = gsap.utils.toArray(".sector-item-content");

    accordionAnis.current = sectors.map((sector: any, index: number) => {
      const sectorHeight = sector.clientHeight;
      console.log("sectorHeight", sectorHeight);

      gsap.set(sector, { height: 0 });

      return gsap
        .timeline({ paused: true })
        .to(sector, {
          height: sectorHeight,
          duration: 0.3,
          ease: "power3.inOut",
        })
        .to(sector.querySelectorAll(".sector-item-content-entry"), {
          opacity: 1,
          y: 0,
          duration: 0.2,
          stagger: 0.2,
          ease: "power3.inOut",
        });
    });

    iconAnis.current = sectors.map((sector: any, index: number) => {
      return gsap
        .timeline({ paused: true })
        .to(`.sector-icon-${index} path:first-child`, {
          rotation: 90,
          duration: 0.3,
          transformOrigin: "center center",
          ease: "power2.inOut",
        });
    });
  }, [showUI]);

  const handleMouseEnter = useCallback(
    (index: number, sector: string) => {
      if (!showUI || deactivateMouseEvents) return;

      setActiveSector(sector);
      playAccordion(index);
      setHoverSector(true);
    },
    [showUI, deactivateMouseEvents]
  );

  const handleMouseLeave = useCallback(() => {
    if (!showUI || deactivateMouseEvents) return;

    setActiveSector("");
    resetAccordion();
    setHoverSector(false);
  }, [showUI, deactivateMouseEvents]);

  const showExpandedectors = (
    slug: string,
    sector: string,
    entryIndex: number
  ) => {
    setEntries((prev) => entries.slice(entryIndex, prev.length - 1));

    setEntriesFrom(entryIndex);

    setActiveSector(sector);
    setDeactivateMouseEvents(true);
    resetAccordion(() => {
      gsap.to(".sector-item", {
        opacity: 0,
        stagger: 0.1,
        duration: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
          setShowExpandedSectors(true);
          setSectorsActive(true);
        },
      });
    });
  };

  const handleUpdateSector = (sector: string) => {
    setActiveSector(sector);
  };

  const resetAccordion = useCallback((cb?: () => void) => {
    accordionAnis.current.forEach((tl: any) => {
      tl.reverse();
      tl.eventCallback("onReverseComplete", () => {
        cb?.();
      });
    });
    iconAnis.current.forEach((tl: any) => {
      tl.reverse();
    });

    activeIndexRef.current = null;
  }, []);

  const playAccordion = useCallback(async (index: number) => {
    if (activeIndexRef.current === index) return;

    if (activeIndexRef.current !== null) {
      const currentAccordion = accordionAnis.current[activeIndexRef.current];
      const currentIcon = iconAnis.current[activeIndexRef.current];

      await Promise.all([
        new Promise((resolve) => {
          if (
            currentAccordion &&
            !currentAccordion.reversed() &&
            currentAccordion.progress() > 0
          ) {
            currentAccordion
              .reverse()
              .eventCallback("onReverseComplete", resolve);
          } else {
            resolve(false);
          }
        }),
        new Promise((resolve) => {
          if (
            currentIcon &&
            !currentIcon.reversed() &&
            currentIcon.progress() > 0
          ) {
            currentIcon.reverse().eventCallback("onReverseComplete", resolve);
          } else {
            resolve(false);
          }
        }),
      ]);
    }

    iconAnis.current[index].play();
    accordionAnis.current[index].play();
    activeIndexRef.current = index;
  }, []);

  return (
    <>
      <div
        className={clsx(
          "sticky top-[55%] flex flex-row items-center justify-start gap-0 w-full z-10 px-3",
          !ready && "opacity-0"
        )}
      >
        {data.map((sector: any, index: number) => {
          const realIndex = index * sector.entries.length;
          return (
            <div
              key={index}
              className="sector-item relative w-[53px]"
              onMouseEnter={() => handleMouseEnter(index, sector.title)}
              onMouseLeave={() => handleMouseLeave()}
            >
              <div className="absolute top-0 left-0 sector-item-trigger w-[53px] h-[53px]  rounded-full border-2 border-[rgba(255,255,255,0.7)] z-10 bg-[rgba(255,255,255,0)]">
                <div className="sector-item-trigger-content opacity-0 w-full h-full flex flex-row items-center justify-between px-2 cursor-pointer">
                  <div className={"font-mono text-sm"}>{sector.title}</div>

                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={clsx(
                      `currentColor sector-icon`,
                      `sector-icon-${index}`
                    )}
                  >
                    <path
                      d="M12 5V19"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 12H19"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="absolute top-0 left-0 w-full h-fit sector-item-content bg-white rounded-[27px]  overflow-hidden z-0">
                <div className="sector-item-content-inner  w-full pt-[100px] px-1 pb-2">
                  {sector.entries.map((entry: any, ix: number) => {
                    return (
                      <div
                        key={index + ix}
                        className="sector-item-content-entry opacity-0 translate-y-[-5px] hover:text-light-grey hover:pl-1 transition-all duration-400 cursor-pointer"
                      >
                        <div
                          onClick={() =>
                            showExpandedectors(
                              entry.slug,
                              entry.sector,
                              realIndex + ix
                            )
                          }
                        >
                          {entry.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <SectionPortfolioBackground
        activeSector={activeSector}
        data={data}
        active={showUI}
      />

      <Sectors
        entries={entries}
        entriesFrom={entriesFrom}
        entriesTo={entriesTo}
        active={showUI && showExpandedSectors}
        updateCurrentSector={handleUpdateSector}
      />
    </>
  );
};

export default SectionPortfolio;
