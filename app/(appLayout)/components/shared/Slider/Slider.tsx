"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Draggable from "gsap/Draggable";
import InertiaPlugin from "gsap/InertiaPlugin";
import { useEffect, useRef } from "react";
import CustomImage from "../Image/Image";

gsap.registerPlugin(Draggable, InertiaPlugin);

type Props = {
  type?: "media" | "team";
  data?: any;
};

const Slider = (props: Props) => {
  const { type = "team", data } = props;
  const sliderRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<any>(null);

  useGSAP(() => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;

    const slides = gsap.utils.toArray(".slide-box", slider);

    timelineRef.current = useSliderLoop(slides, { speed: 0.5, center: false });
  });

  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={sliderRef} className="slider-wrapper pl-2 lg:pl-3">
      {data?.map((item: any, index: number) => (
        <div className="slide-box mr-2 lg:mr-3" key={index}>
          <CustomImage
            asset={item.asset}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default Slider;

const useSliderLoop = (items: any, config: any) => {
  config = config || {};

  let lastIndex = 0,
    tl: any = gsap.timeline({
      repeat: -1,
      paused: true,
      defaults: { ease: "none" },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
    });

  let proxy = document.createElement("div"),
    container: HTMLElement = items[0].parentNode,
    length = items.length,
    startX = items[0].offsetLeft,
    times: number[] = [],
    widths: number[] = [],
    spaceBefore: number[] = [],
    xPercents: number[] = [],
    curIndex = 0,
    indexIsDirty = false,
    wrap = gsap.utils.wrap(0, 1),
    ratio: number,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap =
      config.snap === false
        ? (v: number) => v
        : gsap.utils.snap(config.snap || 1),
    startProgress: number,
    initChangeX,
    center = config.center || true,
    timeOffset = 0,
    totalWidth: number,
    getTotalWidth = () => {
      return (
        items[length - 1].offsetLeft +
        (xPercents[length - 1] / 100) * widths[length - 1] -
        startX +
        spaceBefore[0] +
        items[length - 1].offsetWidth *
          (gsap.getProperty(items[length - 1], "scaleX") as number) +
        (parseFloat("0px") || 0)
      );
    },
    populateWidths = () => {
      let b1 = container.getBoundingClientRect(),
        b2;
      items.forEach((el: any, i: number) => {
        widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as any);
        xPercents[i] = snap(
          (parseFloat(gsap.getProperty(el, "x", "px") as any) / widths[i]) *
            100 +
            (gsap.getProperty(el, "xPercent") as number)
        );
        b2 = el.getBoundingClientRect();

        spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
        b1 = b2;
      });
      gsap.set(items, {
        // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
        xPercent: (i) => xPercents[i],
      });

      totalWidth = getTotalWidth();
    },
    timeWrap: any,
    populateOffsets = () => {
      timeOffset = center
        ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth
        : 0;
      center &&
        times.forEach((t, i) => {
          times[i] = timeWrap(
            tl.labels["label" + i] +
              (tl.duration() * widths[i]) / 2 / totalWidth -
              timeOffset
          );
        });
    },
    getClosest = (values: any, value: any, wrap: any) => {
      let i = values.length,
        closest = 1e10,
        index = 0,
        d;
      while (i--) {
        d = Math.abs(values[i] - value);
        if (d > wrap / 2) {
          d = wrap - d;
        }
        if (d < closest) {
          closest = d;
          index = i;
        }
      }
      return index;
    },
    populateTimeline = () => {
      let i, item, curX, distanceToStart, distanceToLoop;

      tl.clear();
      for (i = 0; i < length; i++) {
        item = items[i];

        curX = (xPercents[i] / 100) * widths[i];
        distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
        distanceToLoop =
          distanceToStart +
          widths[i] * (gsap.getProperty(item, "scaleX") as any);

        tl.to(
          item,
          {
            xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
            duration: distanceToLoop / pixelsPerSecond,
          },
          0
        )
          .fromTo(
            item,
            {
              xPercent: snap(
                ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
              ),
            },
            {
              xPercent: xPercents[i],
              duration:
                (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
              immediateRender: false,
            },
            distanceToLoop / pixelsPerSecond
          )
          .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
      }
      timeWrap = gsap.utils.wrap(0, tl.duration());
    },
    refresh = (deep: any) => {
      let progress = tl.progress();
      tl.progress(0, true);
      populateWidths();
      deep && populateTimeline();
      populateOffsets();
      deep && tl.draggable
        ? tl.time(times[curIndex], true)
        : tl.progress(progress, true);
    };

  gsap.set(items as any, { x: 0 });
  populateWidths();
  populateTimeline();
  populateOffsets();
  window.addEventListener("resize", () => refresh(true));

  const toIndex = (index: number, vars: any) => {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length);

    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex && index !== curIndex) {
      // if we're wrapping the timeline's playhead, make the proper adjustments
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    if (time < 0 || time > tl.duration()) {
      vars.modifiers = { time: timeWrap };
    }

    curIndex = newIndex;
    vars.overwrite = true;
    gsap.killTweensOf(proxy);
    return vars.duration === 0
      ? tl.time(timeWrap(time))
      : tl.tweenTo(time, vars);
  };
  tl.toIndex = (index: number, vars: any) => toIndex(index, vars);
  tl.closestIndex = (setCurrent: boolean) => {
    let index = getClosest(times, tl.time(), tl.duration());
    if (setCurrent) {
      curIndex = index;
      indexIsDirty = false;
    }
    return index;
  };
  tl.current = () => (indexIsDirty ? tl.closestIndex(true) : curIndex);
  tl.times = times;
  tl.progress(1, true).progress(0, true);

  let align: any = () =>
      tl.progress(
        wrap(startProgress + (draggable.startX - draggable.x) * ratio)
      ),
    syncIndex = () => tl.closestIndex(true),
    draggable = Draggable.create(proxy, {
      trigger: items[0].parentNode,
      type: "x",
      onPressInit() {
        let x = this.x;
        gsap.killTweensOf(tl);
        startProgress = tl.progress();
        refresh(true);
        ratio = 1 / totalWidth;
        initChangeX = startProgress / -ratio - x;
        gsap.set(proxy, { x: startProgress / -ratio });
      },
      onDrag: align,
      onThrowUpdate: align,
      onRelease: () => {
        syncIndex();
      },
      onThrowComplete: syncIndex,
      overshootTolerance: 0,
      inertia: true,
    })[0];

  tl.draggable = draggable;

  tl.closestIndex(true);
  lastIndex = curIndex;
};
