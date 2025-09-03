"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { checkLangString, richTextToHTML } from "@/app/(appLayout)/utils/utils";
import AboutSectionText from "./SectionAboutText";

const SectionAboutNew = (props: any) => {
  const { data, currentIndex, scrollingDown, lang } = props;

  return (
    <div className="flex flex-col gap-4 justify-end items-start h-full w-full bg-red-500 pb-[124px] lg:pb-[115px]">
      <div className="flex w-full overflow-x-auto">
        <div className="w-1/2 flex-shrink-0 h-[30vh] bg-blue-500">
          <AboutSectionText
            lang={lang}
            currentIndex={currentIndex}
            scrollingDown={scrollingDown}
            data={data}
          />
        </div>
        <div className="flex-shrink-0 h-[30vh] bg-green-500 min-w-[3500px]"></div>
      </div>
    </div>
  );
};

export default SectionAboutNew;
