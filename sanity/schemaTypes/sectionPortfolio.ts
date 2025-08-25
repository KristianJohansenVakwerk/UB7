import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionDefaultSettings } from "./objects/sectionDefaultSettings";

export const sectionPortfolioType = defineType({
  name: "sectionPortfolio",
  title: "Section Portfolio",
  type: "document",
  icon: DocumentTextIcon,
  fields: [...sectionDefaultSettings],
  preview: {
    select: {
      title: "title.en",
    },
    prepare(selection) {
      return { ...selection };
    },
  },
});
