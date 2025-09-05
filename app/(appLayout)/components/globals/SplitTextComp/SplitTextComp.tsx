"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useRef } from "react";

gsap.registerPlugin(SplitText);

const SplitTextComp = (props: {
  text: string;
  type?: "lines" | "words" | "chars";
  active?: boolean;
}) => {
  const { text, type = "lines", active = false } = props;
  const ref = useRef<HTMLDivElement>(null);
  const splitTextRef = useRef<any>(null);
  const tlRef = useRef<any>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const proxy = document.createElement("span");
    proxy.innerHTML = text;
    ref.current.appendChild(proxy);

    const splitText = new SplitText(ref.current, {
      type: "chars",
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
      gsap.from(splitText.chars, {
        opacity: 0,
        y: -5,
        duration: 0.1,
        stagger: 0.05,
        ease: "sine.inOut",
      })
    );

    return () => {
      splitText.revert();
    };
  }, [text, type]);

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

export default SplitTextComp;
