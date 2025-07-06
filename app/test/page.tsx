"use client";

import { useInView } from "react-intersection-observer";
import ScrollTrigger from "gsap/ScrollTrigger";
import IntroPixi from "../components/globals/IntroPixi/IntroPixi";
import SectionIntro from "../components/globals/Section/SectionIntro";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const sections = [
  {
    id: "intro",
    title: "Intro",
  },
  {
    id: "portfolio",
    title: "Portfolio",
  },
  {
    id: "about",
    title: "About",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleActiveSection = (section: string) => {
    setActiveSection(section);
  };

  useGSAP(() => {
    console.log("activeSection", activeSection);
  }, [activeSection]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full z-10">
        <SectionIntro
          inView={activeSection === "intro" ? true : false}
          cssSnap={true}
        />
      </div>
      <div className="relative h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth z-10">
        {sections.map((section, index) => {
          return (
            <Section
              key={section.id}
              id={section.id}
              title={section.title}
              handleActiveSection={handleActiveSection}
            />
          );
        })}
      </div>

      <IntroPixi />
    </>
  );
}

const Section = ({
  id,
  title,
  handleActiveSection,
}: {
  id: string;
  title: string;
  handleActiveSection: (section: string) => void;
}) => {
  const animationRef = useRef<any>(null);
  const sectionRef = useRef<any>(null);
  const options = {
    threshold: 0.5,
    rootMargin: id === "intro" ? "0px 0px -50% 0px" : "0px", // Trigger earlier for intro
    initialInView: id === "intro",
  };
  const { ref, inView, entry } = useInView(options);

  useGSAP(() => {
    if (sectionRef.current) {
      const target = sectionRef.current.querySelector(".test");

      animationRef.current = gsap
        .timeline({
          id: id,
          paused: true,
          defaults: { duration: 0.5, delay: 0.5, ease: "power2.inOut" },
        })
        .addLabel("start")
        .to(target, {
          rotation: 360,
          autoAlpha: 1,
        });
    }
  }, []);

  useGSAP(() => {
    if (!animationRef.current) return;
    const ani = animationRef?.current;

    if (inView) {
      ani.restart();
      handleActiveSection(id);
    } else {
      ani.pause();
      ani.seek("start");
    }
  }, [inView]);

  return (
    <section
      ref={(el) => {
        ref(el);
        sectionRef.current = el;
      }}
      className="snap-start h-screen flex items-center justify-center transition-all duration-3000"
      id={id}
      style={{
        pointerEvents: id === "intro" ? "none" : "auto",
      }}
    >
      {id === "intro" ? (
        <></>
      ) : (
        <h1 className="test text-4xl font-bold rotate-0 opacity-0">{`Section ${title} ${inView}`}</h1>
      )}
    </section>
  );
};
