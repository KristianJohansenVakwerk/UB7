import SectionIntro from "./components/globals/Section/SectionIntro";
import Sections from "./components/globals/Sections/Sections";
import SectionsSnapCSS from "./components/globals/SectionsSnapCSS/SectionsSnapCSS";
import SmoothScroll from "./components/globals/SmoothScroll/SmoothScroll";
import { Wrapper } from "./components/globals/Wrapper/Wrapper";
import Box from "./components/ui/Box/Box";
import Menu from "./components/globals/Menu/Menu";
import Progress from "./components/globals/Progress/Progress";

export default function Home() {
  return (
    <>
      {/* Globals
      - Navigation bar i bottom
      – Progress bar at top
      – Lang switcher portuguese and english
       */}

      {/* intro

      Notes:
      – Animated gradient background
      – Interactive on mouse move
       */}

      {/* Portfolio

      Notes:
      - Animated text
      – after animation, portfolio areas should be revealed left to right
      – Portfoli categories is expandable and collapsible (accordion style)
      – Portfolio cateogry revels an video or image on hover and expands at click
       */}

      {/* About */}
      {/* Contact */}

      {/* <Sections /> */}

      {/* <SectionsSnapCSS /> */}

      <Wrapper lenis={{}}>
        <Progress />
        <SectionIntro />
        <SmoothScroll />

        <Menu
          data={[
            { title: "UB7", id: "intro" },
            { title: "Portfolio", id: "portfolio" },
            { title: "About", id: "about" },
            { title: "Contact", id: "contact" },
          ]}
        />
      </Wrapper>
    </>
  );
}
