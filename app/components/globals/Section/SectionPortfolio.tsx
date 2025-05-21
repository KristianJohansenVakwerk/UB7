"use client";
import { useEffect } from "react";
import TextReveal from "../../shared/TextReveal/TextReveal";
import Box from "../../ui/Box/Box";
type Props = {
  entry: any;
  activeSection: string | null;
};
const SectionPortfolio = (props: Props) => {
  const { entry, activeSection } = props;

  return (
    <Box className="section w-full h-full flex flex-col items-start justify-start px-3 py-7">
      <TextReveal
        text={`Redefining capital with flair, \n precision, and purpose. \n Operating across four \n strategic sectors.`}
        className={"text-4xl "}
        active={activeSection === "portfolio"}
      />
    </Box>
  );
};

export default SectionPortfolio;
