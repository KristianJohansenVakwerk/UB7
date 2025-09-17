"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";

function getDeviceType(width: number) {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export const useDevice = (initial = "desktop") => {
  const [device, setDevice] = useState(initial);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;
    setDevice(getDeviceType(width));
  }, []); // ✅ runs only once on mount

  return device;
};
export const checkLangString = (lang: string, text: any) => {
  return text[lang] || text.en;
};

export const richTextToHTML = (blocks: any[]): string => {
  if (!blocks || !Array.isArray(blocks)) {
    return "";
  }

  const html = blocks
    .map((block) => {
      // Handle different block types
      switch (block._type) {
        case "block":
          return processBlock(block);
        default:
          return "";
      }
    })
    .join("\n ");

  return html;
};

const processBlock = (block: any): string => {
  if (!block.children || !Array.isArray(block.children)) {
    return "";
  }

  const content = block.children
    .map((child: any) => {
      let text = child.text || "";

      // Handle marks (bold, italic, etc.)
      if (child.marks && Array.isArray(child.marks)) {
        child.marks.forEach((mark: string) => {
          switch (mark) {
            case "strong":
              text = `<strong>${text}</strong>`;
              break;
            case "em":
              text = `<em>${text}</em>`;
              break;
            case "underline":
              text = `<u>${text}</u>`;
              break;
            case "code":
              text = `<code>${text}</code>`;
              break;
            default:
              // Handle custom marks if needed
              break;
          }
        });
      }

      return text;
    })
    .join(" \n ");

  // Handle different block styles
  switch (block.style) {
    case "h1":
      return `<h1>${content}</h1>`;
    case "h2":
      return `<h2>${content}</h2>`;
    case "h3":
      return `<h3>${content}</h3>`;
    case "h4":
      return `<h4>${content}</h4>`;
    case "h5":
      return `<h5>${content}</h5>`;
    case "h6":
      return `<h6>${content}</h6>`;
    case "blockquote":
      return `<blockquote>${content}</blockquote>`;
    case "normal":
    default:
      return `<p>${content}</p>`;
  }
};

export const classFormatter = (classes: string[]) => {
  return classes.join(" ");
};

export const classFormatterClsx = (classes: string[], conditions?: any[]) => {
  return clsx(classes.join(" "), conditions ? conditions : {});
};

export const uiSelectorsFunc = (exclude?: string[]) => {
  return [
    "#progress",
    "#section-title-about",
    ".text-about",
    ".item-team-member",
    ".section-title",
    "#menu",
    "#language",
  ].filter((selector) => !exclude?.includes(selector));
};

export const uiSelectors = [
  "#progress",
  "#section-title-about",
  ".text-about",
  ".item-team-member",
  ".section-title",
  "#menu",
  "#language",
];
