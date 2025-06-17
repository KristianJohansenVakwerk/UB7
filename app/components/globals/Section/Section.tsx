"use client";
import Box from "../../ui/Box/Box";
import SectionAbout from "./SectionAbout/SectionAbout";
import SectionContact from "./SectionContact/SectionContact";
import SectionIntro from "./SectionIntro";
import SectionPortfolio from "./SectionPortfolio/SectionPortfolio";

type Props = {
  entry: any;
  activeSection: string | null;
  parent: any;
};

const Section = (props: Props) => {
  const { entry, activeSection, parent } = props;

  switch (entry.id) {
    case "intro":
      return <SectionIntro />;
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
        // <SectionAbout
        //   entry={entry}
        //   scroller={parent}
        //   active={activeSection === "about"}
        // />
        <></>
      );

    case "contact":
      return <SectionContact title={entry.title} />;
  }
};

export default Section;
