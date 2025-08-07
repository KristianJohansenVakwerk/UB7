"use client";
import Box from "@/app/components/ui/Box/Box";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import SectionTitle from "../SectionTitle";
import Link from "next/link";

// Register the plugins
gsap.registerPlugin(SplitText, ScrollTrigger);

type Props = { title: string };

const info = [
  {
    title: "Social",
    items: [
      {
        label: "Linkedin",
        url: "https://www.linkedin.com/in/thiagosilva",
      },
      {
        label: "Instagram",
        url: "https://www.instagram.com/thiagosilva",
      },
    ],
  },
  {
    title: "E-mail",
    items: [
      {
        label: "info@ub7.com",
        url: "mailto:info@ub7.com",
      },
    ],
  },
  {
    title: "Address",
    items: [
      {
        label: (
          <p>
            Carrer de la Llum, 24, 3º 2ª <br /> 08002 Madrid <br /> España
          </p>
        ),
      },
    ],
  },
];

const SectionContact = (props: Props) => {
  const { title } = props;
  const container = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showTitle, setShowTitle] = useState<boolean>(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        id: "contact-trigger",
        paused: true,
        immediateRender: false,
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom bottom",
          markers: false,
          toggleActions: "play none none reverse",
          onEnter: () => {
            setShowTitle(true);
          },
          onEnterBack: () => {
            // setShowTitle(true);
          },
          onLeave: () => {
            // setShowTitle(false);
          },
          onLeaveBack: () => {
            // setShowTitle(false);
          },
        },
      });

      // Animate each info item
      info.forEach((item, index) => {
        const titleRef = titleRefs.current[index];
        if (titleRef) {
          const splitTitle = new SplitText(titleRef, {
            type: "lines",
            linesClass: "split-line",
          });

          tl.from(splitTitle.lines, {
            opacity: 0,
            y: 5,
            duration: 0.2,
            stagger: 0.1,
            ease: "power4.out",
          });
        }

        // Animate each label in the item
        item.items.forEach((_, linkIndex) => {
          const refIndex =
            info
              .slice(0, index)
              .reduce((acc, section) => acc + section.items.length, 0) +
            linkIndex;
          const labelRef = labelRefs.current[refIndex];
          if (labelRef) {
            const splitLabel = new SplitText(labelRef, {
              type: "lines",
              linesClass: "split-line",
            });

            tl.from(
              splitLabel.lines,
              {
                opacity: 0,
                y: 5,
                duration: 0.2,
                stagger: 0.1,
                ease: "power4.out",
              },
              "-=0.2"
            ); // Slight overlap with previous animation
          }
        });
      });
    },
    { scope: container }
  );

  return (
    <Box
      ref={container}
      className=" w-full h-full flex flex-col gap-0 items-start justify-start px-3"
    >
      <div className={"text-title font-sans pt-7  mb-[100px] lg:mb-[250px]"}>
        <SectionTitle title={title} id={"contact"} play={showTitle} />
      </div>
      <Box className="grid grid-cols-16 w-full gap-3 lg:gap-0">
        {info.map((item, index) => {
          return (
            <Box
              key={index}
              className="col-span-16 lg:col-span-3 xl:col-span-2 info-item flex flex-col opacity-100 gap-0"
            >
              <Box
                ref={(el) => {
                  titleRefs.current[index] = el as HTMLDivElement;
                }}
                className="font-mono text-sm text-light-grey"
              >
                {item.title}
              </Box>

              <Box className="flex flex-col gap-0">
                {item.items.map((link: any, linkIndex: number) => {
                  const refIndex =
                    info
                      .slice(0, index)
                      .reduce((acc, section) => acc + section.items.length, 0) +
                    linkIndex;
                  return (
                    <Box
                      key={linkIndex}
                      ref={(el) => {
                        labelRefs.current[refIndex] = el as HTMLDivElement;
                      }}
                      className="cursor-pointer font-sans text-base text-light-grey"
                    >
                      <Link href={link?.url || "#"} target="_blank">
                        {link.label}
                      </Link>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SectionContact;
