"use client";
import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { ReactLenis, useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";
// import { useLenisStore } from '@/store/lenis-store'
import { useGSAP } from "@gsap/react";

/* Plugins */
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

gsap.config({ force3D: true });

const SmoothScroll = () => {
  const lenisRef = useRef<any>(null);

  // useEffect(() => {
  //   // Initialize Lenis
  //   lenis.current = new Lenis({
  //     duration: 0.6, // Control the duration of the scroll
  //     easing: (t) => 1 - Math.pow(1 - t, 3), // Cubic easing for smooth stop
  //     smooth: true,
  //     smoothTouch: true, // Enable smooth scrolling on touch devices
  //   });

  //   console.log("lenis", lenis.current);

  //   const animate = (time: any) => {
  //     lenis.current.raf(time);
  //     requestAnimationFrame(animate);
  //   };

  //   requestAnimationFrame(animate);

  //   // Cleanup on unmount
  //   return () => {
  //     lenis.current.destroy();
  //   };
  // }, []);

  useEffect(() => {
    lenisRef.current?.lenis?.on("scroll", ScrollTrigger.update());

    function update(time: any) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisRef.current?.lenis?.destroy();
      gsap.ticker.remove(update);
    };
  }, []);

  useGSAP(() => {
    gsap.to(".section-2-content", {
      scrollTrigger: {
        trigger: ".section-2",
        start: "top center",
        end: "bottom center",
        scrub: 0.1,
        markers: true,
      },
      scale: 4,
      ease: "power4.inOut",
    });
  }, []);

  // const scrollToSection = (id: any) => {
  //   const element = document.getElementById(id);
  //   lenis.current.scrollTo(element);
  // };

  return (
    <ReactLenis
      root
      options={{ autoRaf: false, anchors: true, lerp: 0.1 }}
      ref={lenisRef}
    >
      <div>
        <div className="section section-1">Section 1</div>
        <div className="section section-2">
          <div className="section-2-content">Section 2</div>
        </div>
        <div className="section section-3">Section 3</div>
      </div>
    </ReactLenis>
  );
};

export default SmoothScroll;
