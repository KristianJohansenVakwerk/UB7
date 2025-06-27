"use client";
import clsx from "clsx";
import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionPortfolioBackground from "./SectionPortfolioBackground";
import React from "react";
import { useStore } from "@/store/store";
import Sectors from "../../Sectors/Sectors";
import SectionTitle from "../SectionTitle";
import SectionPortfolioList from "./SectionPortfolioList";
import {
  getTimeline,
  useSectorListEvents,
  useTimelineEvents,
} from "./SectionPortfolioHooks";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const SectionPortfolio = (props: any) => {
  const { data, title } = props;
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
  const [showTitle, setShowTitle] = useState<boolean>(false);
  const [showUI, setShowUI] = useState<boolean>(true);
  const [deactivateMouseEvents, setDeactivateMouseEvents] =
    useState<boolean>(true);
  const [showExpandedSectors, setShowExpandedSectors] =
    useState<boolean>(false);
  const { setHoverSector } = useStore();

  useSectorListEvents("onComplete", () => {
    console.log("section: onComplete");
    setShowUI(true);
  });

  useSectorListEvents("onUpdate", () => {});

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
    // resetAccordion();
    setHoverSector(false);
    setDeactivateMouseEvents(false);
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

  return (
    <>
      <div
        className={clsx(
          "gap-0 w-full h-full z-10 px-3 flex flex-col items-start justify-between"
        )}
      >
        <div className={"pt-7"}>
          <SectionTitle title={title} id={"portfolio"} play={showTitle} />
        </div>

        <SectionPortfolioList data={data} />

        <div></div>
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
