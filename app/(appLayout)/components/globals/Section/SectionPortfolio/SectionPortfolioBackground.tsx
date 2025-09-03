"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import CustomImage from "../../../shared/Image/Image";

type Props = {
  data: any;
  activeSector: string | null;
  active: boolean;
};
const SectionPortfolioBackground = (props: Props) => {
  const { data, activeSector, active } = props;

  return (
    <div className="absolute top-0 left-0 w-screen h-screen object-cover object-center  overflow-hidden z-0 pointer-events-none isolation-auto">
      {data.map((entry: any, index: number) => {
        return (
          <CustomImage
            key={index}
            asset={entry.media}
            className={clsx(
              "ani-image absolute top-0 left-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-500 ease-in-out",
              activeSector === entry.title.en && active && "opacity-100"
            )}
          />
        );
      })}
    </div>
  );
};

export default SectionPortfolioBackground;
