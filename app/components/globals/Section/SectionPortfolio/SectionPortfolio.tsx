"use client";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SectionPortfolioBackground from "./SectionPortfolioBackground";
import React from "react";

const SectionPortfolio = (props: any) => {
  const { data } = props;
  const [activeSector, setActiveSector] = useState<number | null>(null);
  const [lastClicked, setLastClicked] = useState<
    { id: number; clicked: boolean }[]
  >(data.map((item: any, index: number) => ({ id: index, clicked: false })));
  const [showUI, setShowUI] = useState<boolean>(false);
  const sectorRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP((context, contextSafe) => {
    const tl = gsap.timeline({
      onReverseComplete: () => {
        console.log("onReverseComplete");
        gsap.to(".sector-item-trigger", {
          width: "53px",
          duration: 0.2,
        });
      },
      scrollTrigger: {
        scroller: "body",
        start: "top top",
        end: "+=80%",
        markers: { startColor: "blue", endColor: "black", indent: 350 },
        toggleActions: "play none reverse reverse",
        scrub: true,

        onUpdate: (self) => {
          const progress = self.progress;

          if (progress > 0.57 && progress < 0.8) {
            setShowUI(true);
          } else {
            setShowUI(false);
          }
        },
        // snap: {
        //   // snapTo: [0, 1],
        //   duration: 0.2,
        //   delay: 0.01,
        //   ease: "power2.inOut",
        // },
      },
    });

    tl.to(".sector-item", {
      width: "25%",
      stagger: 0.2,
    });

    tl.to(
      ".sector-item-trigger",

      {
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderColor: "transparent",
        stagger: 0.2,
      },
      "<"
    );

    tl.to(
      ".sector-item-trigger-content",
      {
        opacity: 1,
        stagger: 0.2,
        delay: 2,
      },
      "<"
    );

    tl.to(
      ".sector-item",
      {
        opacity: 0,
        stagger: 0.2,
      },
      "+=1.0"
    );
  }, []);

  // useGSAP(
  //   (context, contextSafe) => {
  //     const sectors = gsap.utils.toArray(".sector-item");
  //     if (!contextSafe) return;

  //     const hanleClick = contextSafe((index: number) => {
  //       if (!showUI) return;

  //       const sector = sectors[index] as HTMLElement;
  //       const content = sector?.querySelector(".sector-item-content");
  //       console.log(lastClicked[index].clicked);
  //       if (content) {

  //       }

  //       setLastClicked((prev) => {
  //         const newState = [...prev];
  //         newState[index].clicked = !newState[index].clicked;
  //         return newState;
  //       });
  //     });

  //     sectorRefs.current.forEach((ref, index) => {
  //       ref?.addEventListener("click", () => hanleClick(index));
  //     });

  //     return () => {
  //       sectorRefs.current.forEach((ref, index) => {
  //         ref?.removeEventListener("click", () => hanleClick(index));
  //       });
  //     };
  //   },
  //   [showUI, lastClicked]
  // );

  const handleClick = useCallback(
    (index: number) => {
      if (!showUI) return;

      const sectors = gsap.utils.toArray(".sector-item");
      const sector = sectors[index] as HTMLElement;
      const content = sector?.querySelector(".sector-item-content");
      if (content) {
        console.log("on click", lastClicked[index].clicked);

        if (!lastClicked[index].clicked) {
          gsap.to(content, {
            height: "250px",
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.to(content.querySelectorAll(".sector-item-content-entry"), {
                opacity: 1,
                duration: 0.3,
                stagger: 0.3,
                ease: "power2.inOut",
              });
            },
          });
        } else {
          gsap.to(content.querySelectorAll(".sector-item-content-entry"), {
            opacity: 0,
            duration: 0.3,
            stagger: 0.3,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.to(content, {
                height: "0px",
                duration: 0.5,
                ease: "power2.inOut",
              });
            },
          });
        }

        setLastClicked((prev) => {
          const newState = [...prev];

          newState[index].clicked = newState[index].clicked ? false : true;
          return newState;
        });
      }
    },
    [lastClicked, showUI]
  );

  useEffect(() => {
    console.log(lastClicked);
  }, [lastClicked]);

  return (
    <>
      <div
        className={clsx(
          "sticky top-[55%] flex flex-row items-center justify-start gap-0 w-full z-10"
        )}
      >
        {data.map((sector: any, index: number) => {
          return (
            <React.Fragment key={index}>
              <div
                key={index}
                className="sector-item relative  w-[53px]"
                ref={(el) => {
                  sectorRefs.current[index] = el;
                }}
                onMouseEnter={() => setActiveSector(index)}
                onMouseLeave={() => setActiveSector(null)}
              >
                <div
                  className="absolute top-0 left-0 sector-item-trigger w-[53px] h-[53px]  rounded-full border-2 border-[rgba(255,0,255,0.7)] z-10"
                  onClick={() => handleClick(index)}
                >
                  <div className="sector-item-trigger-content opacity-0 w-full h-full  flex flex-row items-center justify-between px-2">
                    <div>{sector.title}</div>

                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="currentColor"
                    >
                      <path
                        d="M12 5V19M5 12H19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="absolute top-0 left-0 w-full sector-item-content h-[0px] overflow-hidden z-0">
                  <div className="sector-item-content-inner bg-white rounded-[27px] w-full pt-[100px] px-1 pb-2">
                    {sector.entries.map((entry: any, ix: number) => {
                      return (
                        <div
                          key={index + ix}
                          className="sector-item-content-entry opacity-0"
                        >
                          <div>{entry.title}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <SectionPortfolioBackground
        activeSector={activeSector}
        data={data}
        active={showUI}
      />
    </>
  );
};

export default SectionPortfolio;
