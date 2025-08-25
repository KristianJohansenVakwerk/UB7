import { defineField, defineType } from "sanity";
import { langBlock, langString } from "../fields/fields";

export const sectionDefaultSettings = [
  langString("Title", "title"),
  defineField({
    name: "slug",
    type: "slug",
    options: {
      source: "title.en",
    },
  }),
  langBlock("Headline", "headline"),
];
