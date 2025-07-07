"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
gsap.registerPlugin(ScrollTrigger);

class TimelineEventManager {
  private static instance: TimelineEventManager;
  private timelineCallbacks: Map<
    string,
    {
      onComplete: (() => void)[];
      onUpdate: (() => void)[];
      onReverseComplete: (() => void)[];
      onScrollTriggerEnter: (() => void)[];
      onScrollTriggerLeave: (() => void)[];
      onScrollTriggerEnterBack: (() => void)[];
      onScrollTriggerLeaveBack: (() => void)[];
    }
  > = new Map();

  static getInstance() {
    if (!TimelineEventManager.instance) {
      TimelineEventManager.instance = new TimelineEventManager();
    }
    return TimelineEventManager.instance;
  }

  private getTimelineCallbacks(timelineId: string) {
    if (!this.timelineCallbacks.has(timelineId)) {
      this.timelineCallbacks.set(timelineId, {
        onComplete: [],
        onUpdate: [],
        onReverseComplete: [],
        onScrollTriggerEnter: [],
        onScrollTriggerLeave: [],
        onScrollTriggerEnterBack: [],
        onScrollTriggerLeaveBack: [],
      });
    }

    return this.timelineCallbacks.get(timelineId)!;
  }

  addEventCallback(
    timelineId: string,
    eventType: keyof ReturnType<TimelineEventManager["getTimelineCallbacks"]>,
    callback: () => void
  ) {
    const callbacks = this.getTimelineCallbacks(timelineId);
    callbacks[eventType].push(callback);
  }

  removeEventCallback(
    timelineId: string,
    eventType: keyof ReturnType<TimelineEventManager["getTimelineCallbacks"]>,
    callback: () => void
  ) {
    const callbacks = this.getTimelineCallbacks(timelineId);
    const index = callbacks[eventType].indexOf(callback);
    if (index !== -1) {
      callbacks[eventType].splice(index, 1);
    }
  }

  triggerCallbacks(
    timelineId: string,
    eventType: keyof ReturnType<TimelineEventManager["getTimelineCallbacks"]>
  ) {
    const callbacks = this.getTimelineCallbacks(timelineId);
    callbacks[eventType].forEach((callback) => callback());
  }

  hasCallbacks(timelineId: string): boolean {
    const callbacks = this.getTimelineCallbacks(timelineId);
    return Object.values(callbacks).some(
      (callbacksArray) => callbacksArray.length > 0
    );
  }

  cleanupTimeline(timelineId: string) {
    this.timelineCallbacks.delete(timelineId);
  }
}

export const eventManager = TimelineEventManager.getInstance();

export const useSectorListAnimation = () => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // gsap.set(".sector-item", { width: "53px" });

    const tl = gsap.timeline({
      id: "sector-list-animation",
      paused: true,
      lazy: true,
      immediateRender: false,
      onComplete: () => {
        eventManager.triggerCallbacks("sector-list-animation", "onComplete");
      },
      onUpdate: () => {
        eventManager.triggerCallbacks("sector-list-animation", "onUpdate");
      },
      onReverseComplete: () => {
        eventManager.triggerCallbacks(
          "sector-list-animation",
          "onReverseComplete"
        );
        // gsap.to(".sector-item-trigger", {
        //   width: "53px",
        //   duration: 0.2,
        // });
      },
      scrollTrigger: {
        id: "portfolio-trigger",
        trigger: ".section-portfolio",
        start: "top top+=10px",
        end: `bottom top`,
        toggleActions: "play none none reverse",
        markers: false,
        scrub: false,
        pin: false,
        pinSpacing: false,
        onEnter: () => {
          eventManager.triggerCallbacks(
            "sector-list-animation",
            "onScrollTriggerEnter"
          );
        },
        onLeave: () => {
          gsap.to(".sector-item", {
            opacity: 0,
            stagger: 0.2,
            onComplete: () => {
              eventManager.triggerCallbacks(
                "sector-list-animation",
                "onScrollTriggerLeave"
              );
            },
          });
        },
        onEnterBack: () => {
          gsap.to(".sector-item", {
            opacity: 1,
            stagger: 0.2,
            onComplete: () => {
              eventManager.triggerCallbacks(
                "sector-list-animation",
                "onScrollTriggerEnterBack"
              );
            },
          });
        },
        onLeaveBack: () => {
          eventManager.triggerCallbacks(
            "sector-list-animation",
            "onScrollTriggerLeaveBack"
          );
        },
      },
    });

    tl.to(".sector-item", {
      width: "25%",
      opacity: 1,
      stagger: 0.1,
      duration: 0.2,
      immediateRender: false,
      ease: "power2.inOut",
    });

    tl.to(
      ".sector-item-content-background",

      {
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.5)",
        borderColor: "transparent",
        stagger: 0.1,
        duration: 0.2,
      },
      "<"
    );

    tl.to(
      ".sector-item-trigger",
      {
        borderColor: "transparent",
        stagger: 0.1,
        duration: 0.2,
      },
      "<"
    );

    tl.to(
      ".sector-item-trigger-content",
      {
        opacity: 1,
        stagger: 0.1,
        delay: 0.5,
        duration: 0.2,
      },
      "<"
    );
    timelineRef.current = tl;
  }, []);

  // Add cleanup function
  useGSAP(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      const trigger = ScrollTrigger.getById("portfolio-trigger");
      if (trigger) {
        trigger.kill();
      }
    };
  }, []);

  return { timelineRef };
};

export const getTimeline = (id: string): gsap.core.Timeline | undefined => {
  return gsap.getById(id);
};

// Hook to add event listeners
export const useTimelineEvents = (
  timelineId: string,
  eventType: string,
  callback: () => void
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const wrappedCallback = () => callbackRef.current();
    eventManager.addEventCallback(
      timelineId,
      eventType as any,
      wrappedCallback
    );

    return () => {
      eventManager.removeEventCallback(
        timelineId,
        eventType as any,
        wrappedCallback
      );
    };
  }, [eventType]);
};

export const useSectorListEvents = (
  eventType: string,
  callback: () => void
) => {
  useTimelineEvents("sector-list-animation", eventType, callback);
};
