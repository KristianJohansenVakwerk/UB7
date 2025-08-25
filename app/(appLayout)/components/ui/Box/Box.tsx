import clsx from "clsx";
import { AllHTMLAttributes, createElement, forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  debug?: boolean;
  as?: string;
} & Omit<AllHTMLAttributes<HTMLDivElement>, "className" | "width" | "height">;

const Box = forwardRef<HTMLElement, Props>((props, ref) => {
  const {
    children,
    className,
    debug = false,
    as = "div",
    ...restProps
  } = props;

  return createElement(
    as,
    {
      ref,
      className: clsx(
        className !== "" ? className : "flex",
        debug && "border border-red-500"
      ),
      ...restProps,
    },
    children
  );
});

Box.displayName = "Box";

export default Box;
