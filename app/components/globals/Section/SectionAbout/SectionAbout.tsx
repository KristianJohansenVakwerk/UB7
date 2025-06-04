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

  useGSAP(() => {
    // Parent ScrollTrigger for pinning
    // const parentTrigger = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: container.current,
    //     start: "top +=20%",
    //     end: "+=70%", // This should be enough to cover both animations
    //     pin: true,
    //     pinSpacing: false,
    //     anticipatePin: 1,
    //     markers: { indent: 500 },
    //     id: "section-about-parent",
    //   },
    // });

    animationRef.current = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: container.current,
        start: "bottom-=296px bottom-=376px",
        end: "+=100%",
        markers: { indent: 500 },
        scrub: 0.01,
        toggleActions: "play none reverse reverse",
        id: "section-about",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    // 2. Toggle-based animation (plays once on enter/enterBack)
    const showWrapper = gsap.to(wrapperRef.current, {
      opacity: 1,
      duration: 0.1,
      paused: true, // important: manual control
    });

    const hideImage = gsap.to(imageContainerRef.current, {
      opacity: 0,
      duration: 0.1,
      paused: true, // important: manual control
    });

    ScrollTrigger.create({
      trigger: container.current,
      start: "bottom-=296px bottom-=376px",
      end: "+=200", // 200px scroll range
      markers: true,
      id: "show-wrapper",
      onEnter: () => showWrapper.play(),
      onLeaveBack: () => showWrapper.reverse(),
      // Optional: reset on leave forward if needed
      // onLeave: () => toggleTween.reverse(),
    });

    ScrollTrigger.create({
      trigger: container.current,
      start: "top center",
      end: "+=200",
      markers: true,
      id: "hide-image",
      onEnter: () => hideImage.play(),
      onLeaveBack: () => hideImage.reverse(),
      // Optional: reset on leave forward if needed
      // onLeave: () => toggleTween.reverse(),
    });

    // animationRef.current.to(wrapperRef.current, {
    //   opacity: 1,
    //   duration: 0.3,
    //   ease: "power2.inOut",
    // });

    // animationRef.current.to(imageContainerRef.current, {
    //   opacity: 0,
    //   duration: 0.3,
    //   ease: "power2.inOut",
    // });

    // animationRef.current.to(
    //   sliderContainerRef.current,
    //   {
    //     opacity: 1,
    //     duration: 0.3,
    //     ease: "power2.inOut",
    //   },
    //   ">"
    // );
    // // animationRef.current.to(container.current, {
    //   onEnter: () => {
    //     gsap.to(wrapperRef.current, {
    //       opacity: 1,
    //       ease: "power2.inOut",
    //     });
    //   },
    // });

    // animationRef.current.to(container.current, {
    //   onEnter: () => {
    //     gsap.to(sliderContainerRef.current, {
    //       opacity: 1,
    //       ease: "power2.inOut",
    //     });
    //   },
    // });

    // First animation (image to slider transition)
    // animationRef.current = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: container.current,
    //     start: "0%", // Relative to parent
    //     end: "15%", // Relative to parent
    //     markers: { indent: 500 },
    //     scrub: 0.01,
    //     toggleActions: "play none reverse reverse",
    //     id: "section-about",
    //     onEnter: () => {
    //       gsap.to(container.current, {
    //         opacity: 1,
    //         duration: 0.4,
    //         ease: "power2.inOut",
    //       });
    //     },
    //     // ... rest of the callbacks stay the same
    //   },
    // });

    // // Second animation (slider)
    // const sliderWrapper = sliderContainerRef.current?.querySelector(
    //   ".slider-wrapper"
    // ) as HTMLElement;
    // const teamMembers = gsap.utils.toArray(".team-member");

    // const totalWidth = teamMembers.reduce((acc: number, member: any) => {
    //   return acc + member.offsetWidth + 30;
    // }, 0);

    // const sliderTimeline = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: container.current,
    //     start: "15%", // Start after first animation
    //     end: "100%", // Use full parent duration
    //     scrub: 0.01,
    //     markers: { indent: 600 },
    //     id: "slider-scroll",
    //   },
    // });

    // sliderTimeline.to(sliderWrapper, {
    //   x: () => -(totalWidth - (sliderContainerRef.current?.offsetWidth || 0)),
    //   ease: "none",
    // });
  }, []);

  // useGSAP(() => {
  //   const w = imageContainerRef.current?.clientWidth;

  //   gsap.to(container.current, {
  //     scrollTrigger: {
  //       trigger: container.current,
  //       start: "bottom bottom%",
  //       end: "bottom bottom",
  //       scrub: 0.01,
  //       markers: true,
  //       pin: true,
  //       pinSpacing: false,
  //       anticipatePin: 1,
  //       id: "section-about-pin",
  //       markers: { indent: 800 },
  //     },
  //   });

  //   animationRef.current = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: container.current,

  //       start: "top +=20%", // ~80% scroll
  //       end: "+=10%",
  //       markers: { indent: 500 },
  //       scrub: 0.01,
  //       toggleActions: "play none reverse reverse",
  //       id: "section-about",

  //       onEnter: () => {
  //         gsap.to(container.current, {
  //           opacity: 1,
  //           duration: 0.4,
  //           ease: "power2.inOut",
  //         });
  //       },
  //       onEnterBack: () => {
  //         gsap.to(sliderContainerRef.current, {
  //           opacity: 0,
  //           duration: 0.5,
  //           ease: "power3.inOut",
  //           onComplete: () => {
  //             setSliderActive(false);
  //             gsap.to(imageContainerRef.current, {
  //               x: 0,
  //               opacity: 1,
  //               delay: 0.2,
  //               force3D: true,
  //               willChange: "transform",
  //               ease: "power2.inOut",
  //               duration: 0.5,
  //             });
  //           },
  //         });
  //       },
  //       onLeave: () => {
  //         gsap.to(imageContainerRef.current, {
  //           x: w ? -w - 200 : -100,
  //           opacity: 0,
  //           force3D: true,
  //           willChange: "transform",
  //           ease: "power2.inOut",
  //           duration: 0.5,
  //           onComplete: () => {
  //             gsap.to(sliderContainerRef.current, {
  //               opacity: 1,
  //               duration: 0.5,
  //               ease: "power3.inOut",
  //               delay: 0.2,
  //               onComplete: () => {
  //                 setSliderActive(true);
  //               },
  //             });
  //           },
  //         });
  //       },
  //       onLeaveBack: () => {
  //         gsap.to(container.current, {
  //           opacity: 0,
  //           duration: 0.5,
  //           ease: "power3.inOut",
  //         });
  //       },
  //     },
  //   });
  // }, []);

  // Add this after your existing useGSAP hook
  // useGSAP(() => {
  //   const sliderWrapper = sliderContainerRef.current?.querySelector(
  //     ".slider-wrapper"
  //   ) as HTMLElement;
  //   const teamMembers = gsap.utils.toArray(".team-member");

  //   // Calculate total width of all team members
  //   const totalWidth = teamMembers.reduce((acc: number, member: any) => {
  //     return acc + member.offsetWidth + 30; // Add 30px per child
  //   }, 0);

  //   // Create a new timeline for the slider animation
  //   const sliderTimeline = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: container.current,
  //       start: "+=30% +=10%", // Start after the image-to-slider transition
  //       end: "+=30%", // End further down the page
  //       // end: () => `+=${totalWidth}`, // Scroll distance equals the total width of all slides
  //       scrub: 0.01,
  //       markers: true, // Remove this in production

  //       id: "slider-scroll",
  //       onEnter: () => {
  //         // Optional: Add any enter animations
  //       },
  //       onLeave: () => {
  //         // Optional: Add any leave animations
  //       },
  //     },
  //   });

  //   // Animate the slider wrapper
  //   sliderTimeline.to(sliderWrapper, {
  //     x: () => -(totalWidth - (sliderContainerRef.current?.offsetWidth || 0)),
  //     ease: "none",
  //   });
  // }, []);

  return (
    <div
      ref={container}
      className={clsx(
        "flex flex-row gap-0 w-full h-full overflow-hidden pl-3 bg-red-500"
      )}
    >
      <Box
        ref={wrapperRef}
        className="wrapper relative flex flex-row items-end justify-start flex-nowrap w-[100vw] h-[376px] opacity-0 pr-3"
      >
        <div
          ref={imageContainerRef}
          className="absolute bottom-0 left-0 h-full opacity-100"
        >
          <img
            src="/Reel.jpg"
            width={"693"}
            height={"376"}
            className="w-auto h-full"
          />
        </div>

        <div
          ref={sliderContainerRef}
          className="relative flex-1 w-[100vw] h-full opacity-0"
        >
          <Slider />
        </div>
      </Box>
    </div>
  );
};

export default SectionAbout;
