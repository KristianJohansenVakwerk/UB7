"use client";
import { useAboutAnimations } from "@/app/hooks/AboutAnimations";
import Box from "../../ui/Box/Box";
import SplitText from "../../shared/SplitText/SplitText";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = {
  entry: any;
  scroller?: any;
  active: boolean;
};

const text = `About us ad minim veniam, quis \n nostrud exercitation ullamco \n laboris nisi ut novarbus.`;
const SectionAbout = (props: Props) => {
  const { entry, scroller, active } = props;
  const container = useRef<HTMLDivElement>(null);
  useAboutAnimations(scroller, text, container, active);

  const { contextSafe } = useGSAP({ scope: container });
  const handleClick = contextSafe(() => {
    const viewportWidth = window.innerWidth;
    const scaleFactor = viewportWidth < 768 ? 1.2 : 1.1; // Larger scale on mobile

    gsap.to(".section-animation-about__reel", {
      scale: scaleFactor,
      ease: "power4.inOut",
    });
  });

  return (
    <Box
      ref={container}
      className="section section-animation-about w-full h-full flex flex-col items-start justify-between px-3 py-7"
    >
      <SplitText text={text} className={"text-4xl "} />
      <div></div>
      <div className="section-animation-about__reel" onClick={handleClick}>
        <img src="/reel.jpg" width={"693"} height={"376"} />
      </div>
    </Box>
  );
};

export default SectionAbout;
