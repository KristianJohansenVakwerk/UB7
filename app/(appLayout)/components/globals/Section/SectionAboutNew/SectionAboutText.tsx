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
      // Language changed and we're on the about section, play the animation
      gsap.delayedCall(0.1, () => {
        tlAboutTextRef.current.play();
      });
    }
    prevLangRef.current = lang;
  }, [lang, currentIndex]);

  useGSAP(() => {
    if (currentIndex === 2) {
      gsap.delayedCall(2.2, () => {
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

    textRef.current.innerHTML = "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = textContent;

    while (tempDiv.firstChild) {
      textRef.current.appendChild(tempDiv.firstChild);
    }

    const splitText = new SplitText(textRef.current, {
      type: "lines",
      linesClass: "split-line text-base-2",
      // wordsClass: "text-base-2",
      tag: "span",
      autoParseHtml: true,
    });

    // Store the SplitText instance for cleanup
    splitTextRef.current = splitText;

    tlAboutTextRef.current.add(
      gsap.from(splitText.lines, {
        opacity: 0,
        duration: 0.3,
        stagger: 0.1,
        ease: "sine.inOut",
      })
    );

    const handleResize = () => {
      splitText.revert();
      splitText.split({ type: "lines" });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to revert SplitText when component unmounts or re-renders
    return () => {
      if (splitTextRef.current) {
        splitTextRef.current.revert();
        splitTextRef.current = null;
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [textContent]);

  return <div ref={textRef} className="text-about text-light-grey"></div>;
};

export default AboutSectionText;
