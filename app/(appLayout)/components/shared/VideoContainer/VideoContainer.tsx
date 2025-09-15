"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import { useStore } from "@/store/store";
import { classFormatter } from "@/app/(appLayout)/utils/utils";

type Props = {
  src: string;
  previewSrc?: string;
};
const VideoContainer = (props: Props) => {
  const { src, previewSrc } = props;
  const ref = useRef<HTMLVideoElement>(null);
  const { aboutVideoExpanded, setAboutVideoExpanded } = useStore();
  const [canPlay, setCanPlay] = useState(false);

  const handlePlay = useCallback(() => {
    if (!aboutVideoExpanded) return;

    setCanPlay(true);
  }, [aboutVideoExpanded]);

  useEffect(() => {
    if (!canPlay) return;

    if (ref.current) {
      ref.current.play();
    }
  }, [canPlay]);

  useEffect(() => {
    if (!aboutVideoExpanded) {
      if (ref.current) {
        setCanPlay(false);
      }
    }
  }, [aboutVideoExpanded]);

  return (
    <>
      <div
        className="w-full h-full max-md:aspect-[340/640] md:aspect-[2204/1080] cursor-pointer"
        onClick={handlePlay}
      >
        <video
          key={canPlay ? "play" : "pause"}
          ref={ref}
          src={src}
          loop
          poster="/test-media/test_video_short.webp"
          className="w-full h-full object-cover object-center rounded-2xl"
        />
      </div>
      <div
        className={classFormatter([
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition opacity-100",
          "duration-500 delay-300 ease-in-out",
        ])}
        style={{ opacity: canPlay ? 0 : 1 }}
      >
        <div className="flex flex-col gap-2">
          <div className="font-mono text-white text-base">Play</div>
        </div>
      </div>
    </>
  );
};

export default VideoContainer;
