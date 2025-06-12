"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import Box from "../../ui/Box/Box";
import Slider from "../../shared/Slider/Slider";
import SectionPortfolio from "../Section/SectionPortfolio/SectionPortfolio";
import SectionAbout from "../Section/SectionAbout/SectionAbout";
import SectionTitle from "../Section/SectionTitle";
import { globalSectionTriggers } from "@/app/utils/gsapUtils";
import SectionContact from "../Section/SectionContact/SectionContact";
/* Plugins */
gsap.registerPlugin(useGSAP, ScrollTrigger);
const sectionsData = [
  {
    title: "portfolio",
    text: `Redefining capital with flair, <br> precision, and purpose. <br> Operating across four <br> strategic sectors.`,
    id: "portfolio",
    color: "",
  },
  {
    title: "about",
    text: "About us ad minim veniam, quis <br> nostrud exercitation ullamco <br> laboris nisi ut novarbus.",
    id: "about",
    color: "bg-yellow-500",
  },
  {
    title: "contact",
    text: "Contact ullamco laboris nisi ut <br> ad minim veniam, quis nostrud <br> exercitation et al.",
    id: "contact",
    color: "bg-green-500",
  },
];

const SmoothScroll = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  useGSAP(() => {
    const sections = gsap.utils.toArray(".section");

    const tl = gsap.timeline({
      scrollTrigger: {
        start: "top top",
        end: "bottom bottom",
        markers: false,
      },
    });

    sections.forEach((section: any, index: number) => {
      ScrollTrigger.create({
        trigger: section,
        start: globalSectionTriggers[index]?.start,
        end: globalSectionTriggers[index]?.end,
        markers: false,
        id: `section-${index}`,

        onEnter: () => {
          setActiveSection(index);
        },
        onEnterBack: () => {
          setActiveSection(index);
        },
      });
    });
  }, []);

  return (
    <div>
      <div>
        {sectionsData.map((section: any, index: number) => {
          return (
            <div
              id={section.id}
              key={index}
              className={clsx(
                "relative section flex flex-col items-start justify-start w-screen",
                ` section-${index + 1}`,
                `section-${section.id}`,
                section.id === "portfolio" && "h-[120vh]",
                section.id === "about" && "h-[auto] px-0",
                section.id === "contact" && "h-screen"
              )}
            >
              <SectionTitle title={section.text} id={section.id} />

              {section.id === "portfolio" ? (
                <SectionPortfolio
                  data={[
                    {
                      title: "Football",
                      entries: [
                        {
                          title: "Manchester City Football Club",
                          slug: "manchester-city-football-club",
                          sector: "Football",
                          details: [
                            { title: "Foundation Year", value: "1894" },
                            { title: "Joined UB7", value: "2013" },
                            { title: "Location", value: "Manchester" },
                            { title: "CEO", value: "Ferran Soriano" },
                            {
                              title: "Director of Football",
                              value: "Txiki Begiristain",
                            },
                          ],
                          socials: [
                            {
                              platform: "Instagram",
                              url: "https://www.instagram.com/mancity",
                            },
                            {
                              platform: "Twitter",
                              url: "https://www.twitter.com/mancity",
                            },
                            {
                              platform: "Facebook",
                              url: "https://www.facebook.com/mancity",
                            },
                          ],
                          media: [
                            { url: "/test-media/sectors/sector-slide-1.jpg" },
                          ],
                          slides: [
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                          ],
                          text: "<h3>Manchester City are one of the most successful English clubs in the sport's history.</h3><p>The Club's roots can be traced back to 1880 and the parish of East Manchester. First titled St Mark's West Gorton, the Club became known as Manchester City in 1894, and through many ups and downs, it has become one of the most recognisable and successful names in the global game. The first trophy, the FA Cup, was won in 1904, with it the accolade of being the first team in Manchester to win a major title.City's early successes came with the Club winning the FA Cup in 1904, 1934 and 1956 – and when the Club was crowned English champions in 1936/37. The Club's golden era followed when they were once again crowned English champions for the 1967/68 season, won the FA Cup in 1969 and the League Cup in both 1970 and 1976 and the Club's first continental title, the European Cup Winners' Cup, in 1970. City honours this special time in Club history with a permanent statue at the Etihad Stadium depicting Club greats Colin Bell, Francis Lee and Mike Summerbee – as well as the naming of the Colin Bell stand.</p>",
                        },
                        {
                          title: "Peak Performance Technologies",
                          slug: "peak-performance-technologies",
                          sector: "Football",
                          details: [
                            { title: "Foundation Year", value: "2010" },
                            { title: "Joined UB7", value: "2015" },
                            { title: "Location", value: "Global" },
                            { title: "CEO", value: "John Smith" },
                          ],
                          socials: [
                            {
                              platform: "Instagram",
                              url: "https://www.instagram.com/peakperformance",
                            },
                            {
                              platform: "Twitter",
                              url: "https://www.twitter.com/peakperformance",
                            },
                          ],
                          media: [
                            { url: "/test-media/sectors/sector-slide-1.jpg" },
                          ],
                          slides: [
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                          ],
                          text: "<h3>Leading the way in sports performance technology.</h3><p>Peak Performance Technologies is at the forefront of innovation in sports science and performance analysis.</p>",
                        },
                        {
                          title: "Everyday Steps",
                          slug: "everyday-steps",
                          sector: "Football",
                          details: [
                            { title: "Foundation Year", value: "1894" },
                            { title: "Joined UB7", value: "2013" },
                            { title: "Location", value: "Manchester" },
                            { title: "CEO", value: "Ferran Soriano" },
                            {
                              title: "Director of Football",
                              value: "Txiki Begiristain",
                            },
                          ],
                          socials: [
                            {
                              platform: "Instagram",
                              url: "https://www.instagram.com/mancity",
                            },
                            {
                              platform: "Twitter",
                              url: "https://www.twitter.com/mancity",
                            },
                            {
                              platform: "Facebook",
                              url: "https://www.facebook.com/mancity",
                            },
                          ],
                          media: [
                            { url: "/test-media/sectors/sector-slide-1.jpg" },
                          ],
                          slides: [
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                          ],
                          text: "<h3>Manchester City are one of the most successful English clubs in the sport's history.</h3><p>The Club's roots can be traced back to 1880 and the parish of East Manchester. First titled St Mark's West Gorton, the Club became known as Manchester City in 1894, and through many ups and downs, it has become one of the most recognisable and successful names in the global game. The first trophy, the FA Cup, was won in 1904, with it the accolade of being the first team in Manchester to win a major title.City's early successes came with the Club winning the FA Cup in 1904, 1934 and 1956 – and when the Club was crowned English champions in 1936/37. The Club's golden era followed when they were once again crowned English champions for the 1967/68 season, won the FA Cup in 1969 and the League Cup in both 1970 and 1976 and the Club's first continental title, the European Cup Winners' Cup, in 1970. City honours this special time in Club history with a permanent statue at the Etihad Stadium depicting Club greats Colin Bell, Francis Lee and Mike Summerbee – as well as the naming of the Colin Bell stand.</p>",
                        },
                      ],
                      media: "/test-media/sectors/sector_1.jpg",
                    },
                    {
                      title: "Sport",
                      entries: [
                        {
                          title: "NextGen Esports League",
                          slug: "nextgen-esports-league",
                          sector: "Sport",
                          details: [
                            { title: "Foundation Year", value: "2018" },
                            { title: "Joined UB7", value: "2020" },
                            { title: "Location", value: "Global" },
                            { title: "CEO", value: "Jane Doe" },
                          ],
                          socials: [
                            {
                              platform: "Instagram",
                              url: "https://www.instagram.com/nextgenesports",
                            },
                            {
                              platform: "Twitter",
                              url: "https://www.twitter.com/nextgenesports",
                            },
                          ],
                          media: [
                            { url: "/test-media/sectors/sector-slide-1.jpg" },
                          ],
                          slides: [
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                          ],
                          text: "<h3>Revolutionizing competitive gaming.</h3><p>The NextGen Esports League is setting new standards in professional gaming competitions.</p>",
                        },
                        {
                          title: "Peak Performance Technologies",
                          slug: "peak-performance-technologies",
                          sector: "Sport",
                          details: [
                            { title: "Foundation Year", value: "2010" },
                            { title: "Joined UB7", value: "2015" },
                            { title: "Location", value: "Global" },
                            { title: "CEO", value: "John Smith" },
                          ],
                          socials: [
                            {
                              platform: "Instagram",
                              url: "https://www.instagram.com/peakperformance",
                            },
                            {
                              platform: "Twitter",
                              url: "https://www.twitter.com/peakperformance",
                            },
                          ],
                          media: [
                            { url: "/test-media/sectors/sector-slide-1.jpg" },
                          ],
                          slides: [
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                          ],
                          text: "<h3>Leading the way in sports performance technology.</h3><p>Peak Performance Technologies is at the forefront of innovation in sports science and performance analysis.</p>",
                        },
                        {
                          title: "Everyday Steps",
                          slug: "everyday-steps",
                          sector: "Sport",
                          details: [
                            { title: "Foundation Year", value: "1894" },
                            { title: "Joined UB7", value: "2013" },
                            { title: "Location", value: "Manchester" },
                            { title: "CEO", value: "Ferran Soriano" },
                            {
                              title: "Director of Football",
                              value: "Txiki Begiristain",
                            },
                          ],
                          socials: [
                            {
                              platform: "Instagram",
                              url: "https://www.instagram.com/mancity",
                            },
                            {
                              platform: "Twitter",
                              url: "https://www.twitter.com/mancity",
                            },
                            {
                              platform: "Facebook",
                              url: "https://www.facebook.com/mancity",
                            },
                          ],
                          media: [
                            { url: "/test-media/sectors/sector-slide-1.jpg" },
                          ],
                          slides: [
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                          ],
                          text: "<h3>Manchester City are one of the most successful English clubs in the sport's history.</h3><p>The Club's roots can be traced back to 1880 and the parish of East Manchester. First titled St Mark's West Gorton, the Club became known as Manchester City in 1894, and through many ups and downs, it has become one of the most recognisable and successful names in the global game. The first trophy, the FA Cup, was won in 1904, with it the accolade of being the first team in Manchester to win a major title.City's early successes came with the Club winning the FA Cup in 1904, 1934 and 1956 – and when the Club was crowned English champions in 1936/37. The Club's golden era followed when they were once again crowned English champions for the 1967/68 season, won the FA Cup in 1969 and the League Cup in both 1970 and 1976 and the Club's first continental title, the European Cup Winners' Cup, in 1970. City honours this special time in Club history with a permanent statue at the Etihad Stadium depicting Club greats Colin Bell, Francis Lee and Mike Summerbee – as well as the naming of the Colin Bell stand.</p>",
                        },
                      ],
                      media: "/test-media/sectors/sector_2.jpg",
                    },
                    {
                      title: "Entertainment",
                      entries: [
                        {
                          title: "NextGen Esports League",
                          slug: "nextgen-esports-league",
                          sector: "Entertainment",
                          details: [
                            { title: "Foundation Year", value: "2018" },
                            { title: "Joined UB7", value: "2020" },
                            { title: "Location", value: "Global" },
                            { title: "CEO", value: "Jane Doe" },
                          ],
                          socials: [
                            {
                              platform: "Instagram",
                              url: "https://www.instagram.com/nextgenesports",
                            },
                            {
                              platform: "Twitter",
                              url: "https://www.twitter.com/nextgenesports",
                            },
                          ],
                          media: [
                            { url: "/test-media/sectors/sector-slide-1.jpg" },
                          ],
                          slides: [
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                          ],
                          text: "<h3>Revolutionizing competitive gaming.</h3><p>The NextGen Esports League is setting new standards in professional gaming competitions.</p>",
                        },
                        {
                          title: "Peak Performance Technologies",
                          slug: "peak-performance-technologies",
                          sector: "Entertainment",
                          details: [
                            { title: "Foundation Year", value: "2010" },
                            { title: "Joined UB7", value: "2015" },
                            { title: "Location", value: "Global" },
                            { title: "CEO", value: "John Smith" },
                          ],
                          socials: [
                            {
                              platform: "Instagram",
                              url: "https://www.instagram.com/peakperformance",
                            },
                            {
                              platform: "Twitter",
                              url: "https://www.twitter.com/peakperformance",
                            },
                          ],
                          media: [
                            { url: "/test-media/sectors/sector-slide-1.jpg" },
                          ],
                          slides: [
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                          ],
                          text: "<h3>Leading the way in sports performance technology.</h3><p>Peak Performance Technologies is at the forefront of innovation in sports science and performance analysis.</p>",
                        },
                        {
                          title: "Everyday Steps",
                          slug: "everyday-steps",
                          sector: "Entertainment",
                          details: [
                            { title: "Foundation Year", value: "1894" },
                            { title: "Joined UB7", value: "2013" },
                            { title: "Location", value: "Manchester" },
                            { title: "CEO", value: "Ferran Soriano" },
                            {
                              title: "Director of Football",
                              value: "Txiki Begiristain",
                            },
                          ],
                          socials: [
                            {
                              platform: "Instagram",
                              url: "https://www.instagram.com/mancity",
                            },
                            {
                              platform: "Twitter",
                              url: "https://www.twitter.com/mancity",
                            },
                            {
                              platform: "Facebook",
                              url: "https://www.facebook.com/mancity",
                            },
                          ],
                          media: [
                            { url: "/test-media/sectors/sector-slide-1.jpg" },
                          ],
                          slides: [
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                          ],
                          text: "<h3>Manchester City are one of the most successful English clubs in the sport's history.</h3><p>The Club's roots can be traced back to 1880 and the parish of East Manchester. First titled St Mark's West Gorton, the Club became known as Manchester City in 1894, and through many ups and downs, it has become one of the most recognisable and successful names in the global game. The first trophy, the FA Cup, was won in 1904, with it the accolade of being the first team in Manchester to win a major title.City's early successes came with the Club winning the FA Cup in 1904, 1934 and 1956 – and when the Club was crowned English champions in 1936/37. The Club's golden era followed when they were once again crowned English champions for the 1967/68 season, won the FA Cup in 1969 and the League Cup in both 1970 and 1976 and the Club's first continental title, the European Cup Winners' Cup, in 1970. City honours this special time in Club history with a permanent statue at the Etihad Stadium depicting Club greats Colin Bell, Francis Lee and Mike Summerbee – as well as the naming of the Colin Bell stand.</p>",
                        },
                      ],
                      media: "/test-media/sectors/sector_3.jpg",
                    },
                    {
                      title: "Philanthropy",
                      entries: [
                        {
                          title: "NextGen Esports League",
                          slug: "nextgen-esports-league",
                          sector: "Philanthropy",
                          details: [
                            { title: "Foundation Year", value: "2018" },
                            { title: "Joined UB7", value: "2020" },
                            { title: "Location", value: "Global" },
                            { title: "CEO", value: "Jane Doe" },
                          ],
                          socials: [
                            {
                              platform: "Instagram",
                              url: "https://www.instagram.com/nextgenesports",
                            },
                            {
                              platform: "Twitter",
                              url: "https://www.twitter.com/nextgenesports",
                            },
                          ],
                          media: [
                            { url: "/test-media/sectors/sector-slide-1.jpg" },
                          ],
                          slides: [
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                          ],
                          text: "<h3>Revolutionizing competitive gaming.</h3><p>The NextGen Esports League is setting new standards in professional gaming competitions.</p>",
                        },
                        {
                          title: "Peak Performance Technologies",
                          slug: "peak-performance-technologies",
                          sector: "Philanthropy",
                          details: [
                            { title: "Foundation Year", value: "2010" },
                            { title: "Joined UB7", value: "2015" },
                            { title: "Location", value: "Global" },
                            { title: "CEO", value: "John Smith" },
                          ],
                          socials: [
                            {
                              platform: "Instagram",
                              url: "https://www.instagram.com/peakperformance",
                            },
                            {
                              platform: "Twitter",
                              url: "https://www.twitter.com/peakperformance",
                            },
                          ],
                          media: [
                            { url: "/test-media/sectors/sector-slide-1.jpg" },
                          ],
                          slides: [
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                          ],
                          text: "<h3>Leading the way in sports performance technology.</h3><p>Peak Performance Technologies is at the forefront of innovation in sports science and performance analysis.</p>",
                        },
                        {
                          title: "Everyday Steps",
                          slug: "everyday-steps",
                          sector: "Philanthropy",
                          details: [
                            { title: "Foundation Year", value: "1894" },
                            { title: "Joined UB7", value: "2013" },
                            { title: "Location", value: "Manchester" },
                            { title: "CEO", value: "Ferran Soriano" },
                            {
                              title: "Director of Football",
                              value: "Txiki Begiristain",
                            },
                          ],
                          socials: [
                            {
                              platform: "Instagram",
                              url: "https://www.instagram.com/mancity",
                            },
                            {
                              platform: "Twitter",
                              url: "https://www.twitter.com/mancity",
                            },
                            {
                              platform: "Facebook",
                              url: "https://www.facebook.com/mancity",
                            },
                          ],
                          media: [
                            { url: "/test-media/sectors/sector-slide-1.jpg" },
                          ],
                          slides: [
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                            {
                              url: "/test-media/sectors/sector-slide-1.jpg",
                            },
                          ],
                          text: "<h3>Manchester City are one of the most successful English clubs in the sport's history.</h3><p>The Club's roots can be traced back to 1880 and the parish of East Manchester. First titled St Mark's West Gorton, the Club became known as Manchester City in 1894, and through many ups and downs, it has become one of the most recognisable and successful names in the global game. The first trophy, the FA Cup, was won in 1904, with it the accolade of being the first team in Manchester to win a major title.City's early successes came with the Club winning the FA Cup in 1904, 1934 and 1956 – and when the Club was crowned English champions in 1936/37. The Club's golden era followed when they were once again crowned English champions for the 1967/68 season, won the FA Cup in 1969 and the League Cup in both 1970 and 1976 and the Club's first continental title, the European Cup Winners' Cup, in 1970. City honours this special time in Club history with a permanent statue at the Etihad Stadium depicting Club greats Colin Bell, Francis Lee and Mike Summerbee – as well as the naming of the Colin Bell stand.</p>",
                        },
                      ],
                      media: "/test-media/sectors/sector_4.jpg",
                    },
                  ]}
                />
              ) : section.id === "about" ? (
                <SectionAbout />
              ) : section.id === "contact" ? (
                <SectionContact />
              ) : (
                <div>missing id</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmoothScroll;
