"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const horizontalListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!horizontalListRef.current) return;

    const items = horizontalListRef.current.querySelectorAll(".scroll-item");

    items.forEach((item) => {
      gsap.fromTo(
        item,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            scroller: scrollContainerRef.current,
            start: "left center",
            end: "right center",
            scrub: true,
            horizontal: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      {/* Section 1 */}
      <section className="snap-start h-screen flex items-center justify-center bg-red-300">
        <h1 className="text-4xl font-bold">Section 1</h1>
      </section>

      {/* Section 2 */}
      <section className="snap-start h-screen flex items-center justify-center bg-green-300">
        <h1 className="text-4xl font-bold">Section 2</h1>
      </section>

      {/* Section 3 - auto height */}
      {/* Section 3 with sticky scroll */}
      <section className="snap-start section-3-wrapper relative h-[350vh] bg-gray-100">
        {/* Sticky inner section */}
        <div className="section-3-sticky sticky top-0 h-screen flex items-center px-10 overflow-hidden">
          <div ref={horizontalListRef} className="flex space-x-8 w-max">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className="scroll-item w-[400px] h-[300px] bg-blue-500 rounded-md text-white flex items-center justify-center text-2xl shrink-0"
              >
                Item {num}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section className="snap-start h-screen flex items-center justify-center bg-purple-300">
        <h1 className="text-4xl font-bold">Section 4</h1>
      </section>
    </div>
  );
}
