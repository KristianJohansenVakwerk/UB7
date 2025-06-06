"use client";
import { useEffect } from "react";
import Sector from "./Sector";
import { useLenis } from "lenis/react";

const Sectors = (props: any) => {
  const { data } = props;
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.stop();
    }

    return () => {
      if (lenis) {
        lenis.start();
      }
    };
  }, [lenis]);

  const flattenedEntries = data.flatMap((sector: any, sectorIndex: number) =>
    sector.entries.map((entry: any) => ({
      ...entry,
      sectorIndex,
      media: sector.media,
    }))
  );

  return (
    <div className={"fixed top-0 left-0 w-full h-full z-50  bg-red-500"}>
      <div>
        {flattenedEntries.map((entry: any, index: number) => (
          <Sector key={index} data={entry} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Sectors;
