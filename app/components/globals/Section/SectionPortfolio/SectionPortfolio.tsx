"use client";
import clsx from "clsx";
import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SectionPortfolioBackground from "./SectionPortfolioBackground";
import React from "react";
import { useStore } from "@/store/store";
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
  const [entriesTo, setEntriesTo] = useState<number>(entries.length);

  const [ready, setReady] = useState<boolean>(true);
  const [showUI, setShowUI] = useState<boolean>(true);
  const [deactivateMouseEvents, setDeactivateMouseEvents] =
    useState<boolean>(true);
  const [showExpandedSectors, setShowExpandedSectors] =
    useState<boolean>(false);
  const { setHoverSector } = useStore();

  useGSAP(() => {
    gsap.set(".sector-item", { width: "53px" });

    const tl = gsap.timeline({
      onComplete: () => {
        setShowUI(true);
        setDeactivateMouseEvents(false);
        useSetHeightOfAccordion();
      },
      onUpdate: () => {
        setDeactivateMouseEvents(true);
      },
      onReverseComplete: () => {
        setShowUI(false);
        setDeactivateMouseEvents(true);
        gsap.to(".sector-item-trigger", {
          width: "53px",
          duration: 0.2,
        });
      },
      scrollTrigger: {
        trigger: ".section-portfolio",
        scroller: "body",
        start: "top top",
        end: `+=100%`,
        toggleActions: "play none none reverse",
        markers: true,
        scrub: false,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onEnter: () => {
          console.log("onEnter");
        },
        onLeave: () => {
          gsap.to(".sector-item", {
            opacity: 0,
            stagger: 0.2,
            onComplete: () => {
              setDeactivateMouseEvents(true);
            },
          });
        },
        onEnterBack: () => {
          gsap.to(".sector-item", {
            opacity: 1,
            stagger: 0.2,
            onComplete: () => {
              setDeactivateMouseEvents(false);
            },
          });
        },
      },
    });

    tl.fromTo(
      ".sector-item",
      { width: "53px" },
      {
        width: "25%",
        stagger: 0.2,
        duration: 0.4,
        immediateRender: false,
        ease: "power2.inOut",
      }
    );

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
  }, []);

  const accordionAnis = useRef<any>(null);
  const iconAnis = useRef<any>(null);
  const activeIndexRef = useRef<number | null>(null);

  const useSetHeightOfAccordion = () => {
    const sectors = gsap.utils.toArray(".sector-item-content");

    accordionAnis.current = sectors.map((sector: any, index: number) => {
      const sectorHeight = sector.scrollHeight;
      gsap.set(sector, { height: 0, opacity: 1 });

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
  };

  // useGSAP(() => {}, []);

  const handleMouseEnter = useCallback(
    (index: number, sector: string) => {
      console.log("deactivateMouseEvents", deactivateMouseEvents);
      if (deactivateMouseEvents) return;

      setActiveSector(sector);
      playAccordion(index);
      setHoverSector(true);
    },
    [deactivateMouseEvents]
  );

  const handleMouseLeave = useCallback(() => {
    if (deactivateMouseEvents) return;

    setActiveSector("");
    resetAccordion();
    setHoverSector(false);
  }, [deactivateMouseEvents]);

  const showExpandedectors = (
    slug: string,
    sector: string,
    entryIndex: number
  ) => {
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

          gsap.to(["#progress", "#section-title-portfolio"], {
            opacity: 0,
            duration: 0.4,
            ease: "power4.inOut",
          });
        },
      });
    });
  };

  const handleUpdateSector = (sector: string) => {
    setActiveSector(sector);
  };

  const handleClose = () => {
    setActiveSector("");
    resetAccordion();
    setHoverSector(false);
    setDeactivateMouseEvents(false);
    setShowExpandedSectors(false);

    gsap.to(".sector-item", {
      opacity: 1,
      stagger: 0.1,
      duration: 0.2,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(["#progress", "#section-title-portfolio"], {
          opacity: 1,
          duration: 0.4,
          ease: "power4.inOut",
        });
      },
    });
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
          " flex flex-row items-center justify-start gap-0 w-full z-10 px-3 h-screen",
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
              <div className="absolute left-0 sector-item-trigger w-[100%] h-[53px] rounded-full border-2 border-[rgba(255,255,255,0.7)] z-10 bg-[rgba(255,255,255,0)]">
                <div
                  className={clsx(
                    "sector-item-trigger-content opacity-0 w-full h-full flex flex-row items-center justify-between px-2 cursor-pointer ",
                    deactivateMouseEvents && "cursor-auto pointer-events-none"
                  )}
                >
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

              <div className="absolute top-0 left-0 w-full h-fit sector-item-content opacity-0 bg-white rounded-[27px]  overflow-hidden z-0">
                <div className="sector-item-content-inner  w-full pt-[100px] px-1 pb-2">
                  {sector.entries.map((entry: any, ix: number) => {
                    return (
                      <div
                        key={index + ix}
                        className={clsx(
                          "sector-item-content-entry opacity-0 translate-y-[-5px] hover:text-light-grey hover:pl-1 transition-all duration-400 cursor-pointer",
                          deactivateMouseEvents &&
                            "pointer-events-none cursor-auto"
                        )}
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
        active={showExpandedSectors}
        updateCurrentSector={handleUpdateSector}
        onClose={handleClose}
      />
    </>
  );
};

export default SectionPortfolio;
