"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { useLenis } from "lenis/react";
import { globalTriggers } from "@/app/utils/gsapUtils";

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

      lenis.scrollTo(id === "intro" ? 0 : targetElement, {
        duration: 0,
        immediate: true,
        onComplete: () => {
          ScrollTrigger.refresh(true);
          const trigger = ScrollTrigger.getById(`${id}-trigger`);
          const titleAnimation = gsap.getById(`title-animation-${id}`);

          if (titleAnimation) {
            titleAnimation.play();
          }

          switch (id) {
            case "intro":
              break;
            case "portfolio":
              if (trigger && trigger.animation) {
                trigger.animation.play();
              }
              break;
            case "about":
              break;
            case "contact":
              break;
          }

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

    setTimeout(() => {
      globalTriggers.forEach((section) => {
        const trigger = ScrollTrigger.getById(section.trigger);
        const triggerEl = document.getElementById(section.id);
        const progressBar = document.getElementById(
          `${section.id}-progress`
        ) as HTMLElement;

        const targetElement = document.getElementById(section.id);
        const targetElementMenu = document.getElementById(`${section.id}-menu`);

        ScrollTrigger.create({
          id: `${section.id}-progress`,
          trigger: triggerEl,
          start: trigger?.start,
          end: trigger?.end,
          onUpdate: (self) => {},
          onEnter: () => {
            if (menuRef.current && section.id !== "intro") {
              gsap.to(menuRef.current, {
                opacity: 1,
                duration: 0.2,
                ease: "power2.inOut",
              });
            }

            gsap.to(menuProgressRef.current, {
              width: targetElementMenu?.offsetWidth,
              x: targetElementMenu?.offsetLeft,
              duration: 0.2,
              ease: "power2.inOut",
            });
          },
          onEnterBack: () => {
            if (menuRef.current && section.id === "intro") {
              gsap.to(menuRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: "power2.inOut",
              });
            }
            gsap.to(menuProgressRef.current, {
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
  }, [lenis, data]);

  return (
    <div
      ref={menuRef}
      className="fixed bottom-3 left-3 z-10 opacity-0"
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
