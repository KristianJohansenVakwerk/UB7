"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Box from "../../ui/Box/Box";
import { useRef } from "react";

import { useLenis } from "lenis/react";
import { globalSectionTriggers } from "@/app/utils/gsapUtils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface MenuItem {
  title: string;
  id?: string;
}

interface MenuProps {
  data: MenuItem[];
}

const Menu = ({ data }: MenuProps) => {
  const lenis = useLenis((lenis) => {});
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const menuProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const handleClick = (id: string) => {
      const targetElement = document.getElementById(id);
      const targetElementMenu = document.getElementById(`${id}-menu`);

      if (!targetElement || !lenis || !targetElementMenu) return;

      lenis.scrollTo(targetElement, {
        duration: 0,
        immediate: true,
        onComplete: () => {
          ScrollTrigger.refresh(true);
          ScrollTrigger.getAll().forEach((trigger) => {
            if (trigger.animation) {
              if (trigger.vars.id === id) {
                trigger.animation.play();
              } else {
                const p = trigger.progress;
                trigger.animation.progress(p);
              }
            }
          });

          if (menuRef.current && id !== "intro") {
            gsap.to(menuRef.current, {
              opacity: 1,
              duration: 0.2,
              ease: "power2.inOut",
            });
          } else {
            gsap.to(menuRef.current, {
              opacity: 0,
              duration: 0.2,
              ease: "power2.inOut",
            });
          }

          gsap.to(menuProgressRef.current, {
            width: targetElementMenu.offsetWidth,
            x: targetElementMenu.offsetLeft,
            duration: 0.2,
            ease: "power2.inOut",
          });
        },
      });
    };

    const sectionTriggers = [
      { start: "top top", end: "bottom center", id: "intro" },
      ...globalSectionTriggers,
    ];

    // Create ScrollTriggers for each section
    data.forEach((item, index) => {
      if (!item.id) return;

      const targetElement = document.getElementById(item.id);
      const targetElementMenu = document.getElementById(`${item.id}-menu`);

      if (!targetElement || !targetElementMenu) return;

      ScrollTrigger.create({
        trigger: targetElement,
        start: sectionTriggers[index].start,
        end: sectionTriggers[index].end,
        id: item.id,
        markers: false,
        onEnter: () => {
          if (menuRef.current && item.id !== "intro") {
            gsap.to(menuRef.current, {
              opacity: 1,
              duration: 0.2,
              ease: "power2.inOut",
            });
          }

          gsap.to(menuProgressRef.current, {
            width: targetElementMenu.offsetWidth,
            x: targetElementMenu.offsetLeft,
            duration: 0.2,
            ease: "power2.inOut",
          });
        },
        onEnterBack: () => {
          if (menuRef.current && item.id === "intro") {
            gsap.to(menuRef.current, {
              opacity: 0,
              duration: 0.2,
              ease: "power2.inOut",
            });
          }
          gsap.to(menuProgressRef.current, {
            width: targetElementMenu.offsetWidth,
            x: targetElementMenu.offsetLeft,
            duration: 0.2,
            ease: "power2.inOut",
          });
        },
      });
    });

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
  }, [lenis, data]);

  return (
    <div ref={menuRef} className="fixed bottom-3 left-3 z-10 opacity-0">
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
