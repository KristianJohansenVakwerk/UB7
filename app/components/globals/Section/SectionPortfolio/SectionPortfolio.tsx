"use client";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";

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

gsap.registerPlugin(ScrollTrigger);

const SectionPortfolio = (props: any) => {
  const { data, title, currentIndex } = props;
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
  const [showUI, setShowUI] = useState<boolean>(false);

  const [test, setTest] = useState<boolean>(false);

  useEffect(() => {
    if (currentIndex === 1) {
      setTest(true);
    }
  }, [currentIndex]);

  const [showExpandedSectors, setShowExpandedSectors] =
    useState<boolean>(false);
  const { setHoverSector } = useStore();

  // Animation of list is complete allow background to be shown on mouse enter
  useSectorListEvents("onComplete", () => {
    setShowUI(true);
  });

  const handleUpdateSector = (sector: string) => {
    setActiveSector(sector);
  };

  const handleClose = () => {
    // const smoother = ScrollSmoother.get();
    // smoother?.paused(false);

    setActiveSector("");
    setHoverSector(false);

    setShowExpandedSectors(false);

    gsap.to(".sector-item", {
      opacity: 1,
      stagger: 0.1,
      duration: 0.2,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(
          ["#progress", "#section-title-portfolio", "#menu", ".section-title"],
          {
            opacity: 1,
            duration: 0.4,
            ease: "power4.inOut",
          }
        );
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
          "portfolio relative h-full gap-0 w-full h-full px-2 lg:px-3 flex flex-col items-start justify-between overflow-hidden"
        )}
      >
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 px-2 lg:px-3 z-10">
          {introStoreDone && (
            <SectionPortfolioList
              data={data}
              onExpandViewMode={handleExpandViewMode}
              onShowBackground={handleShowBackground}
              active={!showExpandedSectors}
              currentIndex={currentIndex}
            />
          )}
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
      </div>
    </>
  );
};

export default SectionPortfolio;
