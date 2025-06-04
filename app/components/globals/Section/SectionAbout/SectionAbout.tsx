import Box from "../../../ui/Box/Box";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Slider from "../../../shared/Slider/Slider";
import clsx from "clsx";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const SectionAbout = () => {
  const container = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [sliderActive, setSliderActive] = useState(false);
  const animationRef = useRef<any>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [currentProgress, setCurrentProgress] = useState<string>("0");
  const currentPositionRef = useRef(0);
  const visibleSlidesRef = useRef<number>(1);
  const newXPercentRef = useRef(0);

  useGSAP(() => {
    const slides = gsap.utils.toArray(".team-member");
    const wrapper = document.querySelector(".slider-wrapper") as HTMLElement;

    const calcOffset = () => {
      const gap = 32; // 32px gap between slides
      const totalGaps = slides.length; // Number of gaps is one less than number of slides
      const totalGapWidth = totalGaps * gap;

      const offset =
        slides.reduce((acc: number, slide: any) => {
          return acc + slide.offsetWidth;
        }, 0) - totalGapWidth;

      const sliderWidth = sliderContainerRef.current?.offsetWidth || 0;
      const rightEdge = 30; // 30px from right edge

      // Calculate the total width we want to scroll
      const totalScrollWidth = offset - 48 * 2 - sliderWidth;

      // Convert to percentage
      return (totalScrollWidth / sliderWidth) * 100;
    };

    const scrollTween = gsap.to(".slider-wrapper", {
      ease: "none",
      scrollTrigger: {
        trigger: sliderContainerRef.current,
        scrub: 0.1,
        start: "bottom bottom-=50%",
        end: "+=1000",
        id: "slider-scroll",
        markers: false,
      },
    });

    // Create a timeline for the fade-in sequence
    // const fadeTimeline = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: sliderContainerRef.current,
    //     toggleActions: "play none reverse reverse",
    //     scrub: true,
    //     start: "bottom bottom-=50%",
    //     end: "+=1000",
    //     id: "fade-sequence",
    //     markers: true,
    //     onUpdate: (self) => {
    //       const progress = self.progress;
    //     },

    //     onLeaveBack: () => {
    //       // When scrolling up, animate back to start
    //       // gsap.to(".slider-wrapper", {
    //       //   xPercent: 0,
    //       //   duration: 0.5,
    //       //   ease: "power2.inOut",
    //       // });
    //     },
    //   },
    // });

    slides.forEach((slide: any, index: number) => {
      const start = `bottom bottom-=${50 + index * 10}%`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: slide,
          start,
          end: "+=50",
          id: `slide-animation-${index}`,
          markers: { indent: 300 * index },
          toggleActions: "play none reverse reverse",
          onEnterBack: () => {
            visibleSlidesRef.current = 0;
            gsap.to(".slider-wrapper", {
              xPercent: 0,
              duration: 0.3,
              ease: "power2.inOut",
            });
          },
        },
      });

      tl.to(slide, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          console.log("complete", visibleSlidesRef.current);
          const slideWidth = slide.offsetWidth;
          const gap = 32;

          const p = (slideWidth / window.innerWidth) * 100;

          // const viewportWidth = window.innerWidth;

          const visibleSlides = Array.from(slides).filter((slide: any) => {
            const opacity = window.getComputedStyle(slide).opacity;
            return parseFloat(opacity) > 0;
          });

          const visibleWidth =
            visibleSlides.reduce((acc: number, slide: any) => {
              return acc + slide.offsetWidth;
            }, 0) +
            (visibleSlides.length - 1) * 32; // Add gaps between visible slides

          // const offset = visibleWidth - viewportWidth;

          // // Get the current xPercent value from the slider wrapper

          // const p = (offset / viewportWidth) * 100;
          // const newXPercent = Math.abs(currentPositionRef.current) - p;

          // console.table({
          //   o: offset,
          //   visibleWidth: visibleWidth,
          //   p: p,
          //   currentPositionRef: currentPositionRef.current,
          //   newXPercent,
          // });

          console.log(visibleSlidesRef.current % 3);
          const slidesPerView = 3;
          if (visibleSlidesRef.current % slidesPerView === 0) {
            const page = Math.floor(visibleSlidesRef.current / slidesPerView);
            // Start the xPercent animation
            gsap.to(".slider-wrapper", {
              x: -window.innerWidth * page,
              duration: 0.3,
              delay: 0.2,
              ease: "power2.inOut",
            });
          }
          visibleSlidesRef.current = visibleSlidesRef.current + 1;
        },
      });
    });

    // // Add each slide to the timeline
    // slides.forEach((slide: any, index: number) => {
    //   fadeTimeline.to(slide, {
    //     opacity: 1,
    //     duration: 0.3,
    //     ease: "power2.inOut",
    //     onComplete: () => {
    //       // Calculate width of visible slides (those with opacity > 0)
    //       const visibleSlides = Array.from(slides).filter((slide: any) => {
    //         const opacity = window.getComputedStyle(slide).opacity;
    //         return parseFloat(opacity) > 0;
    //       });

    //       const visibleWidth =
    //         visibleSlides.reduce((acc: number, slide: any) => {
    //           return acc + slide.offsetWidth;
    //         }, 0) +
    //         (visibleSlides.length - 1) * 32; // Add gaps between visible slides

    //       if (visibleWidth > viewportWidth) {
    //         // Start the xPercent animation
    //         gsap.to(".slider-wrapper", {
    //           xPercent: -calcOffset(),
    //           duration: 0.5,
    //           ease: "power2.inOut",
    //         });
    //       }
    //     },
    //   });
    // });

    // // Create the scroll tween for the xPercent animation
    // const scrollTween = gsap.to(".slider-wrapper", {
    //   // xPercent: () => -calcOffset(),
    //   ease: "none",
    //   scrollTrigger: {
    //     trigger: sliderContainerRef.current,
    //     pin: false,
    //     pinSpacing: false,
    //     scrub: 0.1,
    //     start: "bottom bottom-=50%",
    //     end: "+=1000",
    //     id: "slider-scroll",
    //     markers: false,
    //   },
    // });

    const hideImage = gsap.to(imageContainerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      paused: true, // important: manual control
    });
    const showSlider = gsap.to(sliderContainerRef.current, {
      opacity: 1,
      duration: 0.3,
      delay: 0.2,
      ease: "power2.inOut",
      paused: true, // important: manual control
    });

    const hideSlider = gsap.to(sliderContainerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      paused: true, // important: manual control
    });

    // Main container pin
    ScrollTrigger.create({
      trigger: container.current,
      start: "bottom bottom",
      end: () => scrollTween.scrollTrigger?.end || "+=1000",
      markers: false,
      id: "pinned-container",
      scrub: false,
      toggleActions: "play none reverse reverse",
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      // onUpdate: (self) => {
      //   setCurrentProgress(self.progress.toFixed(2));
      // },
    });

    // Transition to slider
    ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "bottom bottom-=50%",
      end: "+=300",
      markers: false,
      id: "hide-image",
      onEnter: () => {
        hideImage.play();
        showSlider.play();
      },
      onLeaveBack: () => {
        hideImage.reverse();
        showSlider.reverse();
      },
    });
  }, []);

  return (
    <div
      ref={container}
      className={clsx("flex flex-row gap-0 w-full h-full overflow-hidden ")}
    >
      <div className="w-screen h-screen flex items-end justify-start pb-8">
        <Box
          ref={wrapperRef}
          className="wrapper relative flex flex-row items-end justify-start flex-nowrap w-[100vw] h-screen opacity-100"
        >
          <div
            ref={imageContainerRef}
            className="absolute bottom-0 left-0 h-full flex items-end justify-start opacity-100 pl-3"
          >
            <img
              src="/Reel.jpg"
              width={"693"}
              height={"376"}
              className="w-auto h-full max-h-[376px]"
            />
          </div>

          <div
            ref={sliderContainerRef}
            className="absolute bottom-0 left-0 w-full h-screen opacity-0"
          >
            <Slider />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default SectionAbout;
