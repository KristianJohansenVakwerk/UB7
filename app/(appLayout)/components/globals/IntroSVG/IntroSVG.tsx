"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
gsap.registerPlugin(ScrollTrigger);
import Clock from "../../shared/Clock/Clock";
import { useStore } from "@/store/store";
import clsx from "clsx";
import { ThreeCanvas } from "../ThreeCanvas/ThreeCanvas";

const dur = 0.75;
const delay = 0.5;

const IntroSVG = () => {
  const loaderRef = useRef<HTMLSpanElement>(null);
  const loaderRefPct = useRef<HTMLSpanElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { introStoreDone, currentStoreIndex, language } = useStore();

  useGSAP(() => {
    if (!loaderRef.current) return;

    const handleLoad = () => {
      console.log("handleLoad");
      gsap.to(loaderRef.current, {
        duration: 2,
        delay: 1,
        ease: "expo.inOut",
        onUpdate: function () {
          const pct = Math.round(this.progress() * 100);

          if (!loaderRefPct.current) return;
          loaderRefPct.current.textContent = `${pct}%`;
        },
        onComplete: () => {
          gsap.to(loaderRef.current, {
            duration: 1,
            ease: "expo.inOut",
            opacity: 0,
            delay: 0.5,
            onComplete: () => {
              setIsLoading(false);
            },
          });
        },
      });
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useGSAP(() => {
    if (isLoading) return;

    if (currentStoreIndex > 0) {
      gsap.to("#clocks", {
        autoAlpha: 0,
        duration: dur,
        ease: "expo.inOut",
      });
    } else if (currentStoreIndex === 0) {
      gsap.to("#clocks", {
        autoAlpha: 1,
        duration: dur,
        delay: delay,
        ease: "expo.inOut",
      });
    }
  }, [currentStoreIndex, isLoading, introStoreDone]);

  return (
    <>
      <div
        className={clsx([
          "fixed top-0 left-0 w-full h-full flex items-center justify-center text-mono z-[9999] pointer-events-none",
        ])}
      >
        <span ref={loaderRef} className="font-mono text-sm">
          Start scrolling after loading... <span ref={loaderRefPct}>0%</span>
        </span>
      </div>

      <div className="fixed top-0 left-0 w-full h-full">
        <ThreeCanvas isReady={!isLoading} />
      </div>

      <div
        id={"clocks"}
        className="fixed bottom-8 lg:bottom-0  left-0 w-full h-auto pointer-events-none  lg:flex flex-col items-center justify-center lg:justify-end p-0 lg:p-3"
      >
        <div
          className={
            "flex flex-row gap-6 justify-center  lg:gap-10 text-dark-green text-sm font-mono leading-1.1"
          }
        >
          <div className="flex flex-col items-center time ">
            Madrid
            <Clock location="Europe/Madrid" />
          </div>
          <div className="flex flex-col items-center time ">
            Sao Paulo <Clock location="America/Sao_Paulo" />
          </div>
          <div className="flex flex-col items-center time ">
            London <Clock location="Europe/London" />
          </div>
        </div>
      </div>
    </>
  );
};

export default IntroSVG;
