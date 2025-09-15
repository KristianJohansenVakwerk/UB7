"use client";

import { checkLangString, richTextToHTML } from "@/app/(appLayout)/utils/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useEffect, useMemo, useRef } from "react";

gsap.registerPlugin(SplitText);

const SplitRichTextComp = (props: {
  lang: string;
  text: any;
  type?: "lines" | "words" | "chars";
  active?: boolean;
}) => {
  const { lang, text, type = "lines", active = false } = props;
  const ref = useRef<HTMLDivElement>(null);
  const splitTextRef = useRef<any>(null);
  const tlRef = useRef<any>(null);
  const prevLangRef = useRef(lang);

  const textContent = useMemo(() => {
    return richTextToHTML(checkLangString(lang, text));
  }, [lang, text]);

  // Handle language changes
  useEffect(() => {
    if (prevLangRef.current !== lang && tlRef.current) {
      // Language changed and we're on the about section, play the animation
      gsap.delayedCall(0.1, () => {
        tlRef.current.play();
      });
    }
    prevLangRef.current = lang;
  }, [lang]);

  useGSAP(() => {
    if (!ref.current) return;

    if (splitTextRef.current) {
      splitTextRef.current.revert();
      splitTextRef.current = null;
    }

    ref.current.innerHTML = "";

    const proxy = document.createElement("span");
    proxy.innerHTML = textContent;

    while (proxy.firstChild) {
      ref.current.appendChild(proxy.firstChild);
    }

    const splitText = new SplitText(ref.current, {
      type: "lines",
      linesClass: "split-line text-base-2",
      // wordsClass: "text-base-2",
      tag: "span",
      autoParseHtml: true,
    });

    splitTextRef.current = splitText;

    tlRef.current = gsap.timeline({
      paused: true,
    });

    tlRef.current.add(
      gsap.fromTo(
        splitText.lines,
        {
          opacity: 0,
          visibility: "hidden",
          y: -10,
        },
        {
          opacity: 1,
          visibility: "visible",
          duration: 0.2,
          stagger: 0.1,
          ease: "sine.inOut",
        }
      )
    );

    const handleResize = () => {
      splitText.revert();
      splitText.split({ type: "lines" });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (splitTextRef.current) {
        splitTextRef.current.revert();
        splitTextRef.current = null;
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [textContent]);

  useGSAP(() => {
    if (!tlRef.current) return;

    if (active) {
      tlRef.current.play(0);
    } else {
      tlRef.current.reverse();
    }
  }, [active]);

  return <div ref={ref} />;
};

export default SplitRichTextComp;
