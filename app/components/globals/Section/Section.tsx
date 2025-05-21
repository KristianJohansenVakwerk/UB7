"use client";
import Box from "../../ui/Box/Box";
import SectionAbout from "./SectionAbout";
import SectionContact from "./SectionContact";
import SectionIntro from "./SectionIntro";
import SectionPortfolio from "./SectionPortfolio";

type Props = {
  entry: any;
  activeSection: string | null;
};

const Section = (props: Props) => {
  const { entry, activeSection } = props;

  switch (entry.id) {
    case "intro":
      return <SectionIntro entry={entry} />;
    case "about":
      return <SectionAbout entry={entry} />;
    case "portfolio":
      return <SectionPortfolio entry={entry} activeSection={activeSection} />;
    case "contact":
      return <SectionContact entry={entry} />;
  }
};

export default Section;
