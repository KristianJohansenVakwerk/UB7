"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Box from "../../ui/Box/Box";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
gsap.registerPlugin(ScrollTrigger);
import Clock from "../../shared/Clock/Clock";
import { useStore } from "@/store/store";

const SectionIntro = ({
  inView,
  cssSnap = false,
}: {
  inView: boolean;
  cssSnap?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const gradientContainerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [lerpedPosition, setLerpedPosition] = useState({ x: 0.5, y: 0.5 });
  const [initDone, setInitDone] = useState(false);
  const { setIntroStoreDone } = useStore();

  // Lerp function for smooth interpolation
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Throttled mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });
  }, []);

  // Optimized lerp animation with requestAnimationFrame
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setLerpedPosition((prev) => {
        const newX = lerp(prev.x, mousePosition.x, 0.08); // Slightly faster lerp
        const newY = lerp(prev.y, mousePosition.y, 0.08);

        // Check if we're close enough to stop
        const deltaX = Math.abs(newX - mousePosition.x);
        const deltaY = Math.abs(newY - mousePosition.y);

        // If very close to target, snap to it
        if (deltaX < 0.001 && deltaY < 0.001) {
          return mousePosition;
        }

        return { x: newX, y: newY };
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [mousePosition]);

  useGSAP(() => {
    if (!initDone) return;
    gsap.to(".time", {
      id: "intro-time-opacity",
      opacity: 1,
      duration: 0.8,
      ease: "power4.out",
      stagger: 0.3,
      onComplete: () => {
        console.log("intro-time-opacity complete");
        setIntroStoreDone(true);
      },
    });
  }, [initDone]);

  // Optimized gradient animation
  useGSAP(
    () => {
      if (!gradientRef.current || !initDone) return;

      // Original gradient position
      const originalX = 631.295;
      const originalY1 = -180.542;
      const originalY2 = 660.071;

      // Smaller, more subtle movement
      const offsetX = (lerpedPosition.x - 0.5) * 100; // Max 15px movement
      const offsetY = (lerpedPosition.y - 0.5) * 75; // Max 10px movement

      // Use transform instead of attr for better performance
      gsap.to(gradientRef.current, {
        id: "intro-gradient-animation",
        attr: {
          x1: originalX + offsetX,
          y1: originalY1 + offsetY,
          x2: originalX + offsetX,
          y2: originalY2 + offsetY,
        },
        duration: 0.1, // Faster updates
        ease: "none", // No easing for smoother performance
      });
    },
    { dependencies: [lerpedPosition, initDone] }
  );

  // Initial gradient animation - grow from bottom
  useGSAP(() => {
    if (!gradientRef.current) return;

    gsap.set(gradientRef.current, {
      attr: {
        x1: 631.295,
        y1: 548, // Start from bottom of SVG
        x2: 631.295,
        y2: 548, // Start from bottom of SVG
      },
    });

    const tl = gsap
      .timeline({
        id: "intro-gradient-animation",
        paused: true,
        lazy: true,
        immediateRender: false,
        onComplete: () => {
          console.log("intro-gradient-animation complete");
        },
      })
      .to(gradientContainerRef.current, {
        autoAlpha: 1,
        duration: 1,
        delay: 1,
        ease: "power2.out",
      })
      .to(
        gradientRef.current,
        {
          attr: {
            y1: -180.542, // Animate to original top position
            y2: 660.071, // Animate to original bottom position
          },
          duration: 1,

          ease: "power4.out",

          onComplete: () => {
            setInitDone(true);
          },
        },
        "<"
      );
    tl.play();
  }, []);

  useGSAP(() => {
    if (cssSnap) return;
    gsap.to(ref.current, {
      id: "intro-fade-out-cssSnap",
      scrollTrigger: {
        id: "intro-trigger",
        trigger: ref.current,
        start: "top top",
        end: "+=50%",
        markers: false,
        scrub: true,
        onEnter: () => {},
        onLeave: () => {},
        onEnterBack: () => {},
      },
      autoAlpha: 0,
      display: "none",
      duration: 1,
      ease: "power2.out",
    });
  });

  const fadeOutRef = useRef<any>(null);
  useGSAP(() => {
    if (!cssSnap) return;
    fadeOutRef.current = gsap
      .timeline({ paused: true, id: "intro-fade-out-tl" })
      .addLabel("start")
      .to(ref.current, {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power4.out",
      });
  }, []);

  useGSAP(() => {
    if (!fadeOutRef.current) return;
    if (!inView) {
      fadeOutRef.current.restart();
    } else {
      fadeOutRef.current.pause();
      fadeOutRef.current.seek("start");
    }
  }, [inView]);

  return (
    <Box
      ref={ref}
      id="intro"
      className="intro w-screen h-screen fixed top-0 left-0 opacity-100 snap-section "
    >
      <div
        ref={gradientContainerRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none  flex flex-col items-center justify-center px-3 lg:px-12 opacity-0"
      >
        <svg
          ref={svgRef}
          width="1311"
          height="548"
          viewBox="0 0 1311 548"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          // onMouseMove={handleMouseMove}
          className="pointer-events-auto w-full h-auto max-w-[1200px]"
          style={{ willChange: "transform" }} // Optimize for animations
        >
          <mask
            id="mask0_1341_3952"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1311"
            height="548"
          >
            <path
              d="M1277.45 132.743C1166.19 144.284 1073.1 195.281 1006.5 281.668C953.009 351.056 917.707 444.294 909.08 538.328H1040.27C1045.39 497.792 1061.17 424.367 1109.91 361.119C1144.38 316.376 1188.63 286.472 1241.95 271.605"
              fill="#1A1A1A"
            />
            <path
              d="M227.872 548C87.2027 548 4.95313 459.737 4.95313 315.445V182.667C4.95313 99.7759 4.18444 56.7955 0.341003 0H102.576C99.5017 55.2605 98.733 101.311 98.733 182.667V326.19C98.733 427.501 159.459 491.204 255.545 491.204C351.631 491.204 401.596 435.944 410.051 346.913C413.126 324.655 413.895 295.49 413.895 270.162C413.895 193.412 407.745 96.7059 396.984 0H455.404L454.635 309.305C453.867 459.737 369.311 548 227.872 548Z"
              fill="#1A1A1A"
            />
            <path
              d="M676.018 537.255H513.825C516.9 485.064 518.437 442.851 518.437 353.821V183.434C518.437 95.1709 516.9 52.1905 513.825 0H676.018C794.396 0 864.347 44.5154 864.347 123.569C864.347 188.039 819.763 236.392 736.744 250.207C837.442 259.417 886.638 306.235 886.638 383.753C886.638 478.157 808.232 537.255 676.018 537.255ZM670.637 234.09C729.826 234.09 772.873 191.877 772.873 130.476C772.873 69.0756 733.67 36.0728 671.406 36.0728H609.911V234.09H670.637ZM672.943 499.647C747.506 499.647 791.321 455.899 791.321 382.986C791.321 310.073 746.737 271.697 676.787 271.697H609.911V499.647H672.943Z"
              fill="#1A1A1A"
            />
            <path
              d="M1277.42 132.458H896.297L929.037 2.18066H1310.16L1277.42 132.458Z"
              fill="#1A1A1A"
            />
          </mask>
          <g mask="url(#mask0_1341_3952)">
            <rect
              x="-47.5741"
              y="-180.542"
              width="1357.74"
              height="753.854"
              fill="url(#paint0_linear_1341_3952)"
            />
          </g>
          <defs>
            <linearGradient
              ref={gradientRef}
              id="paint0_linear_1341_3952"
              x1="631.295"
              y1="-180.542"
              x2="631.295"
              y2="660.071"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.1875" stopColor="#D9D9D9" />
              <stop offset="0.307692" stopColor="#FEFFC2" />
              <stop offset="0.639423" stopColor="#7EFA50" />
              <stop offset="0.913462" stopColor="#09603D" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none  hidden lg:flex flex-col items-center justify-start p-7   ">
        <div
          className={
            "flex flex-row gap-10  text-dark-green text-sm font-mono leading-1.1"
          }
        >
          <div className="flex flex-col items-center time opacity-0">
            Madrid
            <Clock location="Europe/Madrid" />
          </div>
          <div className="flex flex-col items-center time opacity-0">
            Sao Paulo <Clock location="America/Sao_Paulo" />
          </div>
          <div className="flex flex-col items-center time opacity-0">
            London <Clock location="Europe/London" />
          </div>
        </div>
      </div>
    </Box>
  );
};

export default SectionIntro;
