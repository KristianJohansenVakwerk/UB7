"use client";
import {  useRef } from "react";
import SplitText from "../../shared/SplitText/SplitText";
import Box from "../../ui/Box/Box";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePortfolioAnimations } from "@/app/hooks/PortfolioAnimations";
import Accordion from "../../shared/Accordion/Accordion";

gsap.registerPlugin(useGSAP);

type Props = {
  entry: any;
  scroller: any;
  active: boolean;
};
const text = `Redefining capital with flair, \n precision, and purpose. \n Operating across four \n strategic sectors.`;
const SectionPortfolio = (props: Props) => {
  const { entry, scroller, active } = props;
  const container = useRef<HTMLDivElement>(null);

  usePortfolioAnimations(scroller, text, container, active);

  return (
    <Box
      ref={container}
      className="section section-animation-portfolio w-full h-full flex flex-col items-start justify-between px-3 py-7"
    >
      <SplitText text={text} className={"text-4xl "} />

      <Box className="w-full">
        <Accordion
          data={[
            {
              title: "Football",
              entries: [],
            },
            {
              title: "Sport",
              entries: [],
            },
            {
              title: "Entertainment",
              entries: [],
            },
            {
              title: "Philanthropy",
              entries: [],
            },
          ]}
        />
      </Box>
      <div className="h-[100px]"></div>
    </Box>
  );
};

export default SectionPortfolio;
