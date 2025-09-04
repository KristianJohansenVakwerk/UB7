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
  const { container, currentIndex, scroller } = props;
  let targetX = 0;
  const targetXRef = useRef<number>(0);

  useEffect(() => {
    if (currentIndex === 3) {
    }
  }, [currentIndex]);

  useGSAP(() => {
    if (!container || !scroller || currentIndex !== 2) return;

    let maxScroll = 0;

    const updateBounds = () => {
      const gap = ScrollTrigger.isTouch ? 20 : 30;
      maxScroll = scroller.scrollWidth - window.innerWidth + gap;

      d.vars.bounds = { minX: -maxScroll, maxX: 0 };
      d.applyBounds();
    };

    const proxy = document.createElement("div");
    gsap.set(proxy, { x: 0 });

    const draggable: any = Draggable.create(proxy, {
      type: "x",
      trigger: scroller,
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

    const d = draggable;

    Observer.create({
      target: scroller,
      type: "wheel, touch",
      preventDefault: true,
      wheelSpeed: 0.6,
      onWheel: function (self) {
        let newX = gsap.getProperty(proxy, "x") as number;
        newX -= self.deltaY;

        newX = Math.max(d.vars.bounds.minX, Math.min(d.vars.bounds.maxX, newX));

        gsap.to(proxy, {
          x: newX,
          duration: 0.4,
          ease: "power3.out",
          onUpdate: () => {
            gsap.set(scroller, { x: gsap.getProperty(proxy, "x") as number });
            d.update();
          },
        });
      },
    });

    updateBounds();

    window.addEventListener("resize", updateBounds);

    return () => {
      d.kill();
      Observer.getAll().forEach((observer) => observer.kill());
      window.removeEventListener("resize", updateBounds);
    };
  }, [container, scroller, currentIndex]);
  return <>{props.children}</>;
};

export default SectionAboutNewAnimationController;
