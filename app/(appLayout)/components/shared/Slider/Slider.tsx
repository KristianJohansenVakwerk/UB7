"use client";
import { useEffect, useRef, useState } from "react";
import CustomImage from "../Image/Image";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import clsx from "clsx";

type Props = {
  type?: "media" | "team";
  data?: any;
};

const Slider = (props: Props) => {
  const { type = "team", data } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {data?.map((item: any, index: number) => (
          <SwiperSlide key={index}>
            <div className="aspect-[450/275] rounded-2xl overflow-hidden w-[calc(100%-40px)] mx-auto">
              <CustomImage
                asset={item.asset}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}

        <div className="swiper-pagination flex flex-row gap-1 justify-center items-center">
          {data?.map((item: any, index: number) => (
            <PaginationBullet
              key={index}
              index={index}
              isActive={activeIndex === index}
            />
          ))}
        </div>
      </Swiper>
    </>
  );
};

const PaginationBullet = (props: { index: number; isActive: boolean }) => {
  const { index, isActive } = props;
  const swiper = useSwiper();

  return (
    <div
      className={clsx(
        "swiper-pagination-bullet w-[8px] h-[8px] rounded-full  mt-[10px] transition-all duration-300 ease-in-out",
        isActive ? "bg-light-grey" : "bg-button-grey"
      )}
      onClick={() => swiper.slideTo(index)}
    />
  );
};

export default Slider;
