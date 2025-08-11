"use client";

import { useInView } from "react-intersection-observer";
import ScrollTrigger from "gsap/ScrollTrigger";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

export default function TestPage() {
  const boundsRef = useRef<HTMLDivElement>(null);

  const observer = useRef<any>(null);
  const currentIndex = useRef(0);
  const isDragging = useRef(false);
  // const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const boxesPos = useRef<any>([]);
  const velocity = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);

  useGSAP(() => {
    const boxes = gsap.utils.toArray(".box");
    boxes.forEach((box, index) => {
      boxesPos.current[index] = { x: 0, y: 0 };
    });
    if (boundsRef.current) {
      observer.current = ScrollTrigger.observe({
        target: boundsRef.current,
        type: "touch, pointer",
        preventDefault: true,
        onPress: (self: any) => {
          isDragging.current = true;
          // startPos.current = { x: self.x, y: self.y };
          // currentPos.current = { x: 0, y: 0 };
          lastTime.current = Date.now();

          // Add grabbing cursor
          const box = boxes[currentIndex.current] as HTMLElement;
          if (box) {
            box.style.cursor = "grabbing";
          }
        },
        onDrag: (self: any) => {
          if (!isDragging.current) return;

          const now = Date.now();
          const deltaTime = now - lastTime.current;

          // Calculate velocity
          velocity.current.x = self.deltaX / (deltaTime / 16.67); // Normalize to 60fps
          velocity.current.y = self.deltaY / (deltaTime / 16.67);

          // Update current position

          const currentBox = boxesPos.current[currentIndex.current];

          currentBox.x += self.deltaX;
          currentBox.y += self.deltaY;

          const box = boxes[currentIndex.current] as HTMLElement;
          if (box) {
            // Apply position with smooth animation
            gsap.to(box, {
              x: currentBox.x,
              y: currentBox.y,
              rotation: velocity.current.x * 0.01, // Add rotation based on velocity
              duration: 0.5,
              ease: "power2.out",
            });
          }

          lastTime.current = now;
        },
        onRelease: (self: any) => {
          isDragging.current = false;

          const box = boxes[currentIndex.current] as HTMLElement;
          if (box) {
            box.style.cursor = "grab";

            // Add inertia effect
            const inertiaX = velocity.current.x * 10;
            const inertiaY = velocity.current.y * 10;
            const currentBoxPos = boxesPos.current[currentIndex.current];

            gsap.to(box, {
              x: currentBoxPos.x + inertiaX,
              y: currentBoxPos.y + inertiaY,
              rotation: 0,
              duration: 1.2,
              ease: "expo.out",
              onUpdate: () => {
                // Update current position during inertia
                currentPos.current.x = gsap.getProperty(box, "x") as number;
                currentPos.current.y = gsap.getProperty(box, "y") as number;
              },
              onComplete: () => {
                if (currentIndex.current < boxes.length - 1) {
                  currentIndex.current += 1;
                } else {
                  currentIndex.current = 0;
                }

                // boxesPos.current[currentIndex.current] = {
                //   x: currentPos.current.x,
                //   y: currentPos.current.y,
                // };
              },
            });
          }

          // Reset velocity
          velocity.current = { x: 0, y: 0 };
        },
      });

      console.log("observer", observer.current);

      observer.current.enable();
    }
  });
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div
        ref={boundsRef}
        className="bounds absolute top-0 left-0 bg-red-500 h-screen w-screen flex items-center justify-center"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="box absolute top-1/2  left-1/2 -translate-x-1/2 -translate-y-1/2 h-[74vh] w-[calc(80vh*0.55)] lg:w-[calc(80vh*0.46)] bg-white  rounded-[26px] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ zIndex: 1000 - index }}
          >
            <div className=" bg-yellow-500">start</div>
            <div className="h-[1000px] bg-blue-500">content</div>
            <div className=" bg-green-500">end</div>
          </div>
        ))}
      </div>
    </div>
  );
}
