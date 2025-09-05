"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import Draggable from "gsap/Draggable";
import Observer from "gsap/Observer";
import InertiaPlugin from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(Draggable, Observer, InertiaPlugin);

// const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const SectionAboutNewAnimationController = (props: any) => {
  const { container, currentIndex, scroller, onEdgeReached } = props;
  const draggableRef = useRef<any>(null);
  const proxyRef = useRef<any>(null);
  let targetX = 0;

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
      onDrag: function () {
        gsap.set(scroller, { x: this.x });
      },
      onThrowUpdate: function () {
        gsap.set(scroller, { x: this.x });
      },
      onPress: function () {
        // sync proxy with current scroller transform
        gsap.set(this.target, {
          x: gsap.getProperty(scroller, "x"),
        });
        this.update();
      },
    })[0];

    draggableRef.current = draggable;

    let edgeState = {
      min: { active: false, attempts: 0, fired: false },
      max: { active: false, attempts: 0, fired: false },
    };

    const limit = 100;

    const handleEdge = (
      edge: "min" | "max",
      atEdge: boolean,
      callback: () => void
    ) => {
      const state = edgeState[edge];

      if (atEdge) {
        if (state.active) {
          state.attempts++;

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

    Observer.create({
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
          console.log("Scroll to previous section");
          onEdgeReached("max");
        });

        handleEdge("min", newX === minX, () => {
          console.log("Scroll to next section");
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
