"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";

import { globalTriggers } from "@/app/utils/gsapUtils";
import { useStore } from "@/store/store";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface MenuItem {
  title: string;
  id?: string;
}

interface MenuProps {
  data: MenuItem[];
}

const Menu = ({ data }: MenuProps) => {
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const menuProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { introStoreDone } = useStore();

  useGSAP(() => {
    const smoother = ScrollSmoother.get();
    const body = document?.body;

    const handleClick = (id: string) => {
      const targetElement = document.getElementById(id);
      const targetElementMenu = document.getElementById(`${id}-menu`);

      if (!targetElement || !targetElementMenu || !smoother) return;

      gsap.to(smoother, {
        id: `${id}-smooter-scroll-top`,
        scrollTop: smoother?.offset(targetElement),
        duration: 1,
        ease: "power4.inOut",
      });

      gsap.to(menuProgressRef.current, {
        id: `${id}-progress-x`,
        width: targetElementMenu.offsetWidth,
        x: targetElementMenu.offsetLeft,
        duration: 0.2,
        ease: "power2.inOut",
      });
    };

    setTimeout(() => {
      globalTriggers.forEach((section) => {
        const trigger = ScrollTrigger.getById(section.trigger);
        const triggerEl = document.getElementById(section.id);

        const targetElement = document.getElementById(section.id);
        const targetElementMenu = document.getElementById(`${section.id}-menu`);

        ScrollTrigger.create({
          id: `${section.id}-progress`,
          trigger: triggerEl,
          start: trigger?.start,
          end: trigger?.end,
          onEnter: () => {
            gsap.to(menuProgressRef.current, {
              id: `${section.id}-progress-enter`,
              paused: true,
              width: targetElementMenu?.offsetWidth,
              x: targetElementMenu?.offsetLeft,
              duration: 0.2,
              ease: "power2.inOut",
            });
          },
          onEnterBack: () => {
            gsap.to(menuProgressRef.current, {
              id: `${section.id}-progress-enter-back`,
              paused: true,
              width: targetElementMenu?.offsetWidth,
              x: targetElementMenu?.offsetLeft,
              duration: 0.2,
              ease: "power2.inOut",
            });
          },
        });
      });
    }, 100);

    // Add click event listeners to menu items
    menuItemsRef.current.forEach((item, index) => {
      if (item && data[index]?.id) {
        item.addEventListener("click", () => handleClick(data[index].id!));
      }
    });

    // Cleanup function
    return () => {
      menuItemsRef.current.forEach((item, index) => {
        if (item && data[index]?.id) {
          item.removeEventListener("click", () => handleClick(data[index].id!));
        }
      });
    };
  }, [data]);

  return (
    <div
      ref={menuRef}
      className={clsx(
        "fixed bottom-3 left-3 z-10 opacity-0 transition-opacity duration-300 ease-in-out",
        introStoreDone && "opacity-100"
      )}
      id={"menu"}
    >
      <div className="relative h-full w-full bg-white/40 backdrop-blur-sm rounded-menu">
        <div className="flex flex-row items-center ">
          {data.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                menuItemsRef.current[index] = el;
              }}
              className="font-sans text-sm text-dark-grey min-w-[100px] px-[10px] py-[10px] rounded-menu flex items-center justify-center z-10 cursor-pointer"
              id={`${item.id}-menu`}
            >
              <span>{item.title}</span>
            </div>
          ))}
        </div>
        <div
          ref={menuProgressRef}
          className="absolute bottom-0 left-0 h-full w-[100px] bg-white/80 rounded-menu"
        />
      </div>
    </div>
  );
};

export default Menu;
