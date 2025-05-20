"use client";
import Box from "../ui/Box/Box";
import { forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Section = forwardRef<HTMLElement, Props>((props, ref) => {
  const { children, className } = props;

  return (
    <Box
      ref={ref}
      className="section h-screen bg-orange-500 flex items-center justify-center border-2 border-black"
    >
      {children}
    </Box>
  );
});

Section.displayName = "Section";

export default Section;
