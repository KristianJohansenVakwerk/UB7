import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { langBlock, image, string, link, langString } from "./fields/fields";

export const teamMemberType = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  icon: DocumentTextIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "teamMember", newItemPosition: "before" }),
    defineField({ name: "name", type: "string" }),
    defineField({
      type: "slug",
      name: "slug",
      title: "slug",
      options: {
        source: "name",
      },
    }),
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
          fields: [langString("Title", "title"), link("Link", "link")],
          preview: {
            select: {
              title: "title.en",
              link: "link",
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
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare(selection) {
      return { ...selection };
    },
  },
});
