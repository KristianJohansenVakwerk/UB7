"use client";

import ScrollTrigger from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import IntroPixi from "../components/globals/IntroPixi/IntroPixi";
import SectionIntro from "../components/globals/Section/SectionIntro";
import { use, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { portfolioData } from "../utils/data";
import SectionPortfolio from "../components/globals/Section/SectionPortfolio/SectionPortfolio";
import { useStore } from "@/store/store";
import IntroSVG from "../components/globals/IntroSVG/IntroSVG";

import { sectionsData } from "../utils/data";

gsap.registerPlugin(Observer, ScrollTrigger, ScrollToPlugin);

export default function ObserverPage() {
  const [globalCurrentIndex, setGlobalCurrentIndex] = useState(0);
  const [globalScrollDirection, setGlobalScrollDirection] =
    useState<boolean>(true);

  const [globalProgressAbout, setGlobalProgressAbout] = useState<number>(0);

  const sectionsContainer = useRef<HTMLDivElement>(null);
  const panels = useRef<HTMLDivElement[]>([]);
  const allowScroll = useRef<boolean>(true);
  const currentIndex = useRef<number>(0);
  const intentRef = useRef<any>(null);
  const scrollTimeout = useRef<any>(null);
  const introStoreDone = useStore((state) => state.introStoreDone);
  const { setCurrentStoreIndex, aboutVideoExpanded, disableScroll } =
    useStore();

  const aboutVideoExpandedHackRef = useRef<boolean>(false);

  useEffect(() => {
    aboutVideoExpandedHackRef.current = aboutVideoExpanded;
  }, [aboutVideoExpanded]);

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
        allowScroll.current && scrollToSection(currentIndex.current + 1, true);
      },
      onDown: (self: any) => {
        allowScroll.current && scrollToSection(currentIndex.current - 1, false);
      },
      tolerance: ScrollTrigger.isTouch ? 10 : 10,
      wheelSpeed: -1,
      onChange: (self: any) => {
        if (!allowScroll.current) return;

        if (currentIndex.current === 2) {
          animateBox(self.deltaY, self.velocityY);
        }
      },
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

    let currentX = 0;
    let targetX = 0;
    let animating = false;

    // const box = gsap.utils.toArray(".about-box");
    const box = document.querySelector(".about-box") as HTMLElement;
    const aboutProgress = document.getElementById(
      "about-progress"
    ) as HTMLElement;
    const setX = gsap.quickSetter(box, "x", "px");
    const setW = gsap.quickSetter(aboutProgress, "width", "%");

    const boxWidth = box?.offsetWidth;
    const gap = 48;
    const minX = -(boxWidth - window.innerWidth + gap * 2);
    const maxX = 0;

    const lerp = (start: number, end: number, amt: number) =>
      start + (end - start) * amt;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const onEdgeReached = (edge: "min" | "max") => {
      if (edge === "max") {
        currentIndex.current = 1;
        scrollToSection(currentIndex.current, false);
      } else if (edge === "min") {
        currentIndex.current = 3;
        scrollToSection(currentIndex.current, true);
      }

      isAtMin = false;
      isAtMax = false;
      edgeAttempt = 0;
    };

    const isTouchDevice = ScrollTrigger.isTouch;

    let edgeAttempt = 0;
    let isAtMin = false;
    let isAtMax = false;

    const animateBox = (deltaY: number, velocityY: number) => {
      if (!box || aboutVideoExpandedHackRef.current) return;

      const direction = deltaY > 0 ? -1 : 1;
      const baseSpeed = isTouchDevice ? 160 : 180;
      const maxDistance = isTouchDevice ? 60 : 58;

      const distance = Math.min(Math.abs(velocityY * baseSpeed), maxDistance); // Feel free to tweak
      targetX -= direction * distance;

      const pct = Math.min(100, (Math.abs(targetX) / Math.abs(minX)) * 100);
      // setGlobalProgressAbout(pct);

      const newTargetX = targetX - direction * distance;
      const nextTargetX = newTargetX + direction * distance;

      // Overscroll at left edge
      if (nextTargetX < minX) {
        targetX = minX;

        if (!isAtMin) {
          edgeAttempt++;
          if (edgeAttempt >= 40) {
            isAtMin = true;
            isAtMax = false;
            edgeAttempt = 0;
            onEdgeReached("min");
          }
        }
        return;
      }

      // Overscroll at right edge
      if (nextTargetX > maxX) {
        targetX = maxX;

        if (!isAtMax) {
          edgeAttempt++;
          if (edgeAttempt >= 40) {
            isAtMax = true;
            isAtMin = false;
            edgeAttempt = 0;
            onEdgeReached("max");
          }
        }
        return;
      }

      targetX = clamp(targetX, minX, maxX);

      if (!animating) {
        animateLoop();
      }
    };

    const animateLoop = () => {
      animating = true;

      const update = () => {
        currentX = lerp(currentX, targetX, 0.1); // 0.1 = smoothing factor
        const pct = Math.min(100, (Math.abs(targetX) / Math.abs(minX)) * 100);

        setX(currentX, minX);
        setW(pct);

        if (Math.abs(currentX - targetX) > 0.5) {
          requestAnimationFrame(update);
        } else {
          animating = false;
        }
      };

      requestAnimationFrame(update);
    };
  }, []);

  useEffect(() => {
    if (!intentRef.current) return;
    if (introStoreDone) {
      intentRef.current.enable();
    }
  }, [introStoreDone]);

  useEffect(() => {
    if (!intentRef.current) return;
    if (disableScroll) {
      intentRef.current.disable();
    } else if (introStoreDone) {
      intentRef.current.enable();
    }
  }, [disableScroll, introStoreDone]);

  const scrollToSection = (
    index: number,
    isScrollingDown: boolean,
    clicked?: boolean | undefined
  ) => {
    // For menu make sure it always animates
    console.log("clicked", clicked, isScrollingDown);
    if (clicked) {
      intentRef.current.enable();
      gsap.to(sectionsContainer?.current, {
        yPercent: -100 * index,
        duration: 0.75,
        force3D: true,
        delay: currentIndex.current === 0 && isScrollingDown ? 0 : 0.4,
        ease: "expo.inOut",
      });
      setGlobalCurrentIndex(index);
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

  return (
    <>
      <div className={clsx("relative z-20")}>
        <div
          className={
            "swipe-section  relative w-screen h-[100svh] lg:h-screen overflow-hidden "
          }
        >
          <div
            ref={sectionsContainer}
            className="swipe-section-inner w-screen h-screen "
          >
            <section
              className={
                "panel intro absolute w-full h-full  flex justify-center items-center "
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
                data={portfolioData}
                currentIndex={currentIndex.current}
              />
            </section>

            <section
              className={clsx(
                "panel about absolute w-full h-full  flex justify-start items-start opacity-0",
                introStoreDone && "opacity-100"
              )}
            >
              <SectionAbout
                currentIndex={globalCurrentIndex}
                scrollingDown={globalScrollDirection}
              />
            </section>

            <section
              className={clsx(
                "panel contact absolute w-full h-screen flex justify-center  items-center opacity-0",
                introStoreDone && "opacity-100"
              )}
            >
              <SectionContact currentIndex={globalCurrentIndex} />
            </section>
          </div>
        </div>
      </div>

      <SectionTitles
        currentIndex={globalCurrentIndex}
        scrollingDown={globalScrollDirection}
      />

      {/* <IntroPixi /> */}
      <ProgressBars currentIndex={globalCurrentIndex} />
      <Menu
        setCurrentIndex={handleMenuClick}
        currentIndex={globalCurrentIndex}
        data={[
          { title: "UB7", id: "intro" },
          { title: "Portfolio", id: "portfolio" },
          { title: "About", id: "about" },
          { title: "Contact", id: "contact" },
        ]}
      />
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
        "fixed top-2 left-3 right-3 h-[5px] z=[9999] flex flex-row z-50 gap-1 transition-opacity duration-700 delay-500 ease-in-out",
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
  data: MenuItem[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}
const Menu = ({ data, currentIndex, setCurrentIndex }: MenuProps) => {
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const menuProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { introStoreDone } = useStore();

  useGSAP(() => {
    const menuItems = gsap.utils.toArray(".menu-item");

    const targetElement = menuItems[currentIndex];
    const targetElementMenu = document.getElementById(
      `${data[currentIndex].id}-menu`
    );

    if (!targetElementMenu) return;

    gsap.to(menuProgressRef.current, {
      width: targetElementMenu.offsetWidth,
      x: targetElementMenu.offsetLeft,
      duration: 0.8,
      delay: 0.2,
      ease: "expo.inOut",
    });
  }, [currentIndex]);

  return (
    <div
      ref={menuRef}
      className={clsx(
        "fixed bottom-3 left-3  opacity-0 transition-opacity duration-300 ease-in-out",
        introStoreDone && "opacity-100"
      )}
      style={{ zIndex: 9999 }}
      id={"menu"}
    >
      <div className="relative h-full w-full bg-white/40 backdrop-blur-sm rounded-menu">
        <div className="flex flex-row items-center ">
          {data.map((item, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="font-sans text-sm text-dark-grey min-w-[100px] px-[10px] py-[10px] rounded-menu flex items-center justify-center z-10 cursor-pointer"
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

import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

////////////////////////////////////////////////////////////
// SECTION TITLES
////////////////////////////////////////////////////////////

const SectionTitles = ({
  currentIndex,
  scrollingDown,
}: {
  currentIndex: number;
  scrollingDown: boolean;
}) => {
  const timelineRefs = useRef<any[]>([]);
  const localScollingDown = useRef(scrollingDown);
  const { introStoreDone } = useStore();

  useGSAP(() => {
    const textElements = gsap.utils.toArray(".splitText");

    textElements.forEach((t, index) => {
      const tl = gsap.timeline({ id: `tl-${index}`, paused: true });

      const st = SplitText.create(t as HTMLElement, {
        type: "lines",
        preserveSpaces: true,
        preserveNewlines: true,
      });

      tl.add(
        gsap.from(st.lines, {
          y: -30,
          opacity: 0,
          duration: 0.2,
          stagger: 0.05,
          delay: 0.6,
          overwrite: "auto",
          autoKill: true,
          ease: "power4.out",
        })
      );

      timelineRefs.current.push(tl);
    });
  }, []);

  useGSAP(() => {
    localScollingDown.current = scrollingDown;
  }, [scrollingDown]);

  const previousIndex = useRef(currentIndex); // Track the last visible index

  useGSAP(() => {
    const from = previousIndex.current;
    const to = currentIndex;
    const direction = to > from ? "forward" : "backward";

    if (from === to) return;

    const timelines = timelineRefs.current;
    const prevTimeline = timelines[from];
    const currentTimeline = timelines[to];

    const resetAll = () => {
      console.log("resetAll");
      timelines.forEach((tl) => tl.pause(0)); // pause and reset
    };

    if (direction === "forward" && from === 0) {
      currentTimeline.play();
    } else if (direction === "backward" && from === 0) {
      currentTimeline.reverse();
      currentTimeline.eventCallback("onReverseComplete", () => {
        resetAll();
      });
    } else {
      prevTimeline.reverse();
      prevTimeline.eventCallback("onReverseComplete", () => {
        currentTimeline.play();
      });
    }

    previousIndex.current = to;
  }, [currentIndex]);

  return (
    <div
      className={clsx(
        "section-title fixed top-5 left-3 z-20  pointer-events-none opacity-0",
        introStoreDone && "opacity-100"
      )}
    >
      <h1 className="text-sm lg:text-title">
        {sectionsData.map((section) => (
          <div
            key={section.id}
            className="splitText opacity-100 absolute w-screen h-auto"
          >
            {section?.text?.split("<br>").map((line: any, index: number) => (
              <span className={clsx("text-dark-grey ")} key={index}>
                {line}
                {index < section?.text?.split("<br>").length - 1 && <br />}
              </span>
            ))}
          </div>
        ))}
      </h1>
    </div>
  );
};

////////////////////////////////////////////////////////////
// SECTION CONTACT
////////////////////////////////////////////////////////////

import Link from "next/link";

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

const SectionContact = ({ currentIndex }: { currentIndex: number }) => {
  const container = useRef<HTMLDivElement>(null);
  const tlRef = useRef<any>(null);

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
            gsap.from(splitLabel.lines, {
              opacity: 0,
              y: 5,
              duration: 0.2,
              stagger: 0.1,
              ease: "power4.out",
            })
          );
        }
      });
    });

    tlRef.current.pause();
  });

  useGSAP(() => {
    if (currentIndex === 3 && tlRef.current) {
      gsap.delayedCall(2.2, () => {
        tlRef.current.play();
      });
    } else if (tlRef.current) {
      tlRef.current.reverse();
    }
  }, [currentIndex]);

  return (
    <div
      ref={container}
      className=" w-full h-full flex flex-col gap-0 items-start justify-start px-3 mt-[40vw]"
    >
      <div className="grid grid-cols-16 w-full gap-3 lg:gap-0">
        {info.map((item, index) => {
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
        })}
      </div>
    </div>
  );
};

////////////////////////////////////////////////////////////
// SECTION ABOUT
////////////////////////////////////////////////////////////

import { teamMembers } from "../utils/data";
import { TeamMembers } from "../components/globals/Section/SectionAbout/SectionAbout";

const SectionAbout = ({
  currentIndex,
  scrollingDown,
}: {
  currentIndex: number;
  scrollingDown: boolean;
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const tlAboutTextRef = useRef<any>(null);
  const tlAboutSlideshowRef = useRef<any>(null);
  const [showClose, setShowClose] = useState(false);
  const clickCloseRef = useRef<HTMLDivElement | null>(null);

  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { setAboutVideoExpanded } = useStore();

  const items = useMemo(() => {
    return [{ type: "box" }, ...teamMembers];
  }, []);

  useGSAP(() => {
    tlAboutTextRef.current = gsap.timeline({
      paused: true,
    });

    tlAboutSlideshowRef.current = gsap.timeline({
      paused: true,
    });

    const splitText = new SplitText(textRef.current, {
      type: "lines",
      linesClass: "split-line",
    });

    tlAboutTextRef.current.add(
      gsap.from(splitText.lines, {
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "sine.inOut",
      })
    );

    tlAboutSlideshowRef.current.add(
      gsap.to(".item", {
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
        ease: "expo.inOut",
      })
    );
  }, []);

  useGSAP(() => {
    if (currentIndex === 2 && tlAboutTextRef.current) {
      gsap.delayedCall(2.2, () => {
        tlAboutTextRef.current.play();
      });
      gsap.delayedCall(2.7, () => {
        tlAboutSlideshowRef.current.play();
      });
    } else if (tlAboutTextRef.current && !scrollingDown) {
      tlAboutTextRef.current.reverse();
    }
  }, [currentIndex, scrollingDown]);

  useGSAP(() => {
    if (!imageContainerRef.current || !clickCloseRef.current) return;

    let isScaled = false;

    const handleResize = () => {
      if (!isScaled || !imageRef.current) return;

      const image = imageRef.current;
      const imageWidth = image.offsetWidth;
      const imageHeight = image.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const availableWidth = windowWidth - (48 + 100); // 48px left, 100px right
      const availableHeight = windowHeight - (48 + 48); // 48px top and bottom

      const widthScale = availableWidth / imageWidth;
      const heightScale = availableHeight / imageHeight;
      const scale = Math.min(widthScale, heightScale);

      gsap.to(image, {
        scale: scale,
        duration: 0.3,
        ease: "power2.inOut",
      });
    };

    const handleClick = (state: boolean) => {
      isScaled = state;
      const image = imageRef.current;
      const imageWidth = image?.offsetWidth as number;
      const imageHeight = image?.offsetHeight as number;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const padding = { top: 48, left: 48, button: 48, right: 102 };

      setAboutVideoExpanded(state);

      const availableWidth = vw - (padding.left + padding.right);
      const availableHeight = vh - (padding.top + padding.button);

      const scaleX = availableWidth / imageWidth;
      const scaleY = availableHeight / imageHeight;

      const scale = Math.min(scaleX, scaleY);

      if (state) {
        gsap.to(".about-box", {
          id: "about-box-reset",
          x: 0,
          duration: 0.5,
          ease: "expo.inOut",
          onComplete: () => {
            gsap.to(
              [
                "#progress",
                "#menu",
                "#section-title-about",
                ".text-about",
                ".item-team-member",
                ".section-title",
              ],
              {
                autoAlpha: 0,
                duration: 0.4,
                delay: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                  setShowClose(true);
                  gsap.to(imageContainerRef.current, {
                    opacity: 1,
                    duration: 0.8,
                    ease: "power4.inOut",
                  });
                  gsap.to(image, {
                    scale: scale,
                    y: 112 - padding.top,
                    transformOrigin: "left bottom",
                    willChange: "transform",
                    duration: 0.8,
                    ease: "power4.inOut",
                    onComplete: () => {
                      setShowClose(true);
                    },
                  });
                },
              }
            );
          },
        });
      } else {
        setShowClose(false);

        gsap.to(
          [
            "#progress",
            "#menu",
            "#section-title-about",
            ".text-about",
            ".item",
            ".section-title",
          ],
          {
            autoAlpha: 1,
            duration: 0.4,
            delay: 0.5,
            ease: "power2.inOut",
          }
        );
        gsap.to(imageRef.current, {
          scale: 1,
          y: 0,
          transformOrigin: "left bottom",
          duration: 0.8,
          ease: "power4.inOut",
          onComplete: () => {},
        });
      }
    };

    clickCloseRef.current.addEventListener("click", () => handleClick(false));
    imageContainerRef.current.addEventListener("click", () =>
      handleClick(true)
    );
    window.addEventListener("resize", handleResize);

    return () => {
      clickCloseRef.current?.removeEventListener("click", () =>
        handleClick(false)
      );
      imageContainerRef.current?.removeEventListener("click", () =>
        handleClick(true)
      );
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="about-section w-full h-full flex flex-col gap-0 items-start justify-start px-3 mt-[40vw]">
      <div
        ref={textRef}
        className="text-about absolute top-6 right-3 w-1/3 text-light-grey text-base/none"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div>

      <div className="about-box absolute bottom-8 left-3 left-0  flex justify-center items-center gap-4 will-change-transform opacity-100">
        <TeamMembers
          items={items}
          imageContainerRef={imageContainerRef}
          imageRef={imageRef}
        />
      </div>

      <div
        ref={clickCloseRef}
        className={clsx(
          "fixed top-2 right-2 z-[9999] w-[48px] h-[48px] rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md  flex items-center justify-center text-dark-grey cursor-pointer opacity-0 transition-all duration-300 ease",
          showClose && "opacity-100"
        )}
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
