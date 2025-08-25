import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { langBlock, langString, link } from "./fields/fields";

export const portfolioType = defineType({
  name: "portfolio",
  title: "Portfolio",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    langString("Title", "title"),
    defineField({
      type: "slug",
      name: "slug",
      title: "slug",
      options: {
        source: "title.en",
      },
    }),
    defineField({
      type: "reference",
      name: "category",
      title: "Sector",
      to: [{ type: "portfolioCategory" }],
    }),
    defineField({
      type: "array",
      name: "details",
      title: "Details",
      of: [
        defineArrayMember({
          type: "object",
          fields: [langString("Title", "title"), langString("Value", "value")],
          preview: {
            select: {
              title: "title.en",
              value: "value.en",
            },
            prepare(selection: { title: string; value: string } | null) {
              if (!selection) return { title: "Please fill in the fields" };
              return {
                title: selection.title,
                subtitle: selection.value,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      type: "array",
      name: "social",
      title: "Social",
      of: [
        defineArrayMember({
          type: "object",
          fields: [langString("Platform", "platform"), link("URL", "url")],
          preview: {
            select: {
              title: "platform.en",
              link: "url",
            },
            prepare(selection: { title: string; link: string } | null) {
              if (!selection) return { title: "Please fill in the fields" };
              return {
                title: selection.title,
                subtitle: selection.link,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      type: "array",
      name: "slides",
      title: "Slideshow",
      of: [
        defineArrayMember({
          type: "image",
          name: "image",
          title: "Image",
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    langBlock("Text", "text"),
  ],
  preview: {
    select: {
      title: "title.en",
    },
    prepare(selection) {
      return { ...selection };
    },
  },
});
