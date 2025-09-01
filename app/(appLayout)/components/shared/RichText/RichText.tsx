import { PortableText } from "@portabletext/react";
import Link from "next/link";

import clsx from "clsx";

type Props = {
  type?: string;
  content: any[];
};
export const RichText = (props: Props) => {
  const { content, type = "default" } = props;

  const customBlockComponents = {
    block: {
      normal: ({ children }: any) => <p>{children}</p>,

      large: ({ children }: any) => <div>{children}</div>,
      h3: ({ children }: any) => <h3>{children}</h3>,
    },
    marks: {
      internalLink: ({ children, value }: any) => {
        const { slug } = value;
        const href = `/${slug?.current}`;

        return <Link href={href}>{children}</Link>;
      },
      externalLink: ({ children, value }: any) => {
        const { href, blank } = value;

        return blank ? (
          <a href={href} target="_blank" rel="noopener">
            {children}
          </a>
        ) : (
          <a href={href}>{children}</a>
        );
      },
      link: ({ children, value }: any) => {
        const { href, blank } = value;

        return blank ? (
          <a href={href} target="_blank" rel="noopener">
            {children}
          </a>
        ) : (
          <a href={href}>{children}</a>
        );
      },
    },
  };

  return <PortableText value={content} components={customBlockComponents} />;
};
