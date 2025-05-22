"use client";
import Box from "../../ui/Box/Box";
import SectionAbout from "./SectionAbout";
import SectionContact from "./SectionContact";
import SectionIntro from "./SectionIntro";
import SectionPortfolio from "./SectionPortfolio";

type Props = {
  entry: any;
  activeSection: string | null;
  parent: any;
};

const Section = (props: Props) => {
  const { entry, activeSection, parent } = props;

  switch (entry.id) {
    case "intro":
      return <SectionIntro entry={entry} />;
    case "portfolio":
      return (
        <SectionPortfolio
          entry={entry}
          scroller={parent}
          active={activeSection === "portfolio"}
        />
      );
    case "about":
      return (
        <SectionAbout
          entry={entry}
          scroller={parent}
          active={activeSection === "about"}
        />
      );

    case "contact":
      return <SectionContact entry={entry} />;
  }
};

export default Section;
