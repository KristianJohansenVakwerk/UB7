"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { useStore } from "@/store/store";
import { LAST_SECTION, SECTION, SECTION_COUNT } from "../utils/data";
import { scrollIntentSignal } from "./scrollIntentSignal";

gsap.registerPlugin(Observer, ScrollTrigger);

// Pixels of accumulated wheel/touch delta required to commit a section change.
// Tune to taste: lower = trigger-happy, higher = needs a longer stroke.
const SCROLL_THRESHOLD = 500;

// Idle time before a sub-threshold accumulator springs back to zero.
const SETTLE_MS = 130;
const SPRING_DURATION = 1.0;

export function useSectionScroll() {
  const [currentIndex, setCurrentIndex] = useState<number>(SECTION.INTRO);
  const [scrollingDown, setScrollingDown] = useState<boolean>(true);

  const sectionsContainer = useRef<HTMLDivElement>(null);
  const observerRef = useRef<any>(null);
  const allowScroll = useRef<boolean>(true);
  const currentIndexRef = useRef<number>(SECTION.INTRO);
  const scrollTimeout = useRef<gsap.core.Tween | null>(null);

  // Accumulated wheel/touch delta in the active section. Cleared on section change
  // or after settle. Drives scrollIntentSignal which the gradient shader reads.
  const accumRef = useRef<number>(0);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const springTweenRef = useRef<gsap.core.Tween | null>(null);

  const {
    introStoreDone,
    disableScroll,
    setCurrentStoreIndex,
    setIntroSplash,
  } = useStore();

  const writeIntent = (value: number) => {
    scrollIntentSignal.value = value;
  };

  const resetIntent = useCallback(() => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    springTweenRef.current?.kill();
    springTweenRef.current = null;
    accumRef.current = 0;
    writeIntent(0);
  }, []);

  // Ease the accumulated intent down to 0 over `duration`. Used when a section change
  // fires — the intent fades to 0 while ThreeCanvas's uOffset tween moves to the next
  // section's base, so the shader's k = uOffset + uIntentOffset stays monotonic instead
  // of snapping backward by INTENT_OFFSET_RANGE at the moment of the threshold cross.
  const handoffIntent = useCallback((duration: number) => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    springTweenRef.current?.kill();
    springTweenRef.current = gsap.to(accumRef, {
      current: 0,
      duration,
      ease: "expo.inOut",
      onUpdate: () => writeIntent(accumRef.current / SCROLL_THRESHOLD),
      onComplete: () => writeIntent(0),
    });
  }, []);

  const scrollToSection = useCallback(
    (index: number, isScrollingDown: boolean, clicked = false) => {
      if (clicked) {
        observerRef.current?.enable();
        setIntroSplash(true);

        const container = document.getElementById("container");
        const tl = gsap.timeline({ id: "scroll-to-section", paused: true });

        tl.to(container, { duration: 0.4, ease: "expo.inOut", opacity: 0 });
        tl.to(sectionsContainer.current, {
          yPercent: -100 * index,
          duration: 0.75,
          delay: 0.4,
          force3D: true,
          ease: "expo.inOut",
        });
        tl.to(container, { duration: 0.4, ease: "expo.inOut", opacity: 1 });
        tl.play();

        resetIntent();
        setCurrentIndex(index);
        setCurrentStoreIndex(index);
        setScrollingDown(isScrollingDown);
        currentIndexRef.current = index;
        return;
      }

      // About owns its own internal scroll — wheel events are ignored while there.
      if (currentIndexRef.current === SECTION.ABOUT) return;
      if (index === SECTION_COUNT && isScrollingDown) {
        observerRef.current?.disable();
        return;
      }
      if (index === -1 && !isScrollingDown) return;

      allowScroll.current = false;
      scrollTimeout.current?.restart(true);
      handoffIntent(0.75);

      gsap.to(sectionsContainer.current, {
        yPercent: -100 * index,
        duration: 0.75,
        force3D: true,
        delay:
          currentIndexRef.current === SECTION.INTRO && isScrollingDown ? 0 : 0.4,
        ease: "expo.inOut",
      });

      setCurrentIndex(index);
      setCurrentStoreIndex(index);
      setScrollingDown(isScrollingDown);
      currentIndexRef.current = index;
    },
    [setCurrentStoreIndex, setIntroSplash, resetIntent, handoffIntent]
  );

  useGSAP(() => {
    allowScroll.current = true;
    currentIndexRef.current = SECTION.INTRO;
    scrollTimeout.current = gsap
      .delayedCall(1, () => (allowScroll.current = true))
      .pause();

    gsap.set(gsap.utils.toArray(".swipe-section .panel"), {
      yPercent: (i) => i * 100,
    });

    observerRef.current = ScrollTrigger.observe({
      type: "wheel,touch",
      preventDefault: true,
      tolerance: 0,
      ignore: "#aboutSlider",
      onChange: (self: any) => {
        if (!allowScroll.current) return;
        if (currentIndexRef.current === SECTION.ABOUT) return;

        // A new event interrupts any pending spring-back.
        springTweenRef.current?.kill();
        springTweenRef.current = null;
        if (settleTimerRef.current) {
          clearTimeout(settleTimerRef.current);
          settleTimerRef.current = null;
        }

        accumRef.current += self.deltaY;

        // Forward (positive delta) → next section. Block at the edges.
        if (
          currentIndexRef.current === LAST_SECTION &&
          accumRef.current > 0
        ) {
          accumRef.current = 0;
        }
        if (
          currentIndexRef.current === SECTION.INTRO &&
          accumRef.current < 0
        ) {
          accumRef.current = 0;
        }

        if (accumRef.current >= SCROLL_THRESHOLD) {
          scrollToSection(currentIndexRef.current + 1, true);
          return;
        }
        if (accumRef.current <= -SCROLL_THRESHOLD) {
          scrollToSection(currentIndexRef.current - 1, false);
          return;
        }

        writeIntent(accumRef.current / SCROLL_THRESHOLD);

        // Schedule a spring-back if no further events arrive.
        settleTimerRef.current = setTimeout(() => {
          springTweenRef.current = gsap.to(accumRef, {
            current: 0,
            duration: SPRING_DURATION,
            ease: "expo.out",
            onUpdate: () => writeIntent(accumRef.current / SCROLL_THRESHOLD),
            onComplete: () => writeIntent(0),
          });
        }, SETTLE_MS);
      },
      onEnable: (self: any) => {
        allowScroll.current = false;
        scrollTimeout.current?.restart(true);
        resetIntent();
        // Freeze native scroll while observer is intercepting (fixes macOS momentum).
        const savedScroll = self.scrollY();
        self._restoreScroll = () => self.scrollY(savedScroll);
        document.addEventListener("scroll", self._restoreScroll, {
          passive: false,
        });
      },
      onDisable: (self: any) => {
        resetIntent();
        document.removeEventListener("scroll", self._restoreScroll);
      },
    });

    observerRef.current.disable();

    return () => {
      springTweenRef.current?.kill();
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;
    if (disableScroll || !introStoreDone) {
      observerRef.current.disable();
    } else {
      observerRef.current.enable();
    }
  }, [disableScroll, introStoreDone]);

  const onEdgeReached = useCallback(
    (edge: "min" | "max") => {
      // About's internal scroll hit an edge — escape upward (max) or downward (min).
      if (edge === "max") {
        currentIndexRef.current = SECTION.PORTFOLIO;
        scrollToSection(SECTION.PORTFOLIO, false);
      } else {
        currentIndexRef.current = LAST_SECTION;
        scrollToSection(LAST_SECTION, true);
      }
    },
    [scrollToSection]
  );

  const handleMenuClick = useCallback(
    (index: number) => {
      scrollToSection(index, true, true);
    },
    [scrollToSection]
  );

  return {
    sectionsContainer,
    currentIndex,
    scrollingDown,
    onEdgeReached,
    handleMenuClick,
  };
}
