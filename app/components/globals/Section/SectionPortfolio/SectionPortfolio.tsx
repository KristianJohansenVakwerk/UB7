"use client";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionPortfolioBackground from "./SectionPortfolioBackground";
import React from "react";
import { useStore } from "@/store/store";
import Sectors from "../../Sectors/Sectors";
import SectionTitle from "../SectionTitle";
import SectionPortfolioList from "./SectionPortfolioList";
import { useSectorListEvents } from "../../../../hooks/AnimationsHooks";
import { cleanupGSAPAnimations } from "@/app/utils/gsapUtils";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const SectionPortfolio = (props: any) => {
  const { data, title } = props;
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const { introStoreDone } = useStore();

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
  const [showTitle, setShowTitle] = useState<boolean>(false);
  const [showUI, setShowUI] = useState<boolean>(false);

  const [showExpandedSectors, setShowExpandedSectors] =
    useState<boolean>(false);
  const { setHoverSector } = useStore();

  useGSAP(() => {
    ScrollTrigger.create({
      id: "portfolio-trigger",
      trigger: ".section-portfolio",
      start: "top top+=100px",
      end: "bottom bottom",
      toggleActions: "play none none reverse",
    });
    return () => {
      console.log("call: cleanupGSAPAnimations");
      cleanupGSAPAnimations();
    };
  }, []);

  // Animation of list is complete allow background to be shown on mouse enter
  useSectorListEvents("onComplete", () => {
    setShowUI(true);
  });

  useSectorListEvents("onScrollTriggerEnter", () => {
    setShowTitle(true);
  });

  useSectorListEvents("onScrollTriggerLeave", () => {
    setShowTitle(false);
  });

  useSectorListEvents("onScrollTriggerEnterBack", () => {
    setShowTitle(true);
  });

  useSectorListEvents("onScrollTriggerLeaveBack", () => {
    setShowTitle(false);
  });

  const handleUpdateSector = (sector: string) => {
    setActiveSector(sector);
  };

  const handleClose = () => {
    const smoother = ScrollSmoother.get();
    smoother?.paused(false);

    setActiveSector("");
    setHoverSector(false);

    setShowExpandedSectors(false);

    gsap.to(".sector-item", {
      opacity: 1,
      stagger: 0.1,
      duration: 0.2,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(["#progress", "#section-title-portfolio", "#menu"], {
          opacity: 1,
          duration: 0.4,
          ease: "power4.inOut",
        });
      },
    });
  };

  const handleExpandViewMode = useCallback(
    (entryIndex: number, sector: string) => {
      console.log("handleExpandViewMode", entryIndex, sector);
      setActiveSector(sector);
      setEntriesFrom(entryIndex);
      setShowExpandedSectors(true);
    },
    []
  );

  const handleShowBackground = useCallback((sector: string) => {
    setActiveSector(sector);
  }, []);

  return (
    <>
      <div
        className={clsx(
          "relative gap-0 w-full h-full px-3 flex flex-col items-start justify-between overflow-hidden"
        )}
      >
        <div>
          <div className={"pt-7 relative z-10"}>
            <SectionTitle title={title} id={"portfolio"} play={showTitle} />
          </div>
        </div>
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 px-3 z-10 ">
          {introStoreDone && (
            <SectionPortfolioList
              data={data}
              onExpandViewMode={handleExpandViewMode}
              onShowBackground={handleShowBackground}
              active={!showExpandedSectors}
            />
          )}
        </div>
      </div>

      <SectionPortfolioBackground
        activeSector={activeSector}
        data={data}
        active={showUI}
      />

      {showUI && (
        <Sectors
          entries={entries}
          entriesFrom={entriesFrom}
          entriesTo={entriesTo}
          active={showExpandedSectors}
          updateCurrentSector={handleUpdateSector}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default SectionPortfolio;
