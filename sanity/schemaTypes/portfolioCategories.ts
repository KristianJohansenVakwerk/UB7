import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

import { langString } from "./fields/fields";

export const portfolioCategoryType = defineType({
  name: "portfolioCategory",
  title: "Portfolio Category",
  type: "document",
  icon: DocumentTextIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "portfolioCategory", newItemPosition: "before" }),
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
      type: "image",
      name: "media",
      title: "Media",
      options: {
        hotspot: true,
      },
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
