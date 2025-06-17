import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const globalSectionTriggers = [
  { start: "top top", end: "bottom center", id: "portfolio" }, // Portfolio section
  {
    start: "top center",
    end: () => {
      const parent = document.getElementById("about") as any;
      const nestedPin = ScrollTrigger.getById("slider-pinned") as any;
      const spacer = nestedPin?.pin?.parentNode;

      if (spacer && parent) {
        return `+=${
          spacer?.offsetTop + spacer?.offsetHeight + parent?.offsetHeight
        }px`;
      }

      return "bottom center";
    },
    id: "about",
  }, // About section
  {
    start: () => {
      const nestedTrigger = ScrollTrigger.getById("nested-pin");
      const spacer = nestedTrigger?.pin?.parentNode as any;

      if (spacer) {
        const spacerBottom = spacer.offsetTop + spacer.offsetHeight;
        return `+=${spacerBottom}px`;
      }
      return "top+=1000 top"; // fallback if needed
    },
    end: "bottom bottom",
    id: "contact",
  }, // Contact section
];
