"use client";
import Box from "../../ui/Box/Box";
import clsx from "clsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface TeamMember {
  name: string;
  text: string;
  image: string;
  socials: {
    platform: string;
    url: string;
  }[];
}

export const teamMembers: TeamMember[] = [
  {
    name: "Thiago Silva Pontes 1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/test-media/m_1.jpg",
    socials: [
      { platform: "Website", url: "https://thiagosilva.com" },
      { platform: "Instagram", url: "https://instagram.com/thiagosilva" },
      { platform: "Youtube", url: "https://youtube.com/thiagosilva" },
    ],
  },
  {
    name: "Vinicius Junior 2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/test-media/m_2.jpg",
    socials: [
      { platform: "Website", url: "https://viniciusjr.com" },
      { platform: "Instagram", url: "https://instagram.com/viniciusjr" },
      { platform: "Youtube", url: "https://youtube.com/viniciusjr" },
    ],
  },
  {
    name: "Vini Jr.3",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/test-media/m_3.jpg",
    socials: [
      { platform: "Website", url: "https://vinijr.com" },
      { platform: "Instagram", url: "https://instagram.com/vinijr" },
      { platform: "Youtube", url: "https://youtube.com/vinijr" },
    ],
  },
  {
    name: "Thiago Silva Pontes 4",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/test-media/m_1.jpg",
    socials: [
      { platform: "Website", url: "https://thiagosilva.com" },
      { platform: "Instagram", url: "https://instagram.com/thiagosilva" },
      { platform: "Youtube", url: "https://youtube.com/thiagosilva" },
    ],
  },
  {
    name: "Vinicius Junior 5",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/test-media/m_2.jpg",
    socials: [
      { platform: "Website", url: "https://viniciusjr.com" },
      { platform: "Instagram", url: "https://instagram.com/viniciusjr" },
      { platform: "Youtube", url: "https://youtube.com/viniciusjr" },
    ],
  },
  {
    name: "Vini Jr. 6",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/test-media/m_3.jpg",
    socials: [
      { platform: "Website", url: "https://vinijr.com" },
      { platform: "Instagram", url: "https://instagram.com/vinijr" },
      { platform: "Youtube", url: "https://youtube.com/vinijr" },
    ],
  },
];

const Slider = () => {
  // useGSAP(() => {
  //   const containers = gsap.utils.toArray(".team-member");
  //   const names = gsap.utils.toArray(".team-member-name");
  //   const images = gsap.utils.toArray(".team-member-image");
  //   const texts = gsap.utils.toArray(".team-member-text");
  //   const socials = gsap.utils.toArray(".team-member-social");

  //   const sliderContainer = document.querySelector(
  //     ".slider-container"
  //   ) as HTMLElement;

  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: sliderContainer,
  //       start: "top top",
  //       end: "bottom bottom",
  //       scrub: true,
  //       markers: true,
  //       id: "slider-tl",
  //     },
  //   });

  //   containers.forEach((container: any, index: number) => {
  //     const name = names[index] as HTMLDivElement;
  //     const image = images[index] as HTMLDivElement;
  //     const text = texts[index] as HTMLDivElement;
  //     const socials = container.querySelectorAll(
  //       ".team-member-social"
  //     ) as NodeListOf<HTMLDivElement>;
  //     tl.to(container, {
  //       opacity: 1,
  //       x: 0,
  //       duration: 0.3,
  //       ease: "power2.inOut",
  //     });

  //     tl.to(
  //       name,
  //       {
  //         opacity: 1,
  //         duration: 0.3,
  //         ease: "power2.inOut",
  //       },
  //       `>`
  //     );

  //     tl.to(
  //       image,
  //       {
  //         opacity: 1,
  //         duration: 0.3,
  //         ease: "power2.inOut",
  //       },
  //       `>`
  //     );

  //     tl.to(
  //       text,
  //       {
  //         opacity: 1,
  //         duration: 0.3,
  //         ease: "power2.inOut",
  //       },
  //       `>`
  //     );

  //     tl.to(
  //       socials,
  //       {
  //         opacity: 1,
  //         duration: 0.2,
  //         stagger: 0.1,
  //         ease: "power2.inOut",
  //       },
  //       `>`
  //     );
  //   });

  //   // Calculate total width of all team members
  //   const totalWidth = containers.reduce((acc: number, container: any) => {
  //     return acc + container.offsetWidth + 8; // Add gap width (2 * 4px)
  //   }, 0);

  // Draggable.create(sliderWrapper, {
  //   type: "x",
  //   bounds: {
  //     minX: -(totalWidth - sliderContainer.offsetWidth),
  //     maxX: 0,
  //   },
  //   inertia: true,
  //   onDrag: function () {
  //     // Optional: Add any additional behavior during drag
  //   },
  //   onDragEnd: function (self) {
  //     // Get the current velocity
  //     console.log(self);
  //     const velocity = 0;

  //     // Calculate the distance to travel based on velocity
  //     const distance = velocity * 0.1; // Adjust multiplier to control throw distance

  //     // Get current position
  //     const currentX = gsap.getProperty(sliderWrapper, "x") as number;

  //     // Calculate target position
  //     let targetX = currentX + distance;

  //     // Clamp the target position within bounds
  //     targetX = Math.max(
  //       -(totalWidth - sliderContainer.offsetWidth),
  //       Math.min(0, targetX)
  //     );

  //     // Animate to the target position with easing
  //     gsap.to(sliderWrapper, {
  //       x: targetX,
  //       duration: 0.5,
  //       ease: "power2.out",
  //     });
  //   },
  // });
  // }, []);

  return (
    <Box className="slider-container w-full h-screen flex flex-col items-start justify-end overflow-hidden  px-3 ">
      <div className="slider-wrapper flex flex-row flex-nowrap items-start justify-start gap-2 h-[auto] -mx-3">
        {teamMembers.map((m, index) => {
          return (
            <Box
              key={index}
              className="team-member bg-white rounded-2xl h-full w-[33.333vw] shrink-0  opacity-0"
            >
              <Box className="px-3 py-2 flex flex-col gap-1">
                <Box className="team-member-name text-light-grey text-base/none opacity-100">
                  {m.name}
                </Box>
                <Box className="flex flex-row items-stretch justify-start gap-2 h-full">
                  <Box className="team-member-image flex-1 h-full opacity-100">
                    <img
                      src={m.image}
                      width={"267"}
                      height={"312"}
                      className="w-auto h-full max-h-[312px]"
                    />
                  </Box>
                  <Box className="flex-2  text-light-grey flex flex-col justify-between">
                    <Box className="team-member-text text-base opacity-100">
                      {m.text}
                    </Box>
                    <Box className="flex flex-row items-center justify-start gap-1">
                      {m.socials.map((s, index) => {
                        return (
                          <Box
                            key={index}
                            className="font-mono text-sm text-light-grey bg-(--background) rounded-xl px-1 py-0.5"
                          >
                            <span className="team-member-social opacity-100">
                              {s.platform}
                            </span>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </div>
    </Box>
  );
};

export default Slider;
