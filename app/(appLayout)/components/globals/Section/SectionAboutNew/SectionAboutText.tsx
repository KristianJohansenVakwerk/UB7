"use client";

import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import { checkLangString, richTextToHTML } from "@/app/(appLayout)/utils/utils";

gsap.registerPlugin(SplitText);

const AboutSectionText = (props: any) => {
  const { lang, currentIndex, scrollingDown, data } = props;

  const textRef = useRef<HTMLDivElement>(null);
  const tlAboutTextRef = useRef<any>(null);
  const prevLangRef = useRef(lang);
  const splitTextRef = useRef<any>(null);

  const textContent = useMemo(() => {
    return richTextToHTML(checkLangString(lang, data?.text));
  }, [lang, data?.text]);

  // Handle language changes
  useEffect(() => {
    if (
      prevLangRef.current !== lang &&
      currentIndex === 2 &&
      tlAboutTextRef.current
    ) {
      console.log(
        "Language changed and we're on the about section, play the animation"
      );
      // Language changed and we're on the about section, play the animation
      gsap.delayedCall(0.1, () => {
        // textRef.current?.offsetHeight;
        tlAboutTextRef.current.play();
      });
    }
    prevLangRef.current = lang;
  }, [lang, currentIndex]);

  useGSAP(() => {
    if (currentIndex === 2) {
      console.log("Current index is 2, play the animation");
      gsap.delayedCall(1, () => {
        textRef.current?.offsetHeight;
        tlAboutTextRef.current.play();
      });
    } else if (tlAboutTextRef.current && !scrollingDown) {
      tlAboutTextRef.current.reverse();
    }
  }, [currentIndex, scrollingDown]);

  useGSAP(() => {
    tlAboutTextRef.current = gsap.timeline({
      paused: true,
    });

    if (!textRef.current) return;

    // Clean up previous SplitText instance if it exists
    if (splitTextRef.current) {
      splitTextRef.current.revert();
      splitTextRef.current = null;
    }

    if (!textRef.current) return;

    textRef.current.textContent = "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = textContent;

    while (tempDiv.firstChild) {
      textRef.current.appendChild(tempDiv.firstChild);
    }

    const paragraphs = textRef.current.querySelectorAll("p");

    if (paragraphs.length === 0) return;

    let allLines: any[] = [];
    const splitTextInstances: any[] = [];
    paragraphs.forEach((paragraph, index) => {
      const splitText = new SplitText(paragraph, {
        type: "lines",
        tag: "span",
        linesClass: "split-line text-base-2",
        autoParseHtml: true,
      });

      splitTextInstances.push(splitText);

      allLines.push(...splitText.lines);
    });

    splitTextRef.current = splitTextInstances;

    tlAboutTextRef.current.add(
      gsap.fromTo(
        allLines,
        { opacity: 0, visibility: "hidden" },
        {
          opacity: 1,
          visibility: "visible",
          duration: 0.3,
          stagger: 0.1,
          ease: "sine.inOut",
        }
      )
    );

    const handleResize = () => {
      splitTextInstances.forEach((splitText) => {
        if (splitText && splitText.revert) {
          splitText.revert();
        }
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to revert SplitText when component unmounts or re-renders
    return () => {
      if (splitTextRef.current && Array.isArray(splitTextRef.current)) {
        splitTextRef.current.forEach((splitText) => {
          if (splitText && splitText.revert) {
            splitText.revert();
          }
        });
        splitTextRef.current = null;
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [textContent]);

  return (
    <div
      ref={textRef}
      className="text-about text-light-grey flex flex-col gap-1.5"
    ></div>
  );
};

export default AboutSectionText;
