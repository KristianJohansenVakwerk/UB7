import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const globalSectionTriggers = [
  { start: "top top", end: "bottom bottom", id: "portfolio" }, // Portfolio section
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
      const nestedTrigger = ScrollTrigger.getById("slider-pinned");
      const spacer = nestedTrigger?.pin?.parentNode as any;

      if (spacer) {
        const spacerBottom = spacer.offsetTop + spacer.offsetHeight;

        return `+=${spacerBottom}px`;
      }
      return "top+=1000 top"; // fallback if needed
    },
    end: "+=100%",
    id: "contact",
  }, // Contact section
];

export const globalTriggers = [
  { id: "intro", trigger: "intro-trigger" },
  { id: "portfolio", trigger: "portfolio-trigger" },
  { id: "about", trigger: "about-trigger" },
  { id: "contact", trigger: "contact-trigger" },
];
