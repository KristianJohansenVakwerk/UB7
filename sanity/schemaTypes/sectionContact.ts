import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionDefaultSettings } from "./objects/sectionDefaultSettings";
import { link } from "./fields/fields";

export const sectionContactType = defineType({
  name: "sectionContact",
  title: "Section Contact",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    ...sectionDefaultSettings,
    defineField({
      name: "social",
      title: "Social",
      type: "array",
      of: [
        defineArrayMember({
          name: "link",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            link("Link", "link"),
          ],
        }),
      ],
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string" }),
        link("Link", "link"),
      ],
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        defineField({ name: "title", type: "text" }),
        link("Link", "link"),
      ],
    }),
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
