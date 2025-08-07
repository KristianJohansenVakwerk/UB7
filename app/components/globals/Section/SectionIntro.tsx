"use client";

import { useRef } from "react";

const SectionIntro = ({
  inView,
  cssSnap = false,
}: {
  inView: boolean;
  cssSnap?: boolean;
}) => {
  return (
    <div
      id="intro"
      className="intro w-screen h-screen opacity-100 relative"
    ></div>
  );
};

export default SectionIntro;
