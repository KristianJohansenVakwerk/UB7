import { EarthGlobeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const string = (title: string, name: string) =>
  defineField({
    name: name || "string",
    title: title || "String",
    type: "string",
  });

export const langString = (title: string, name: string) =>
  defineField({
    name: name || "multilangString",
    title: title || "Multilang String",
    type: "object",
    fields: [
      defineField({
        name: "en",
        type: "string",
      }),
      defineField({
        name: "pt",
        type: "string",
      }),
    ],
  });

export const langBlock = (title: string, name: string) =>
  defineField({
    name: name || "multilangBlock",
    title: title || "Multilang Block",
    type: "object",
    fields: [
      defineField({
        type: "array",
        name: "en",
        title: "Content English",
        of: [...richtextOptions],
      }),
      defineField({
        type: "array",
        name: "pt",
        title: "Content Portuguese",
        of: [...richtextOptions],
      }),
    ],
  });

export const link = (title: string, name: string) =>
  defineField({
    name: name || "link",
    type: "url",
    title: title || "Link",
    validation: (Rule) =>
      Rule.uri({
        scheme: ["http", "https", "mailto", "tel"],
      }),
  });

export const TeamMember = () =>
  defineField({
    name: "teamMember",
    title: "Team Member",
    type: "object",
    fields: [
      defineField({ name: "name", type: "string" }),
      image("Portrait", "portrait"),
      langBlock("Description", "description"),
      defineField({
        type: "array",
        name: "links",
        of: [
          defineArrayMember({
            type: "object",
            name: "link",
            title: "Link",
            fields: [string("Title", "title"), link("Link", "link")],
          }),
        ],
      }),
    ],
  });

export const image = (title: string, name: string) =>
  defineField({
    name: "image",
    title: "Image",
    type: "image",
    options: {
      hotspot: true,
    },
  });

export const richtextOptions = [
  {
    title: "Block",
    type: "block",
    // Styles let you set what your user can mark up blocks with. These
    // correspond with HTML tags, but you can set any title or value
    // you want and decide how you want to deal with it where you want to
    // use your content.
    styles: [
      { title: "Normal", value: "normal" },
      { title: "H3", value: "h3" },
    ],

    lists: [],
    // Marks let you mark up inline text in the block editor.
    marks: {
      // Decorators usually describe a single property – e.g. a typographic
      // preference or highlighting by editors.
      decorators: [],
      // Annotations can be any object structure – e.g. a link or a footnote.
      annotations: [
        {
          name: "externalLink",
          type: "object",
          title: "External Link",
          icon: EarthGlobeIcon,
          fields: [
            {
              name: "href",
              type: "url",
              title: "URL",
              validation: (Rule: any) =>
                Rule.uri({
                  scheme: ["http", "https", "mailto", "tel"],
                }),
            },
            {
              title: "Open in a new tab",
              name: "blank",
              type: "boolean",
            },
          ],
        },
      ],
    },
  },
  // You can add additional types here. Note that you can't use
  // primitive types such as 'string' and 'number' in the same array
  // as a block type.
  // {
  //   type: "image",
  //   options: { hotspot: true },
  // },
];

// Rich Text Field
export const richTextField = defineField({
  name: "content",
  type: "array",
  title: "Content",
  of: [...richtextOptions],
});
