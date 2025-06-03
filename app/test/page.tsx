import Slider from "../components/shared/Slider/Slider";

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
      <div className="w-full h-screen  flex items-center justify-start">
        <div>
          <Slider active={true} />
        </div>
      </div>
    </>
  );
}
