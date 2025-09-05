"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
gsap.registerPlugin(ScrollTrigger);
import Clock from "../../shared/Clock/Clock";
import { useStore } from "@/store/store";
import clsx from "clsx";

const textSettings = [
  // Light Gray
  {
    offset: 0.1875,
    "stop-color": "#D9D9D9",
    delay: 0,
  },
  // Light Yellow/Cream
  {
    offset: 0.307692,
    "stop-color": "#FEFFC2",
    delay: 0,
  },
  // Bright Lime Green
  {
    offset: 0.639423,
    "stop-color": "#7EFA50",
    delay: 0.2,
  },
  // Dark Green
  {
    offset: 0.913462,
    "stop-color": "#09603D",
    delay: 0.4,
  },
];

const textSettingsPortuguese = [
  // Light Gray
  {
    offset: 0.1875,
    "stop-color": "#A7A7A7",
    delay: 0,
  },
  // Light Yellow/Cream
  {
    offset: 0.307692,
    "stop-color": "#09603D",
    delay: 0,
  },
  // Bright Lime Green
  {
    offset: 0.639423,
    "stop-color": "#09603D",
    delay: 0.2,
  },
  // Dark Green
  {
    offset: 0.913462,
    "stop-color": "#000000",
    delay: 0.4,
  },
];

const textSettingsMobile = [
  // Light Gray

  // Light Yellow/Cream
  {
    offset: 0.18,
    "stop-color": "#FEFFC2",
    delay: 0,
  },
  // Bright Lime Green
  {
    offset: 0.5,
    "stop-color": "#7EFA50",
    delay: 0.2,
  },
  // Dark Green
  {
    offset: 0.913462,
    "stop-color": "#09603D",
    delay: 0.4,
  },
];

const bgSettings = [
  // Dark green
  {
    offset: 0.1,
    "stop-color": "#03763B",
    delay: 0.4,
  },
  // Bright lime green
  {
    offset: 0.538462,
    "stop-color": "#7EFA50",
    delay: 0.2,
  },
  // Light yellow/cream
  {
    offset: 0.817308,
    "stop-color": "#FEFFC2",
    delay: 0,
  },
  // Light gray
  {
    offset: 1,
    "stop-color": "#D9D9D9",
    delay: 0,
  },
];

const bgSettingsMin = [
  // Dark green
  {
    offset: 0.01,
    delay: 0.4,
  },
  // Bright lime green
  {
    offset: 0.2,
    delay: 0.2,
  },
  // Light yellow/cream
  {
    offset: 0.3,
    delay: 0,
  },
  // Light gray
  {
    offset: 1,
    delay: 0,
  },
];

const bgSettingsPortuguese = [
  {
    offset: 0.12,
    "stop-color": "#000000",
    delay: 0.4,
  },
  {
    offset: 0.68,
    "stop-color": "#09603D",
    delay: 0.2,
  },
  {
    offset: 0.91,
    "stop-color": "#646464",
    delay: 0,
  },
  {
    offset: 1,
    "stop-color": "#A7A7A7",
    delay: 0,
  },
];

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
      gsap.to(loaderRef.current, {
        duration: 2,
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
    if (
      !gradientRef.current ||
      !bgGradientRef.current ||
      !number7GradientRef.current ||
      isLoading
    )
      return;

    const stopsText = gradientRef.current.querySelectorAll("stop");

    gsap.set(stopsText, {
      attr: {
        offset: 1,
        "stop-color": "#D9D9D9",
      },
    });

    /// Mobile specifics for intro
    if (ScrollTrigger.isTouch) {
      gsap.set(number7Ref.current, {
        opacity: 1,
      });

      const stopsNumber7 = number7GradientRef.current.querySelectorAll("stop");

      gsap.set(stopsNumber7, {
        attr: {
          offset: 1,
          "stop-color": "#D9D9D9",
        },
      });

      textSettingsMobile.forEach((setting, index) => {
        gsap.to(stopsNumber7[index], {
          attr: {
            offset: setting.offset,
            "stop-color": setting["stop-color"],
          },
          onComplete: () => {
            if (index === textSettingsMobile.length - 1) {
              gsap.to(number7Ref.current, {
                autoAlpha: 0,
                duration: 0.5,
                ease: "expo.inOut",
                onComplete: () => {
                  gsap.to(".intro-text-svg", {
                    autoAlpha: 1,
                    duration: 2,
                    ease: "expo.inOut",
                    onComplete: () => {
                      setIntroStoreDone(true);
                    },
                  });
                  textSettings.forEach((setting, index) => {
                    gsap.set(stopsText[index], {
                      attr: {
                        offset: setting.offset,
                        "stop-color": setting["stop-color"],
                      },
                    });
                  });
                },
              });
            }
          },
          duration: 2,
          ease: "expo.inOut",
          delay: setting.delay,
        });
      });
    } else {
      gsap.set(".intro-text-svg", {
        autoAlpha: 1,
      });

      textSettings.forEach((setting, index) => {
        gsap.to(stopsText[index], {
          attr: {
            offset: setting.offset,
            "stop-color": setting["stop-color"],
          },
          onComplete: () => {
            if (index === textSettings.length - 1) {
              setIntroStoreDone(true);
              setStartAnimation(true);
            }
          },
          duration: 2,
          ease: "expo.inOut",
          delay: setting.delay,
        });
      });
    }

    gsap.set(gradientContainerRef.current, {
      opacity: 1,
    });

    const stopsBG = bgGradientRef.current.querySelectorAll("stop");

    gsap.set(stopsBG, {
      attr: {
        offset: 0,
      },
    });

    bgSettingsPortuguese.forEach((setting, index) => {
      gsap.to(stopsBG[index], {
        attr: {
          offset: setting.offset,
        },
        duration: 2,
        ease: "expo.inOut",
        delay: setting.delay,
      });
    });
  }, [isLoading]);

  useGSAP(() => {
    if (isLoading) return;

    if (!bgGradientRef.current) return;
    const stopsBG = bgGradientRef.current.querySelectorAll("stop");

    if (currentStoreIndex > 0) {
      gsap.to("#clocks", {
        autoAlpha: 0,
        duration: dur,
        ease: "expo.inOut",
      });

      bgSettingsMin.forEach((setting, index) => {
        gsap.to(stopsBG[index], {
          attr: {
            offset: setting.offset,
          },
          duration: dur,
          ease: "expo.inOut",
        });
      });

      gsap.to(".intro-text-svg", {
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

      gsap.to(".intro-text-svg", {
        autoAlpha: 1,
        duration: dur,
        delay: delay,
        ease: "expo.inOut",
      });

      if (introStoreDone) {
        bgSettings.forEach((setting, index) => {
          gsap.to(stopsBG[index], {
            attr: {
              offset: setting.offset,
            },
            duration: dur,
            delay: delay,
            ease: "expo.inOut",
          });
        });
      }
    }
  }, [currentStoreIndex, isLoading, introStoreDone]);

  useGSAP(() => {
    if (!bgGradientRef.current || !gradientRef.current) return;
    const stopsBG = bgGradientRef.current.querySelectorAll("stop");
    const stopsText = gradientRef.current.querySelectorAll("stop");

    switch (language) {
      case "pt":
        bgSettingsPortuguese.forEach((setting, index) => {
          gsap.to(stopsBG[index], {
            attr: {
              offset: setting.offset,
              "stop-color": setting["stop-color"],
            },
            duration: 0.8,
            ease: "expo.inOut",
          });
        });

        textSettingsPortuguese.forEach((setting, index) => {
          gsap.to(stopsText[index], {
            attr: {
              offset: setting.offset,
              "stop-color": setting["stop-color"],
            },

            duration: 0.8,
            ease: "expo.inOut",
          });
        });
        break;
      default:
        bgSettings.forEach((setting, index) => {
          gsap.to(stopsBG[index], {
            attr: {
              offset: setting.offset,
              "stop-color": setting["stop-color"],
            },
            duration: 0.8,
            ease: "expo.inOut",
          });
        });

        textSettings.forEach((setting, index) => {
          gsap.to(stopsText[index], {
            attr: {
              offset: setting.offset,
              "stop-color": setting["stop-color"],
            },

            duration: 0.8,
            ease: "expo.inOut",
          });
        });
    }
  }, [language]);

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
      <div
        ref={gradientContainerRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 flex flex-col items-center justify-center  opacity-0"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1921 1080"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className="w-screen h-[100svh] lg:h-screen block"
          style={{ willChange: "transform" }}
        >
          {/* Background gradient with blur filter */}
          <g>
            <path
              d="M-109.691 -197.182H2030.31V1979.57H-109.691V-197.182Z"
              fill="url(#paint0_radial_1341_3951)"
              style={{ willChange: "transform" }}
            />
          </g>

          {/* Gradient definitions */}
          <defs>
            <radialGradient
              ref={bgGradientRef}
              id="paint0_radial_1341_3951"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(968.424 1112.87) rotate(90.4402) scale(1056.1 3391.94)"
            >
              <stop offset="0.0817308" stopColor="#03763B" /> {/* Dark green */}
              <stop offset="0.538462" stopColor="#7EFA50" />{" "}
              {/* Bright lime green */}
              <stop offset="0.817308" stopColor="#FEFFC2" />{" "}
              {/* Light yellow/cream */}
              <stop offset="1" stopColor="#D9D9D9" /> {/* Light gray */}
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="intro-text-svg fixed top-0 left-0 w-full h-full pointer-events-none z-0 flex flex-col items-center justify-start lg:justify-center px-1 lg:px-12 opacity-0">
        <svg
          ref={svgRef}
          viewBox="0 0 1921 1080"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="w-screen height-auto lg:h-screen block"
          style={{ willChange: "transform" }}
        >
          {/* Centered masked text with preserved aspect ratio */}
          <g transform="translate(305, 266)">
            <mask
              id="mask0_1341_3952"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1311"
              height="548"
            >
              <path
                d="M1277.45 132.743C1166.19 144.284 1073.1 195.281 1006.5 281.668C953.009 351.056 917.707 444.294 909.08 538.328H1040.27C1045.39 497.792 1061.17 424.367 1109.91 361.119C1144.38 316.376 1188.63 286.472 1241.95 271.605"
                fill="#1A1A1A"
              />
              <path
                d="M227.872 548C87.2027 548 4.95313 459.737 4.95313 315.445V182.667C4.95313 99.7759 4.18444 56.7955 0.341003 0H102.576C99.5017 55.2605 98.733 101.311 98.733 182.667V326.19C98.733 427.501 159.459 491.204 255.545 491.204C351.631 491.204 401.596 435.944 410.051 346.913C413.126 324.655 413.895 295.49 413.895 270.162C413.895 193.412 407.745 96.7059 396.984 0H455.404L454.635 309.305C453.867 459.737 369.311 548 227.872 548Z"
                fill="#1A1A1A"
              />
              <path
                d="M676.018 537.255H513.825C516.9 485.064 518.437 442.851 518.437 353.821V183.434C518.437 95.1709 516.9 52.1905 513.825 0H676.018C794.396 0 864.347 44.5154 864.347 123.569C864.347 188.039 819.763 236.392 736.744 250.207C837.442 259.417 886.638 306.235 886.638 383.753C886.638 478.157 808.232 537.255 676.018 537.255ZM670.637 234.09C729.826 234.09 772.873 191.877 772.873 130.476C772.873 69.0756 733.67 36.0728 671.406 36.0728H609.911V234.09H670.637ZM672.943 499.647C747.506 499.647 791.321 455.899 791.321 382.986C791.321 310.073 746.737 271.697 676.787 271.697H609.911V499.647H672.943Z"
                fill="#1A1A1A"
              />
              <path
                d="M1277.42 132.458H896.297L929.037 2.18066H1310.16L1277.42 132.458Z"
                fill="#1A1A1A"
              />
            </mask>

            {/* Gradient fill inside mask */}
            <g mask="url(#mask0_1341_3952)">
              <rect
                x="-47.5741"
                y="-180.542"
                width="1357.74"
                height="753.854"
                fill="url(#paint0_linear_1341_3952)"
              />
            </g>
          </g>

          {/* Gradient definitions */}
          <defs>
            <linearGradient
              ref={gradientRef}
              id="paint0_linear_1341_3952"
              x1="631.295"
              y1="-180.542"
              x2="631.295"
              y2="660.071"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.1875" stopColor="#D9D9D9" /> {/* Light gray */}
              <stop offset="0.307692" stopColor="#FEFFC2" />{" "}
              {/* Light yellow/cream */}
              <stop offset="0.639423" stopColor="#7EFA50" />{" "}
              {/* Bright lime green */}
              <stop offset="0.913462" stopColor="#09603D" />{" "}
              {/* Dark forest green */}
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="block lg:hidden fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center px-3 lg:px-12">
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
