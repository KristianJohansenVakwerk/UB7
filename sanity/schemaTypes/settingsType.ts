import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const settingsType = defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      options: {
        collapsed: true,
        collapsible: true,
      },
      fields: [
        defineField({
          name: "seoTitle",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "seoDescription",
          title: "Description",
          type: "string",
        }),
        defineField({
          name: "seoKeywords",
          title: "Keywords",
          type: "string",
        }),
        defineField({
          name: "seoImage",
          title: "Image",
          type: "image",
        }),
        defineField({
          name: "seoUrl",
          title: "URL",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "title",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      return { ...selection };
    },
  },
});
