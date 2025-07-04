"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import IntroPixi from "../components/globals/IntroPixi/IntroPixi";
import SectionIntro from "../components/globals/Section/SectionIntro";
gsap.registerPlugin(ScrollTrigger);
export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!scrollContainerRef.current) return;

    ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      markers: false,
      onUpdate: (self) => {
        console.log("onUpdate", self.progress);
      },
    });

    const items = gsap.utils.toArray(".scroll-item");

    items.forEach((item, index) => {
      ScrollTrigger.create({
        id: `scroll-item-${index}`,
        trigger: item as HTMLElement,
        start: "top top",
        end: "bottom top",
        scrub: false,
        markers: false,
        onUpdate: (self) => {
          console.log("onUpdate", self.progress, index);
        },
      });
    });
  }, []);

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="relative h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth z-10"
      >
        {/* Section 1 */}
        <section className="snap-start scroll-item h-screen flex items-center justify-center ">
          <SectionIntro />
        </section>

        {/* Section 2 */}
        <section className="snap-start scroll-item h-screen flex items-center justify-center ">
          <h1 className="text-4xl font-bold">Section 2</h1>
        </section>

        {/* Section 3 - auto height */}
        {/* Section 3 with sticky scroll */}
        <section className="snap-start scroll-item section-3-wrapper relative h-[350vh] ">
          {/* Sticky inner section */}
          <div className="section-3-sticky sticky top-0 h-screen flex items-center px-10 overflow-hidden">
            <div className="flex space-x-8 w-max">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className="scroll-item w-[400px] h-[300px]  rounded-md text-white flex items-center justify-center text-2xl shrink-0 bg-red-500"
                >
                  Item {num}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="snap-start scroll-item h-screen flex items-center justify-center">
          <h1 className="text-4xl font-bold">Section 4</h1>
        </section>
      </div>

      <IntroPixi />
    </>
  );
}
