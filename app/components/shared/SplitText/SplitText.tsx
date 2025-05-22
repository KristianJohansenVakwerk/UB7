"use client";

import { useRef } from "react";

import Box from "../../ui/Box/Box";

type Props = {
  text: string;
  className?: string;
};

const SplitText = ({ text, className }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Box ref={containerRef} className={className}>
      {text.split("\n").map((line, index) => (
        <div key={index} className={`line line-${index} text-lg md:text-6xl`}>
          {line}
        </div>
      ))}
    </Box>
  );
};

export default SplitText;
