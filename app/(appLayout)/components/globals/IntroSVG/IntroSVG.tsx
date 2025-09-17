"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Suspense, useEffect, useRef, useState } from "react";
gsap.registerPlugin(ScrollTrigger);
import Clock from "../../shared/Clock/Clock";
import { useStore } from "@/store/store";
import clsx from "clsx";
import { ThreeCanvas } from "../ThreeCanvas/ThreeCanvas";

// const textSettings = [
//   // Light Gray
//   {
//     offset: 0.1875,
//     "stop-color": "#D9D9D9",
//     delay: 0,
//   },
//   // Light Yellow/Cream
//   {
//     offset: 0.307692,
//     "stop-color": "#FEFFC2",
//     delay: 0,
//   },
//   // Bright Lime Green
//   {
//     offset: 0.639423,
//     "stop-color": "#7EFA50",
//     delay: 0.2,
//   },
//   // Dark Green
//   {
//     offset: 0.913462,
//     "stop-color": "#09603D",
//     delay: 0.4,
//   },
// ];

// const textSettingsPortuguese = [
//   // Light Gray
//   {
//     offset: 0.1875,
//     "stop-color": "#A7A7A7",
//     delay: 0,
//   },
//   // Light Yellow/Cream
//   {
//     offset: 0.307692,
//     "stop-color": "#09603D",
//     delay: 0,
//   },
//   // Bright Lime Green
//   {
//     offset: 0.639423,
//     "stop-color": "#09603D",
//     delay: 0.2,
//   },
//   // Dark Green
//   {
//     offset: 0.913462,
//     "stop-color": "#000000",
//     delay: 0.4,
//   },
// ];

// const textSettingsMobile = [
//   // Light Gray

//   // Light Yellow/Cream
//   {
//     offset: 0.18,
//     "stop-color": "#FEFFC2",
//     delay: 0,
//   },
//   // Bright Lime Green
//   {
//     offset: 0.5,
//     "stop-color": "#7EFA50",
//     delay: 0.2,
//   },
//   // Dark Green
//   {
//     offset: 0.913462,
//     "stop-color": "#09603D",
//     delay: 0.4,
//   },
// ];

// const bgSettings = [
//   // Dark green
//   {
//     offset: 0.1,
//     "stop-color": "#03763B",
//     delay: 0.4,
//   },
//   // Bright lime green
//   {
//     offset: 0.538462,
//     "stop-color": "#7EFA50",
//     delay: 0.2,
//   },
//   // Light yellow/cream
//   {
//     offset: 0.817308,
//     "stop-color": "#FEFFC2",
//     delay: 0,
//   },
//   // Light gray
//   {
//     offset: 1,
//     "stop-color": "#D9D9D9",
//     delay: 0,
//   },
// ];

// const bgSettingsMin = [
//   // Dark green
//   {
//     offset: 0.01,
//     delay: 0.4,
//   },
//   // Bright lime green
//   {
//     offset: 0.2,
//     delay: 0.2,
//   },
//   // Light yellow/cream
//   {
//     offset: 0.3,
//     delay: 0,
//   },
//   // Light gray
//   {
//     offset: 1,
//     delay: 0,
//   },
// ];

// const bgSettingsPortuguese = [
//   {
//     offset: 0.12,
//     "stop-color": "#000000",
//     delay: 0.4,
//   },
//   {
//     offset: 0.68,
//     "stop-color": "#09603D",
//     delay: 0.2,
//   },
//   {
//     offset: 0.91,
//     "stop-color": "#646464",
//     delay: 0,
//   },
//   {
//     offset: 1,
//     "stop-color": "#A7A7A7",
//     delay: 0,
//   },
// ];

const dur = 0.75;
const delay = 0.5;

const IntroSVG = () => {
  const number7Ref = useRef<SVGSVGElement>(null);
  const number7GradientRef = useRef<SVGLinearGradientElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const bgGradientRef = useRef<SVGRadialGradientElement>(null);
  const gradientContainerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLSpanElement>(null);
  const loaderRefPct = useRef<HTMLSpanElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);

  const {
    setIntroStoreDone,
    introStoreDone,
    currentStoreIndex,
    language,
    // introSplash,
    // setIntroSplash,
  } = useStore();

  // useGSAP(() => {
  //   if (introSplash) {
  //     if (!bgGradientRef.current || currentStoreIndex <= 1) return;

  //     const stopsBG = bgGradientRef.current.querySelectorAll("stop");

  //     bgSettings.forEach((setting, index) => {
  //       gsap.to(stopsBG[index], {
  //         attr: {
  //           offset: setting.offset,
  //         },
  //         duration: 0.4,
  //         delay: 0.75,
  //         repeat: 1,
  //         yoyo: true,
  //         ease: "circ.inOut",
  //       });
  //     });

  //     setIntroSplash(false);
  //   }
  // }, [introSplash, currentStoreIndex]);

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

  // Initial gradient animation - grow from bottom
  useGSAP(() => {
    if (isLoading) return;

    // const stopsText = gradientRef.current.querySelectorAll("stop");

    // gsap.set(stopsText, {
    //   attr: {
    //     offset: 1,
    //     "stop-color": "#D9D9D9",
    //   },
    // });

    // /// Mobile specifics for intro
    // if (ScrollTrigger.isTouch) {
    //   gsap.set(number7Ref.current, {
    //     opacity: 1,
    //   });

    //   const stopsNumber7 = number7GradientRef.current.querySelectorAll("stop");

    //   gsap.set(stopsNumber7, {
    //     attr: {
    //       offset: 1,
    //       "stop-color": "#D9D9D9",
    //     },
    //   });

    //   textSettingsMobile.forEach((setting, index) => {
    //     gsap.to(stopsNumber7[index], {
    //       attr: {
    //         offset: setting.offset,
    //         "stop-color": setting["stop-color"],
    //       },
    //       onComplete: () => {
    //         if (index === textSettingsMobile.length - 1) {
    //           gsap.to(number7Ref.current, {
    //             autoAlpha: 0,
    //             duration: 0.5,
    //             ease: "expo.inOut",
    //             onComplete: () => {
    //               gsap.to(".intro-text-svg", {
    //                 autoAlpha: 1,
    //                 duration: 2,
    //                 ease: "expo.inOut",
    //                 onComplete: () => {
    //                   setIntroStoreDone(true);
    //                 },
    //               });
    //               textSettings.forEach((setting, index) => {
    //                 gsap.set(stopsText[index], {
    //                   attr: {
    //                     offset: setting.offset,
    //                     "stop-color": setting["stop-color"],
    //                   },
    //                 });
    //               });
    //             },
    //           });
    //         }
    //       },
    //       duration: 2,
    //       ease: "expo.inOut",
    //       delay: setting.delay,
    //     });
    //   });
    // } else {
    //   gsap.set(".intro-text-svg", {
    //     autoAlpha: 1,
    //   });

    //   textSettings.forEach((setting, index) => {
    //     gsap.to(stopsText[index], {
    //       attr: {
    //         offset: setting.offset,
    //         "stop-color": setting["stop-color"],
    //       },
    //       onComplete: () => {
    //         if (index === textSettings.length - 1) {
    //           setIntroStoreDone(true);
    //           setStartAnimation(true);
    //         }
    //       },
    //       duration: 2,
    //       ease: "expo.inOut",
    //       delay: setting.delay,
    //     });
    //   });
    // }

    // gsap.set(gradientContainerRef.current, {
    //   opacity: 1,
    // });

    // const stopsBG = bgGradientRef.current.querySelectorAll("stop");

    // gsap.set(stopsBG, {
    //   attr: {
    //     offset: 0,
    //   },
    // });

    // bgSettingsPortuguese.forEach((setting, index) => {
    //   gsap.to(stopsBG[index], {
    //     attr: {
    //       offset: setting.offset,
    //     },
    //     duration: 2,
    //     ease: "expo.inOut",
    //     delay: setting.delay,
    //   });
    // });
  }, [isLoading]);

  useGSAP(() => {
    if (isLoading) return;

    // if (!bgGradientRef.current) return;
    // const stopsBG = bgGradientRef.current.querySelectorAll("stop");

    if (currentStoreIndex > 0) {
      gsap.to("#clocks", {
        autoAlpha: 0,
        duration: dur,
        ease: "expo.inOut",
      });

      // bgSettingsMin.forEach((setting, index) => {
      //   gsap.to(stopsBG[index], {
      //     attr: {
      //       offset: setting.offset,
      //     },
      //     duration: dur,
      //     ease: "expo.inOut",
      //   });
      // });

      // Maximum gradient animation

      // gsap.to(".intro-text-svg", {
      //   autoAlpha: 0,
      //   duration: dur,
      //   ease: "expo.inOut",
      // });
    } else if (currentStoreIndex === 0) {
      gsap.to("#clocks", {
        autoAlpha: 1,
        duration: dur,
        delay: delay,
        ease: "expo.inOut",
      });

      // gsap.to(".intro-text-svg", {
      //   autoAlpha: 1,
      //   duration: dur,
      //   delay: delay,
      //   ease: "expo.inOut",
      // });

      if (introStoreDone) {
        // bgSettings.forEach((setting, index) => {
        //   gsap.to(stopsBG[index], {
        //     attr: {
        //       offset: setting.offset,
        //     },
        //     duration: dur,
        //     delay: delay,
        //     ease: "expo.inOut",
        //   });
        // });
        // minimum gradient animation
      }
    }
  }, [currentStoreIndex, isLoading, introStoreDone]);

  // useGSAP(() => {
  //   if (!bgGradientRef.current || !gradientRef.current) return;
  //   const stopsBG = bgGradientRef.current.querySelectorAll("stop");
  //   const stopsText = gradientRef.current.querySelectorAll("stop");

  //   switch (language) {
  //     case "pt":
  //       bgSettingsPortuguese.forEach((setting, index) => {
  //         gsap.to(stopsBG[index], {
  //           attr: {
  //             offset: setting.offset,
  //             "stop-color": setting["stop-color"],
  //           },
  //           duration: 0.8,
  //           ease: "expo.inOut",
  //         });
  //       });

  //       textSettingsPortuguese.forEach((setting, index) => {
  //         gsap.to(stopsText[index], {
  //           attr: {
  //             offset: setting.offset,
  //             "stop-color": setting["stop-color"],
  //           },

  //           duration: 0.8,
  //           ease: "expo.inOut",
  //         });
  //       });
  //       break;
  //     default:
  //       bgSettings.forEach((setting, index) => {
  //         gsap.to(stopsBG[index], {
  //           attr: {
  //             offset: setting.offset,
  //             "stop-color": setting["stop-color"],
  //           },
  //           duration: 0.8,
  //           ease: "expo.inOut",
  //         });
  //       });

  //       textSettings.forEach((setting, index) => {
  //         gsap.to(stopsText[index], {
  //           attr: {
  //             offset: setting.offset,
  //             "stop-color": setting["stop-color"],
  //           },

  //           duration: 0.8,
  //           ease: "expo.inOut",
  //         });
  //       });
  //   }
  // }, [language]);

  // useGSAP(() => {
  //   if (!startAnimation) return;

  //   const ani = () => {
  //     // Animate the background gradient offsets
  //     if (bgGradientRef.current) {
  //       const stopsBG = bgGradientRef.current.querySelectorAll("stop");

  //       gsap.to(stopsBG, {
  //         attr: {
  //           offset: (i, target) => {
  //             const currentOffset = parseFloat(
  //               target.getAttribute("offset") || "0"
  //             );
  //             // Even slower movement for background
  //             return (
  //               currentOffset +
  //               Math.sin(Date.now() * 0.000015 + i * 0.08) * 0.0008
  //             );
  //           },
  //         },
  //         duration: 0.1,
  //         ease: "none",
  //       });
  //     }
  //   };

  //   gsap.ticker.add(ani);

  //   return () => {
  //     gsap.ticker.remove(ani);
  //   };
  // }, [startAnimation]);

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

      {/* <div className="block lg:hidden fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center px-3 lg:px-12">
        <svg
          ref={number7Ref}
          width="304"
          height="394"
          viewBox="0 0 304 394"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block opacity-0 px-3"
          style={{ willChange: "transform" }}
        >
          <path
            d="M279.525 96.2893C198.052 104.74 129.88 142.084 81.1173 205.343C41.9444 256.154 16.0932 324.43 9.77631 393.288H105.843C109.595 363.605 121.145 309.838 156.836 263.523C182.083 230.759 214.48 208.861 253.528 197.974L279.504 96.0801H0.415039L24.3899 0.681641H303.479L279.504 96.0801Z"
            fill="url(#number7_gradient)"
          />
          <defs>
            <linearGradient
              ref={number7GradientRef}
              id="number7_gradient"
              x1="151.947"
              y1="0.681641"
              x2="151.947"
              y2="433.988"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.231405" stopColor="#FEFFC2" />
              <stop offset="0.446281" stopColor="#7EFA50" />
              <stop offset="0.913462" stopColor="#09603D" />
            </linearGradient>
          </defs>
        </svg>
      </div> */}

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
