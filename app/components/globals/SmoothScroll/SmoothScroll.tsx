"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Plugins */
gsap.registerPlugin(useGSAP, ScrollTrigger);

const SmoothScroll = () => {
  useGSAP(() => {
    gsap.to(".section-1-content", {
      scrollTrigger: {
        trigger: ".section-1",
        start: "+=80%",
        markers: true,
      },
      paused: true,
      opacity: 0,
      ease: "power2.inOut",
      duration: 1,
    });

    gsap.fromTo(
      ".section-2-content",
      {
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".section-1",
          start: "bottom top",
          end: "+=100%",
          markers: {
            startColor: "blue",
            endColor: "yellow",
            fontSize: "18px",
            fontWeight: "bold",
            indent: 200,
          },
          onLeave: () => {
            console.log("leave");
            gsap.to(".section-2-content", {
              opacity: 0,
              ease: "power2.inOut",
              duration: 0.5,
            });
          },
        },

        opacity: 1,
        ease: "power2.inOut",
        duration: 1,
      }
    );

    gsap.fromTo(
      ".section-3-content",
      {
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".section-2",
          start: "bottom bottom",

          markers: {
            startColor: "pink",
            endColor: "salmon",
            fontSize: "18px",
            fontWeight: "bold",
            indent: 100,
          },
        },

        opacity: 1,
        ease: "power2.inOut",
        duration: 1,
      }
    );
  }, []);
  return (
    <div>
      <div>
        <div className="section-1 flex flex-col items-center justify-center w-screen h-screen border-1 border-red-500">
          <div className="section-1-content fixed top-7 left-3">Section 1</div>
        </div>
        <div className="flex flex-col items-center justify-center w-screen h-screen border-1 border-red-500">
          <div className="section-2-content fixed top-7 left-3">Section 2</div>
        </div>
        <div className="flex flex-col items-center justify-center w-screen h-screen border-1 border-red-500">
          <div className="section-3-content fixed top-7 left-3">Section 3</div>
        </div>
      </div>
    </div>
  );
};

export default SmoothScroll;
