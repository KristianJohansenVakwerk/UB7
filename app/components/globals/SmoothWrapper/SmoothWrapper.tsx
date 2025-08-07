"use client";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/store/store";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother);

type Props = {
  children: any;
};
const SmoothWrapper = (props: Props) => {
  const { children } = props;
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const directionRef = useRef<number>(0);
  const [scrolling, setScrolling] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { introStoreDone } = useStore();

  const handleSmootherStop = useCallback((self: ScrollSmoother) => {
    const freeContainerScroller = ScrollTrigger.getById(
      "freeContainerScroller"
    );
    const currentScroll = self.scrollTop();

    if (!freeContainerScroller) return;

    // Kill any existing animations to prevent conflicts
    gsap.killTweensOf(smootherRef.current);

    switch (directionRef.current) {
      case 1:
        if (
          currentScroll > freeContainerScroller.start &&
          currentScroll < freeContainerScroller.end
        ) {
          gsap.to(smootherRef.current, {
            id: "smooth-wrapper-scroll-top",
            scrollTop: freeContainerScroller.start + window.innerHeight,
            duration: 0.4,
            ease: "power2.inOut",
          });
        }
        break;
      case -1:
        if (
          currentScroll < freeContainerScroller.end &&
          currentScroll > freeContainerScroller.start
        ) {
          gsap.to(smootherRef.current, {
            id: "smooth-wrapper-scroll-bottom",
            scrollTop: freeContainerScroller.start,
            duration: 0.4,
            ease: "power2.inOut",
          });
        }
        break;
    }

    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
    };
  }, []);

  // Create ScrollSmoother
  useGSAP(() => {
    // Clean up existing smoother if it exists
    if (smootherRef.current) {
      smootherRef.current.kill();
    }

    smootherRef.current = ScrollSmoother.create({
      wrapper: ".smooth-wrapper",
      content: ".smooth-content",
      smooth: 0.4,
      effects: false,
      normalizeScroll: true,
      smoothTouch: 0.2,
      onStop: handleSmootherStop,

      onUpdate: () => {
        setScrolling(true);

        // Clear existing timeout before setting a new one
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          setScrolling(false);
        }, 50);
      },
    });

    // smootherRef?.current?.paused(true);

    // Cleanup function
    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
      // Clear timeout on cleanup
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleSmootherStop]);

  useEffect(() => {
    if (introStoreDone) {
      smootherRef?.current?.paused(false);
    } else {
      smootherRef?.current?.paused(true);
    }
  }, [introStoreDone]);

  useGSAP(() => {
    const snapContainers = gsap.utils.toArray(".snap-container");

    console.log("creating snap containers triggers");

    snapContainers.forEach((container: any, index) => {
      if (!container) return;

      const sections = container.querySelectorAll(".section");
      const isLastContainer = index === snapContainers.length - 1;

      ScrollTrigger.create({
        trigger: container as HTMLElement,
        id: `snap-container-${index}`,
        start: !isLastContainer ? "top top" : "top bottom",
        end: !isLastContainer ? "bottom bottom" : "bottom bottom",
        markers: isLastContainer ? true : false,
        scroller: ".smooth-wrapper",
        snap: {
          snapTo: sections.length > 1 ? [0, 1] : 1,
          duration: 0.6,
          ease: "power2.inOut",
        },
        onEnter: () => {},
        onLeave: () => {},
      });
    });
  }, []);

  useGSAP(() => {
    if (!smootherRef.current) return;

    const freeContainer = document.querySelector(".free-container");

    ScrollTrigger.create({
      id: "freeContainerScroller",
      trigger: freeContainer,
      start: "top bottom",
      end: "+=80%",
      markers: false,
      onUpdate: (self) => {
        directionRef.current = self.direction;
      },
    });
  }, []);

  return (
    <div
      className="smooth-wrapper"
      style={{ pointerEvents: scrolling ? "none" : "auto" }}
    >
      <div className="smooth-content will-change-transform">{children}</div>
    </div>
  );
};

export default SmoothWrapper;
