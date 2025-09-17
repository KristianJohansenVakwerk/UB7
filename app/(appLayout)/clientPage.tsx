"use client";

import ScrollTrigger from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import SectionIntro from "./components/globals/Section/SectionIntro";
import {
  RefObject,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { portfolioData } from "./utils/data";
import SectionPortfolio from "./components/globals/Section/SectionPortfolio/SectionPortfolio";
import { useStore } from "@/store/store";

gsap.registerPlugin(Observer, ScrollTrigger, ScrollToPlugin);

export default function ObserverPage({
  data,
  lang = "en",
}: {
  data: any;
  lang?: string;
}) {
  const [globalCurrentIndex, setGlobalCurrentIndex] = useState(0);
  const [globalScrollDirection, setGlobalScrollDirection] =
    useState<boolean>(true);
  const [currentLang, setCurrentLang] = useState<string>(lang || "en");

  const [globalProgressAbout, setGlobalProgressAbout] = useState<number>(0);

  const sectionsContainer = useRef<HTMLDivElement>(null);
  const panels = useRef<HTMLDivElement[]>([]);
  const allowScroll = useRef<boolean>(true);
  const currentIndex = useRef<number>(0);
  const intentRef = useRef<any>(null);
  const scrollTimeout = useRef<any>(null);

  const {
    introStoreDone,
    setCurrentStoreIndex,
    aboutVideoExpanded,
    disableScroll,
    setIntroSplash,
  } = useStore();

  const aboutVideoExpandedHackRef = useRef<boolean>(false);

  useEffect(() => {
    aboutVideoExpandedHackRef.current = aboutVideoExpanded;
  }, [aboutVideoExpanded]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key == "Tab") {
        e.stopPropagation();
        e.preventDefault();
        return;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useGSAP(() => {
    allowScroll.current = true;
    currentIndex.current = 0;
    scrollTimeout.current = gsap
      .delayedCall(1, () => (allowScroll.current = true))
      .pause(); // controls how long we should wait after an Observer-based animation is initiated before we allow another scroll-related action

    panels.current = gsap.utils.toArray(".swipe-section .panel");
    // const swipeSectionInner = gsap.utils.toArray(".swipe-section-inner");
    gsap.set(panels.current, {
      yPercent: (i) => i * 100,
    });

    intentRef.current = ScrollTrigger.observe({
      type: "wheel,touch",
      preventDefault: true,
      onUp: (self: any) => {
        if (currentIndex.current === 3) return;
        allowScroll.current && scrollToSection(currentIndex.current + 1, true);
      },
      onDown: (self: any) => {
        console.log("onDown");
        allowScroll.current && scrollToSection(currentIndex.current - 1, false);
      },
      tolerance: ScrollTrigger.isTouch ? 10 : 10,
      ignore: "#aboutSlider",
      wheelSpeed: -1,
      // onChange: (self: any) => {
      //   if (!allowScroll.current) return;

      //   if (currentIndex.current === 2) {
      //     animateBox(self.deltaY, self.velocityY);
      //   }
      // },
      onEnable: (self: any) => {
        allowScroll.current = false;
        scrollTimeout.current.restart(true);
        // when enabling, we should save the scroll position and freeze it. This fixes momentum-scroll on Macs, for example.
        let savedScroll = self.scrollY();
        self._restoreScroll = () => self.scrollY(savedScroll); // if the native scroll repositions, force it back to where it should be
        document.addEventListener("scroll", self._restoreScroll, {
          passive: false,
        });
      },
      onDisable: (self: any) =>
        document.removeEventListener("scroll", self._restoreScroll),
    });

    intentRef.current.disable();
  }, []);

  // useGSAP(() => {
  //   if (!introStoreDone || disableScroll) return;

  //   // pin swipe section and initiate observer
  //   ScrollTrigger.create({
  //     trigger: ".swipe-section",
  //     pin: true,
  //     start: "top top",
  //     end: "+=200", // just needs to be enough to not risk vibration where a user's fast-scroll shoots way past the end
  //     onEnter: (self) => {
  //       if (intentRef.current.isEnabled) {
  //         return;
  //       } // in case the native scroll jumped past the end and then we force it back to where it should be.
  //       self.scroll(self.start + 1); // jump to just one pixel past the start of this section so we can hold there.
  //       intentRef.current.enable(); // STOP native scrolling
  //     },
  //     onEnterBack: (self) => {
  //       if (intentRef.current.isEnabled) {
  //         return;
  //       } // in case the native scroll jumped backward past the start and then we force it back to where it should be.
  //       self.scroll(self.end - 1); // jump to one pixel before the end of this section so we can hold there.
  //       intentRef.current.enable(); // STOP native scrolling
  //     },
  //   });
  // }, [introStoreDone, disableScroll]);

  useEffect(() => {
    if (!intentRef.current) return;

    if (disableScroll || !introStoreDone) {
      intentRef.current.disable();
    } else {
      intentRef.current.enable();
    }
  }, [disableScroll, introStoreDone]);

  const onEdgeReachedCB = useCallback((edge: "min" | "max") => {
    if (edge === "max") {
      currentIndex.current = 1;
      scrollToSection(currentIndex.current, false);
    } else if (edge === "min") {
      currentIndex.current = 3;
      scrollToSection(currentIndex.current, true);
    }
  }, []);

  const scrollToSection = (
    index: number,
    isScrollingDown: boolean,
    clicked?: boolean | undefined
  ) => {
    // For menu make sure it always animates

    if (clicked) {
      intentRef.current.enable();
      setIntroSplash(true);

      const tl = gsap.timeline({
        id: "scroll-to-section",
        paused: true,
      });

      /// DOES THIS MAKES SENSE?
      tl.to(document.getElementById("container"), {
        duration: 0.4,
        ease: "expo.inOut",
        opacity: 0,
      });

      tl.to(sectionsContainer?.current, {
        yPercent: -100 * index,
        duration: 0.75,
        delay: 0.4,
        force3D: true,
        ease: "expo.inOut",
      });

      /// DOES THIS MAKES SENSE?
      tl.to(document.getElementById("container"), {
        duration: 0.4,
        ease: "expo.inOut",
        opacity: 1,
      });

      tl.play();

      setGlobalCurrentIndex(index);
      setCurrentStoreIndex(index);
      setGlobalScrollDirection(isScrollingDown);

      currentIndex.current = index;
      return;
    }

    if (currentIndex.current === 2) {
      return;
    }

    if (index === panels.current.length && isScrollingDown) {
      intentRef.current.disable();
      return;
    }

    if (index === -1 && !isScrollingDown) {
      return;
    }

    allowScroll.current = false;
    scrollTimeout.current.restart(true);

    gsap.to(sectionsContainer?.current, {
      yPercent: -100 * index,
      duration: 0.75,
      force3D: true,
      delay: currentIndex.current === 0 && isScrollingDown ? 0 : 0.4,
      ease: "expo.inOut",
    });

    setGlobalCurrentIndex(index);
    setCurrentStoreIndex(index);
    setGlobalScrollDirection(isScrollingDown);
    currentIndex.current = index;
  };

  const handleMenuClick = (index: number) => {
    scrollToSection(index, true, true);
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  return (
    <>
      <div id={"container"} className={clsx("relative z-20")}>
        <div
          className={
            "swipe-section  relative w-screen h-[100svh] lg:h-screen overflow-hidden"
          }
        >
          <div
            ref={sectionsContainer}
            className="swipe-section-inner w-screen h-[100svh] lg:h-screen "
          >
            <section
              className={
                "panel intro absolute w-full h-full  flex justify-center items-center  "
              }
            >
              <SectionIntro inView={true} />
            </section>
            <section
              className={clsx(
                "panel portfolio absolute w-full h-full  flex justify-center items-center z-10 opacity-0",
                introStoreDone && "opacity-100"
              )}
            >
              <SectionPortfolio
                data={
                  data.find((item: any) => item._type === "sectionPortfolio")
                    ?.portfolio || []
                }
                currentIndex={currentIndex.current}
                lang={currentLang}
              />
            </section>

            <section
              className={clsx(
                "panel about absolute w-full h-full  flex justify-start items-start opacity-0 overflow-hidden",
                introStoreDone && "opacity-100"
              )}
            >
              <SectionAboutNew
                data={data.find((item: any) => item._type === "sectionAbout")}
                currentIndex={globalCurrentIndex}
                scrollingDown={globalScrollDirection}
                lang={currentLang}
                onEdgeReached={onEdgeReachedCB}
              />
            </section>

            <section
              className={clsx(
                "panel contact absolute w-full h-screen flex justify-center  items-center opacity-0",
                introStoreDone && "opacity-100"
              )}
            >
              <SectionContact
                data={data.find((item: any) => item._type === "sectionContact")}
                currentIndex={globalCurrentIndex}
                lang={currentLang}
              />
            </section>
          </div>
        </div>
      </div>

      <SectionTitles
        currentIndex={globalCurrentIndex}
        scrollingDown={globalScrollDirection}
        lang={currentLang}
        data={data}
      />

      {/* <IntroPixi /> */}
      <ProgressBars currentIndex={globalCurrentIndex} />

      <div
        className={clsx(
          "fixed bottom-2 lg:bottom-3 left-1 md:left-2 lg:left-3 right-1 md:right-2 lg:right-3 z-50 flex flex-row items-center justify-between",
          disableScroll ? "pointer-events-none" : "pointer-events-auto"
        )}
      >
        <Menu
          setCurrentIndex={handleMenuClick}
          currentIndex={globalCurrentIndex}
          data={data}
          lang={currentLang}
        />

        <LanguageSwitcher onLanguageChange={handleLanguageChange} />
      </div>
    </>
  );
}

////////////////////////////////////////////////////////////
// PROGRESS
////////////////////////////////////////////////////////////

const ProgressBars = ({ currentIndex }: { currentIndex: number }) => {
  return (
    <div
      id={"progress"}
      className={clsx(
        "fixed top-1 lg:top-2 left-1 md:left-2 lg:left-3 right-1 md:right-2 lg:right-3 h-[2px] lgh-[5px] z=[9999] flex flex-row z-50 gap-1 transition-opacity duration-700 delay-500 ease-in-out",
        currentIndex === 0 ? "opacity-0" : "opacity-100"
      )}
    >
      {Array(3)
        .fill(null)
        .map((_, index) => {
          const i = index + 1;

          if (i !== 2) {
            return (
              <div
                key={i}
                className={clsx("w-1/3 bg-white/40 backdrop-blur-sm  h-full")}
              >
                <div
                  className={clsx(
                    "h-full bg-white/80 rounded-progress-bar transition-all duration-700 ease-in-out",
                    i <= currentIndex ? "w-full" : "w-0"
                  )}
                />
              </div>
            );
          } else {
            return (
              <div
                key={i}
                className={clsx("w-1/3 bg-white/40 backdrop-blur-sm  h-full")}
              >
                <div
                  id={"about-progress"}
                  className={clsx(
                    "h-full bg-white/80 rounded-progress-bar w-0"
                  )}
                />
              </div>
            );
          }
        })}
    </div>
  );
};

////////////////////////////////////////////////////////////
// MENU
////////////////////////////////////////////////////////////

interface MenuItem {
  title: string;
  id?: string;
}

interface MenuProps {
  data: any[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  lang: string;
}
const Menu = ({ data, currentIndex, setCurrentIndex, lang }: MenuProps) => {
  const menuProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { introStoreDone, disableScroll } = useStore();

  const mappedData = useMemo(() => {
    return [
      { title: "UB7", id: "ub7" },
      ...data.map((item) => {
        return { title: item.title[lang], id: item.title.en.toLowerCase() };
      }),
    ];
  }, [data, lang]);

  useGSAP(() => {
    const setSize = (resize?: boolean) => {
      const targetElementMenu = document.getElementById(
        `${mappedData[currentIndex].id}-menu`
      );

      if (!targetElementMenu) return;

      gsap.to(menuProgressRef.current, {
        width: targetElementMenu.offsetWidth,
        x: targetElementMenu.offsetLeft,
        duration: resize ? 0 : 0.4,
        delay: resize ? 0 : 0.1,
        ease: "expo.inOut",
      });
    };

    setSize(false);

    const menu = menuRef.current;
    if (!menu) return;

    const followTween = gsap.to(menuProgressRef.current, {
      x: 0,
      duration: 0.4,
      ease: "expo.inOut",
      paused: true,
    });

    let debounceTimer: NodeJS.Timeout | null = null;
    let isHovering = false;
    let lastMousePosition = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!menuProgressRef.current || !menuRef.current) return;

      const container = menuRef.current;
      const box = menuProgressRef.current;
      const x = e.clientX - box.clientWidth / 2;
      const min = 0;
      const max = container.clientWidth - box.clientWidth;
      const steps = [0, 0.25, 0.5, 0.75];

      const xInRange = Math.max(Math.min(x, max), min);

      const pct = xInRange / container.clientWidth;
      const closest = steps.reduce((prev, curr) => {
        return Math.abs(curr - pct) < Math.abs(prev - pct) ? curr : prev;
      }, steps[0]);

      const newX = closest * container.clientWidth;
      lastMousePosition = newX;

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        followTween.vars.x = newX;
        followTween.invalidate().restart();
      }, 50);
    };

    const handleMouseEnter = () => {
      isHovering = true;

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        followTween.vars.x = lastMousePosition;
        followTween.invalidate().restart();
      }, 50);
    };

    const handleMouseLeave = () => {
      isHovering = false;

      // Clear debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }

      followTween.kill();

      setSize(false);
    };

    // Check if device supports hover (non-touch)
    const isNonTouch = window.matchMedia("(hover: hover)").matches;

    if (isNonTouch) {
      menu.addEventListener("mousemove", handleMouseMove);
      menu.addEventListener("mouseenter", handleMouseEnter);
      menu.addEventListener("mouseleave", handleMouseLeave);
    }

    window.addEventListener("resize", () => setSize(true));

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      followTween.kill();

      window.removeEventListener("resize", () => setSize(true));

      if (isNonTouch) {
        menu.removeEventListener("mousemove", handleMouseMove);
        menu.removeEventListener("mouseenter", handleMouseEnter);
        menu.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [currentIndex]);

  return (
    <div
      ref={menuRef}
      className={clsx(
        "  transition-opacity duration-600 ease-in-out",
        !introStoreDone || disableScroll
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto"
      )}
      style={{ zIndex: 9999 }}
      id={"menu"}
    >
      <div className="relative h-full w-full bg-white/40 backdrop-blur-sm rounded-menu">
        <div className="flex flex-row items-center ">
          {mappedData.map((item, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="font-sans text-sm text-dark-grey min-w-[60px] lg:min-w-[100px] px-[10px] py-[10px] rounded-menu flex items-center justify-center z-10 cursor-pointer"
              id={`${item.id}-menu`}
            >
              <span>{item.title}</span>
            </div>
          ))}
        </div>
        <div
          ref={menuProgressRef}
          className="absolute bottom-0 left-0 h-full w-[100px] bg-white/80 rounded-menu"
        />
      </div>
    </div>
  );
};

////////////////////////////////////////////////////////////
// LANGUAGE SWITCHER
////////////////////////////////////////////////////////////

const data = [
  {
    title: "EN",
    id: "en",
  },
  {
    title: "PT",
    id: "pt",
  },
];

const LanguageSwitcher = ({
  onLanguageChange,
}: {
  onLanguageChange: (lang: string) => void;
}) => {
  const langProgressRef = useRef<HTMLDivElement>(null);
  const { introStoreDone, language, setLanguage, disableScroll } = useStore();

  useGSAP(() => {
    if (language === "pt") {
      gsap.to(langProgressRef.current, {
        x: ScrollTrigger.isTouch ? 40 : 60,
        duration: 0.8,
        ease: "expo.inOut",
      });
    } else {
      gsap.to(langProgressRef.current, {
        x: 0,
        duration: 0.8,
        ease: "expo.inOut",
      });
    }
  }, [language]);

  const handleLanguageChange = () => {
    const lang = language === "en" ? "pt" : "en";
    setLanguage(lang);
    onLanguageChange(lang);
  };

  return (
    <div
      className={clsx(
        "transition-opacity duration-600 ease-in-out",

        !introStoreDone || disableScroll
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto"
      )}
      style={{ zIndex: 9999 }}
      id={"language"}
      onClick={handleLanguageChange}
    >
      <div className="relative h-full w-full bg-white/40 backdrop-blur-sm rounded-menu">
        <div className="flex flex-row items-center ">
          {data.map((item, index) => (
            <div
              key={index}
              className="font-sans text-sm text-dark-grey min-w-[35px] lg:min-w-[60px] px-[10px] py-[10px] rounded-menu flex items-center justify-center z-10 cursor-pointer"
              id={`${item.id}-lang`}
            >
              <span>{item.title}</span>
            </div>
          ))}
        </div>
        <div
          ref={langProgressRef}
          className="absolute bottom-0 left-0 h-full w-[35px] lg:w-[60px] bg-white/80 rounded-menu"
        />
      </div>
    </div>
  );
};

import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

////////////////////////////////////////////////////////////
// SECTION TITLES
////////////////////////////////////////////////////////////

const SectionTitles = ({
  currentIndex,
  scrollingDown,
  lang,
  data,
}: {
  currentIndex: number;
  scrollingDown: boolean;
  lang: string;
  data: any;
}) => {
  const timelineRefs = useRef<any[]>([]);
  const localScollingDown = useRef(scrollingDown);
  const splitTextRefs = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLangRef = useRef(lang);
  const headlinesRef = useRef<any[]>([]);
  const isInitialized = useRef(false);
  const localCurrentIndexRef = useRef(currentIndex);
  const { setGlobalFrom, setGlobalTo, introStoreDone } = useStore();

  const createHeadline = (curLang: string) => {
    console.log("Create Headline");

    headlinesRef.current = [
      { text: "", id: "ub7" },
      ...data.map((item: any) => {
        return {
          text: richTextToHTML(checkLangString(curLang, item.headline))
            .replace(/<\/?[^>]+>/g, "")
            .replace(/\n/g, " "),
        };
      }),
    ];
  };

  const generateDomContent = useCallback(() => {
    console.log("Generate Dom Content");

    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    headlinesRef.current.forEach((headline, index) => {
      const h1 = document.createElement("h1");
      h1.className =
        "splitText text-title absolute h-auto  w-full md:w-3/4 lg:w-4/5 xl:w-1/2 2xl:w-1/2";

      h1.innerHTML = headline.text;
      containerRef?.current?.appendChild(h1);
    });
  }, []);

  // const handleSplit = (self: any) => {
  //   if (!localCurrentIndexRef.current || !timelineRefs.current) return;

  //   const timelines = timelineRefs.current;

  //   setTimeout(() => {
  //     console.log("Handle split reset", self.lines);
  //     // reset all timelines
  //     timelines.forEach((tl) => tl.reverse(1)); // pause and reset

  //     // Seek to the end of the current timeline on split
  //     // timelines[localCurrentIndexRef.current].seek(1);
  //   }, 1000);
  // };

  // Setup animations
  const setupAnimations = useCallback(() => {
    console.log("Setup Animations");

    const textElements = gsap.utils.toArray(".splitText");

    textElements.forEach((t, index) => {
      const tl = gsap.timeline({ id: `tl-${index}-${lang}`, paused: true });

      const st = SplitText.create(t as HTMLElement, {
        type: "lines",
        preserveSpaces: true,
        preserveNewlines: true,
        autoSplit: true,
        linesClass: "w-full",
        onSplit: (self: any) => {
          // handleSplit(self);
        },
      });

      // Set initial state for all lines
      gsap.set(st.lines, {
        y: -30,
        autoAlpha: 0,
      });

      tl.add(
        gsap.to(st.lines, {
          y: 0,
          autoAlpha: 1,
          duration: 0.2,
          stagger: 0.05,
          delay: 0.6,
          overwrite: "auto",
          ease: "power4.out",
        })
      );

      timelineRefs.current.push(tl);
    });
  }, []);

  const resetCurrentTimeline = useCallback(
    (onComplete?: () => void) => {
      const currentTimeline = timelineRefs.current[currentIndex];
      console.log("Current timeline", currentTimeline);
      currentTimeline.reverse();
      currentTimeline.eventCallback("onReverseComplete", () => {
        onComplete?.();
      });
    },
    [currentIndex]
  );

  const killAllSplitTexts = () => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    timelineRefs.current.forEach((tl) => tl.kill());
    timelineRefs.current = [];
  };

  useGSAP(() => {
    localScollingDown.current = scrollingDown;
  }, [scrollingDown]);

  useGSAP(() => {
    if (!introStoreDone) return;

    const handleResize = () => {
      if (!containerRef.current) return;

      containerRef.current.style.opacity = "0";
      killAllSplitTexts();
      createHeadline(lang);

      generateDomContent();
      setTimeout(() => {
        setupAnimations();
      }, 0);

      setTimeout(() => {
        if (!containerRef.current) return;
        containerRef.current.style.opacity = "1";

        timelineRefs.current[localCurrentIndexRef.current].play();
      }, 1000);
    };

    createHeadline(lang);
    generateDomContent();
    // Wait for next frame to ensure DOM is updated
    setTimeout(() => {
      setupAnimations();
      isInitialized.current = true;
    }, 0);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [introStoreDone]);

  useGSAP(() => {
    if (prevLangRef.current !== lang) {
      resetCurrentTimeline(() => {
        if (!containerRef.current) return;
        containerRef.current.style.opacity = "0";
        killAllSplitTexts();
        createHeadline(lang);

        generateDomContent();
        setTimeout(() => {
          setupAnimations();
        }, 0);

        setTimeout(() => {
          if (!containerRef.current) return;
          containerRef.current.style.opacity = "1";
          timelineRefs.current[currentIndex].play();
        }, 100);
      });
      prevLangRef.current = lang;
    }
  }, [lang]);

  const previousIndex = useRef(currentIndex); // Track the last visible index

  useGSAP(() => {
    const from = previousIndex.current;
    const to = currentIndex;
    const direction = to > from ? "forward" : "backward";

    // Store the global from and to for use in other components eg. About section animation controller
    setGlobalFrom(from);
    setGlobalTo(to);

    if (from === to) return;

    const timelines = timelineRefs.current;
    const prevTimeline = timelines[from];
    const currentTimeline = timelines[to];

    const resetAll = () => {
      timelines.forEach((tl) => tl.pause(0)); // pause and reset
    };

    if (!currentTimeline || !isInitialized.current) {
      previousIndex.current = to;
      localCurrentIndexRef.current = to;
      return;
    }

    if (direction === "forward" && from === 0) {
      currentTimeline.play();
    } else if (direction === "backward" && from === 0) {
      currentTimeline.reverse();
      currentTimeline.eventCallback("onReverseComplete", () => {
        resetAll();
      });
    } else if (
      direction === "backward" &&
      to === 2 &&
      window.innerWidth < 768
    ) {
      // This is the hack for mobile about section animation controller, not pretty.
      gsap.delayedCall(0.5, () => {
        gsap.set(".section-title", { autoAlpha: 0 });
      });

      prevTimeline.reverse();
      prevTimeline.eventCallback("onReverseComplete", () => {
        currentTimeline.play();
      });
    } else {
      prevTimeline.reverse();
      prevTimeline.eventCallback("onReverseComplete", () => {
        currentTimeline.play();
      });
    }

    if (to === 1) {
      gsap.delayedCall(0.5, () => {
        gsap.set(".section-title", { autoAlpha: 1 });
      });
    }

    previousIndex.current = to;
    localCurrentIndexRef.current = to;
  }, [currentIndex, lang]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "section-title fixed top-3 lg:top-6 left-1 md:left-2 lg:left-3 right-1 md:right-2 lg:right-3  h-auto z-20 pointer-events-none opacity-0"
      )}
    />
  );
};

////////////////////////////////////////////////////////////
// SECTION CONTACT
////////////////////////////////////////////////////////////

import Link from "next/link";
import SectionAboutNew from "./components/globals/Section/SectionAboutNew/SectionAboutNew";
import { checkLangString, richTextToHTML } from "./utils/utils";
import { useTimelineSelector } from "sanity";

const info = [
  {
    title: "Social",
    items: [
      {
        label: "Linkedin",
        url: "https://www.linkedin.com/in/thiagosilva",
      },
      {
        label: "Instagram",
        url: "https://www.instagram.com/thiagosilva",
      },
    ],
  },
  {
    title: "E-mail",
    items: [
      {
        label: "info@ub7.com",
        url: "mailto:info@ub7.com",
      },
    ],
  },
  {
    title: "Address",
    items: [
      {
        label: (
          <p>
            Carrer de la Llum, 24, 3º 2ª <br /> 08002 Madrid <br /> España
          </p>
        ),
      },
    ],
  },
];

const SectionContact = ({
  data,
  currentIndex,
  lang,
}: {
  data: any;
  currentIndex: number;
  lang: string;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const tlRef = useRef<any>(null);

  if (!data) return <></>;

  const infoData = useMemo(() => {
    const infoObjs = {
      social: {
        label: lang === "en" ? "social" : "redes sociais",
        items: data.social,
      },
      email: {
        label: lang === "en" ? "email" : "email",
        title: data.email.title,
        url: data.email.link,
      },
      address: {
        label: lang === "en" ? "address" : "endereço",
        title: data.address.title,
        url: data.address.link,
      },
    };

    return Object.values(infoObjs);
  }, [data, lang]);

  useGSAP(() => {
    const contactItems = gsap.utils.toArray(".contact-title");
    const contactLabels = gsap.utils.toArray(".contact-label");

    tlRef.current = gsap.timeline({
      id: "contact-animation",
      paused: true,
    });

    // Animate each info item
    info.forEach((item, index) => {
      const titleElement = contactItems[index] as HTMLElement;
      if (titleElement) {
        const splitTitle = new SplitText(titleElement, {
          type: "lines",
          linesClass: "split-line",
        });

        tlRef.current.add(
          gsap.from(splitTitle.lines, {
            opacity: 0,
            y: 5,
            duration: 0.2,
            stagger: 0.1,
            ease: "power4.out",
          })
        );
      }

      // Animate each label in the item
      item.items.forEach((_, linkIndex) => {
        const refIndex =
          info
            .slice(0, index)
            .reduce((acc, section) => acc + section.items.length, 0) +
          linkIndex;
        const label = contactLabels[refIndex] as HTMLElement;
        if (label) {
          const splitLabel = new SplitText(label, {
            type: "lines",
            linesClass: "split-line",
          });

          tlRef.current.add(
            gsap.fromTo(
              splitLabel.lines,
              { autoAlpha: 0 },
              {
                autoAlpha: 1,
                y: 5,
                duration: 0.2,
                stagger: 0.1,
                ease: "power4.out",
              }
            )
          );
        }
      });
    });

    tlRef.current.pause();
  });

  useGSAP(() => {
    console.log("Current index", currentIndex, tlRef.current);
    if (currentIndex === 3 && tlRef.current) {
      gsap.delayedCall(1.2, () => {
        console.log("Playing contact animation");
        tlRef.current.play();
      });
    } else if (tlRef.current) {
      tlRef.current.reverse();
    }
  }, [currentIndex]);

  return (
    <div
      ref={container}
      className=" w-full h-full flex flex-col gap-0 items-start justify-start px-1 lg:px-3 pt-0 lg:mt-[40vw]"
    >
      <div className="grid grid-cols-16 w-full gap-3 lg:gap-0">
        {/* {info.map((item, index) => {
          return (
            <div
              key={index}
              className="contact-item col-span-16 lg:col-span-3 xl:col-span-2 info-item flex flex-col opacity-100 gap-0"
            >
              <div className="contact-title font-mono text-sm text-light-grey">
                {item.title}
              </div>

              <div className="flex flex-col gap-0">
                {item.items.map((link: any, linkIndex: number) => {
                  const refIndex =
                    info
                      .slice(0, index)
                      .reduce((acc, section) => acc + section.items.length, 0) +
                    linkIndex;
                  return (
                    <div
                      key={linkIndex}
                      className="contact-label cursor-pointer font-sans text-base text-light-grey"
                    >
                      <Link href={link?.url || "#"} target="_blank">
                        {link.label}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })} */}

        {infoData.map((item: any, index) => {
          switch (item.label) {
            case "address":
            case "email":
              return (
                <div
                  key={index + lang}
                  className="col-span-16 lg:col-span-3 xl:col-span-2 info-item flex flex-col opacity-100 gap-0"
                >
                  <div className="contact-title font-mono text-sm text-light-grey">
                    {item.label}
                  </div>

                  <div className="contact-label cursor-pointer font-sans text-base text-light-grey">
                    <Link href={item?.url || "#"} target="_blank">
                      {item.title}
                    </Link>
                  </div>
                </div>
              );

            case "social":
              return (
                <div
                  key={index + lang}
                  className="col-span-16 lg:col-span-3 xl:col-span-2 info-item flex flex-col opacity-100 gap-0"
                >
                  <div className="contact-title font-mono text-sm text-light-grey">
                    {item.label}
                  </div>

                  <div className="flex flex-col gap-0">
                    {item.items.map((link: any, linkIndex: number) => {
                      return (
                        <div
                          key={linkIndex}
                          className="contact-label cursor-pointer font-sans text-base text-light-grey"
                        >
                          <Link href={link?.link || "#"} target="_blank">
                            {link.title}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
          }
        })}
      </div>
    </div>
  );
};
