"use client";
import Box from "../../ui/Box/Box";
import clsx from "clsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

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

type SwiperSettings = {
  spaceBetween?: number;
  slidesPerView?: number;
  slidesOffsetBefore?: number;
  slidesOffsetAfter?: number;
  loop?: boolean;
  freeMode?: {
    enabled?: boolean;
    momentum?: boolean;
    momentumRatio?: number;
    momentumVelocityRatio?: number;
  };
  autoplay?: {
    delay?: number;
    disableOnInteraction?: boolean;
    pauseOnMouseEnter?: boolean;
  };
  speed?: number;
};

type Props = {
  type?: "media" | "team";
  data?: any;
  settings?: SwiperSettings;
};

const Slider = (props: Props) => {
  const { type = "team", data, settings } = props;

  const defaultSettings: SwiperSettings = {
    spaceBetween: 50,
    slidesPerView: 2.3,
    slidesOffsetBefore: 30,
    slidesOffsetAfter: 30,
    loop: false,
    speed: 800,
    grabCursor: true,
    resistance: true,
    resistanceRatio: 0.85,
    freeMode: {
      enabled: true,
      momentum: true,
      momentumRatio: 0.6,
      momentumVelocityRatio: 0.6,
      momentumBounce: false,
      momentumBounceRatio: 0.1,
      minimumVelocity: 0.02,
    },
  };

  const swiperSettings = {
    ...defaultSettings,
    ...settings,
    modules: [FreeMode],
    className: "w-full",
    onSlideChange: () => {},
    onSwiper: (swiper: any) => {},
  };

  return (
    <Swiper {...swiperSettings}>
      {type === "team"
        ? teamMembers.map((m, index) => (
            <SwiperSlide key={index} className="w-[30vw]">
              <Box className="team-member bg-white rounded-2xl h-full w-full opacity-100">
                <Box className="px-3 py-2 flex flex-col gap-1 h-full">
                  <Box className="team-member-name text-light-grey text-base/none opacity-100">
                    {m.name}
                  </Box>
                  <Box className="flex flex-row items-stretch justify-start gap-2 h-full">
                    <Box className="team-member-image h-full opacity-100 flex items-center justify-center ">
                      <img
                        src={m.image}
                        width={267}
                        height={312}
                        className="w-full h-full object-cover aspect-266/311"
                      />
                    </Box>
                    <Box className="flex-2 text-light-grey flex flex-col justify-between">
                      <Box className="team-member-text text-base opacity-100">
                        {m.text}
                      </Box>
                      <Box className="flex flex-row items-center justify-start gap-1">
                        {m.socials.map((s, index) => (
                          <Box
                            key={index}
                            className="font-mono text-sm text-light-grey bg-gray-100 rounded-xl px-2 py-0.5"
                          >
                            <span className="team-member-social opacity-100">
                              {s.platform}
                            </span>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </SwiperSlide>
          ))
        : data?.map((item: any, index: number) => (
            <SwiperSlide key={index}>
              <img
                src={item.url}
                alt={"item.alt"}
                className="w-full h-full object-cover aspect-361/301"
              />
            </SwiperSlide>
          ))}
    </Swiper>
  );
};

export default Slider;
