"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import Draggable from "gsap/Draggable";
import Observer from "gsap/Observer";
import InertiaPlugin from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useStore } from "@/store/store";
import { uiSelectors } from "@/app/(appLayout)/utils/utils";

gsap.registerPlugin(Draggable, Observer, InertiaPlugin);

// const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const SectionAboutNewAnimationController = (props: any) => {
  const { container, currentIndex, scroller, onEdgeReached } = props;
  const draggableRef = useRef<any>(null);
  const observerRef = useRef<any>(null);
  const mobileObserverRef = useRef<any>(null);
  const tlRef = useRef<any>(null);
  const proxyRef = useRef<any>(null);
  let targetX = 0;
  const { aboutVideoExpanded, globalFrom } = useStore();

  const handleMobileAnimation = (mode: "enter" | "exit") => {
    gsap.to([".section-title", "#progress"], {
      autoAlpha: mode === "enter" ? 0 : 1,
      duration: 0.4,
      ease: "expo.inOut",
    });

    gsap.to(container, {
      y: mode === "exit" ? 350 : 0,
      duration: 0.4,
      ease: "expo.inOut",
      onComplete: () => {
        if (mode === "enter") {
          draggableRef.current.enable();
          observerRef.current.enable();
        } else {
          draggableRef.current.disable();
          observerRef.current.disable();
        }
      },
    });
  };

  useEffect(() => {
    if (globalFrom === 3 && window.innerWidth < 768) {
      handleMobileAnimation("enter");
    }
  }, [globalFrom]);

  // This hook is specifically for the mobile version
  useGSAP(() => {
    if (window.innerWidth > 768 || !container) return;

    mobileObserverRef.current = Observer.create({
      target: container,
      type: "touch",
      preventDefault: true,
      onChangeY: (self) => {
        if (self.deltaY > 0) {
          handleMobileAnimation("exit");
          onEdgeReached("max");
        } else {
          mobileObserverRef.current.disable();
          handleMobileAnimation("enter");
        }
      },
    });
  }, [container]);

  useEffect(() => {
    const proxy = proxyRef.current;
    const d = draggableRef.current;
    const videoBox = document.getElementById("videoBox");
    if (!proxy || !d || !observerRef.current) return;

    if (aboutVideoExpanded) {
      const videoBoxX = videoBox?.getBoundingClientRect().x as number;
      const currentX = gsap.getProperty(proxy, "x") as number;

      const gap = 48;
      const tl = gsap
        .timeline({
          paused: true,
          immediateRender: false,
          onComplete: () => {
            d.update();
            d.disable();
            observerRef.current.disable();
            console.log("onComplete");
          },
        })
        .to([scroller, proxy], {
          x: currentX - videoBoxX + gap,
          duration: 0.6,
          ease: "expo.inOut",
        })
        .to(uiSelectors, {
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "expo.inOut",
        })
        .to(videoBox, {
          scale: useCalculateVideoScale().scale,
          y: useCalculateVideoScale().y,
          transformOrigin: "left bottom",
          willChange: "transform",
          duration: 0.6,
          ease: "expo.inOut",
        });

      tl.play();
    } else {
      const tl = gsap
        .timeline({
          paused: true,
          immediateRender: false,
          onComplete: () => {
            d.enable();
            d.update();
            observerRef.current.enable();
          },
        })
        .to(videoBox, {
          scale: 1,
          y: 0,
          transformOrigin: "left bottom",
          willChange: "transform",
          duration: 0.6,
          ease: "expo.inOut",
        })
        .to(uiSelectors, {
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "expo.inOut",
        });

      tl.play();
    }
  }, [aboutVideoExpanded]);

  useEffect(() => {
    if (!scroller || !draggableRef.current || !proxyRef.current) return;

    const d = draggableRef.current;
    const proxy = proxyRef.current;

    if (currentIndex === 3) {
      targetX = d.vars.bounds.minX;

      setTimeout(() => {
        gsap.set(proxy, { x: targetX });
        gsap.set(scroller, { x: targetX });
        d.update();
      }, 1000);
    } else if (currentIndex === 1) {
      targetX = d.vars.bounds.maxX;

      setTimeout(() => {
        gsap.set(proxy, { x: targetX });
        gsap.set(scroller, { x: targetX });
        d.update();
      }, 1000);
    }
  }, [currentIndex]);

  useGSAP(() => {
    if (!container || !scroller) return;

    let maxScroll = 0;

    const updateBounds = () => {
      const gap = ScrollTrigger.isTouch ? 20 : 30;
      maxScroll = scroller.scrollWidth - window.innerWidth + gap;

      draggable.vars.bounds = { minX: -maxScroll, maxX: 0 };
      draggable.applyBounds();
    };

    const proxy = document.createElement("div");
    proxyRef.current = proxy;
    gsap.set(proxy, { x: 0 });

    // const isTouch = ScrollTrigger.isTouch;

    const draggable: any = Draggable.create(proxy, {
      type: "x",
      trigger: container,
      bounds: { minX: -maxScroll, maxX: 0 },
      inertia: true,
      edgeResistance: 0.65,

      onDrag: function () {
        gsap.set(scroller, { x: this.x });

        // Add edge detection for draggable
        const isAtMinEdge = this.x >= this.vars.bounds.maxX;
        const isAtMaxEdge = this.x <= this.vars.bounds.minX;

        handleEdge(
          "max",
          isAtMaxEdge,
          () => {
            console.log("max edge");
            onEdgeReached("min");
          },
          "drag"
        );

        handleEdge(
          "min",
          isAtMinEdge,
          () => {
            console.log("min edge");
            onEdgeReached("max");
          },
          "drag"
        );
      },
      onThrowUpdate: function () {
        gsap.set(scroller, { x: this.x });

        // Add edge detection for throw updates
        const isAtMinEdge = this.x >= this.vars.bounds.maxX;
        const isAtMaxEdge = this.x <= this.vars.bounds.minX;

        handleEdge(
          "max",
          isAtMaxEdge,
          () => {
            onEdgeReached("min");
            if (window.innerWidth < 768) {
              gsap.delayedCall(0.5, () => {
                gsap.set(".section-title", { autoAlpha: 1 });
              });
            }
          },
          "drag"
        );

        handleEdge(
          "min",
          isAtMinEdge,
          () => {
            onEdgeReached("max");
          },
          "drag"
        );
      },
      onPress: function () {
        // sync proxy with current scroller transform
        gsap.set(this.target, {
          x: gsap.getProperty(scroller, "x"),
        });
        this.update();
      },
      onComplete: function () {
        console.log("draggable onComplete");
      },
    })[0];

    draggableRef.current = draggable;

    if (window.innerWidth < 768) {
      draggable.disable();
    }

    let edgeState = {
      min: { active: false, attempts: 0, fired: false },
      max: { active: false, attempts: 0, fired: false },
    };

    const handleEdge = (
      edge: "min" | "max",
      atEdge: boolean,
      callback: () => void,
      method?: "drag" | "scroll"
    ) => {
      const state = edgeState[edge];
      const limit = method === "drag" ? 60 : 100;

      if (atEdge) {
        if (state.active) {
          state.attempts++;

          if (
            window.innerWidth < 768 &&
            edge === "min" &&
            state.attempts >= 30
          ) {
            handleMobileAnimation("exit");
            mobileObserverRef.current.enable();
          }

          if (state.attempts >= limit && !state.fired) {
            callback();
            state.fired = true;
          }
        }
        state.active = true;
      } else {
        state.active = false;
        state.attempts = 0;
        state.fired = false;
      }
    };

    observerRef.current = Observer.create({
      target: container,
      type: "wheel, touch",
      preventDefault: true,
      wheelSpeed: 2,
      onWheel: function (self) {
        let newX = gsap.getProperty(proxy, "x") as number;
        newX -= self.deltaY;
        const maxX = draggable.vars.bounds.maxX;
        const minX = draggable.vars.bounds.minX;

        newX = Math.max(minX, Math.min(maxX, newX));

        handleEdge("max", newX === maxX, () => {
          onEdgeReached("max");
        });

        handleEdge("min", newX === minX, () => {
          onEdgeReached("min");
        });

        gsap.to(proxy, {
          x: newX,
          duration: 0.6,
          ease: "expo.out",
          onUpdate: () => {
            gsap.set(scroller, { x: gsap.getProperty(proxy, "x") as number });
            draggable.update();
          },
        });
      },
    });

    if (window.innerWidth < 768) {
      observerRef.current.disable();
    }

    updateBounds();

    window.addEventListener("resize", updateBounds);

    return () => {
      draggable.kill();
      Observer.getAll().forEach((observer) => observer.kill());
      window.removeEventListener("resize", updateBounds);
    };
  }, [container, scroller]);
  return <>{props.children}</>;
};

export default SectionAboutNewAnimationController;

const useCalculateVideoScale = () => {
  const isTouch = ScrollTrigger.isTouch;
  const imageBox = document.getElementById("videoBox");

  const imageWidth = imageBox?.offsetWidth as number;
  const imageHeight = imageBox?.offsetHeight as number;
  const vw = window.innerWidth;
  const vh = document.documentElement.clientHeight;

  const padding = !isTouch
    ? { top: 48, left: 48, bottom: 48, right: 102 }
    : { top: 20, left: 20, bottom: 40, right: 20 };

  // Calculate available space correctly
  const availableWidth = vw - padding.left - padding.right;
  const availableHeight = vh - padding.top - padding.bottom;

  // Calculate scale factors
  const scaleX = availableWidth / imageWidth;
  const scaleY = availableHeight / imageHeight;

  // Use the smaller scale to ensure the image fits within bounds
  const scale = Math.min(scaleX, scaleY);

  // Calculate scaled dimensions
  const scaledWidth = imageWidth * scale;
  const scaledHeight = imageHeight * scale;

  // Since transformOrigin is "left bottom", we need to calculate position differently
  // The element will scale from its bottom-left corner

  // Calculate where the bottom-left corner should be positioned
  const targetBottomLeftY = vh - padding.bottom;

  // Get current position of the videoBox
  const currentRect = imageBox?.getBoundingClientRect();
  const currentBottomLeftY = currentRect?.bottom || 0;

  // Calculate the offset needed to move the bottom-left corner to the target position

  const offsetY = targetBottomLeftY - currentBottomLeftY;

  return {
    scale,
    y: offsetY,
  };
};
