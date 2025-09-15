"use client";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
} from "media-chrome/react";

// import { VideoAsset } from "@/types/VideoAsset";
// import * as styles from "./VideoPlayer.css";
import clsx from "clsx";
import { useEffect, useRef } from "react";

type Props = {
  src: string;
  module?: "overlay" | "inline";
  forcedAspectRatio?: boolean;
  poster?: string;
  playInline?: boolean;
  autoPlay?: boolean;
};

const VideoPlayer = (props: Props) => {
  const {
    src,
    module,
    forcedAspectRatio = false,
    poster = "",
    playInline = false,
    autoPlay = false,
  } = props;

  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    console.log("check video ref");
    if (ref.current) {
      console.log(ref.current);
      ref.current.play();
      ref.current.muted = false;
    }
  }, []);

  return (
    <MediaController
    // className={clsx({ [styles.playerMediaController]: module === "overlay" })}
    >
      <video
        ref={ref}
        // className={styles.playerVideoElement}
        slot="media"
        src={src}
        preload="auto"
        crossOrigin=""
        poster={poster}
        playsInline={playInline}
        autoPlay={autoPlay}
        muted={true}
        style={{ aspectRatio: forcedAspectRatio ? "16 / 9" : undefined }}
      />

      <MediaPlayButton />

      <MediaControlBar
      // className={styles.playerMediaControlBar}
      >
        <MediaTimeRange
        // className={styles.playerMediaTimeRange}
        ></MediaTimeRange>
        <MediaTimeDisplay
          // className={styles.playerMediaTimeDisplay}
          showDuration
        ></MediaTimeDisplay>
      </MediaControlBar>
    </MediaController>
  );
};

export default VideoPlayer;
