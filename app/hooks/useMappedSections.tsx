"use client";

import { useMemo } from "react";

export const useMappedSections = (data: any) => {
  const mappedSections = useMemo(() => {
    const groups = [] as any;
    let currentGroup = [] as any;

    data.forEach((section: any, index: number) => {
      if (section.id === "intro" || section.id === "portfolio") {
        currentGroup.push(section);
      } else {
        if (currentGroup.length) {
          groups.push({ type: "snap", sections: [...currentGroup] });
          currentGroup = [];
        }

        if (section.id === "about") {
          groups.push({ type: "free", sections: [section] });
        }

        if (section.id === "contact") {
          groups.push({ type: "snap", sections: [section] });
        }
      }
    });

    return groups;
  }, [data]);

  return mappedSections;
};
