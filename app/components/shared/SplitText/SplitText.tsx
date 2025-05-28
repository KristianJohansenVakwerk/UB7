"use client";

import { useRef } from "react";

import Box from "../../ui/Box/Box";

type Props = {
  text: string;
  className?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
};

const SplitText = ({ text, className, ref }: Props) => {
  return (
    <Box ref={ref} className={`${className} text-lg lg:text-lg/1.02`}>
      {text.split("\n").map((line, index) => (
        <div key={index} className={`line line-${index} `}>
          {line}
        </div>
      ))}
    </Box>
  );
};

export default SplitText;
