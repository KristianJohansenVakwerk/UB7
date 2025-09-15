import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionDefaultSettings } from "./objects/sectionDefaultSettings";
import { langBlock, TeamMember } from "./fields/fields";

export const sectionAboutType = defineType({
  name: "sectionAbout",
  title: "Section About",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    ...sectionDefaultSettings,
    langBlock("Text", "text"),
    defineField({
      type: "file",
      name: "mediaPreview",
      title: "Media Preview",
    }),
    defineField({
      type: "file",
      name: "Media",
      title: "Media",
    }),
    defineField({
      type: "file",
      name: "trailerVideo",
      title: "Trailer Video",
      options: {
        accept: "video/mp4",
      },
    }),
    defineField({
      type: "file",
      name: "fullVideo",
      title: "Full Video",
      options: {
        accept: "video/mp4",
      },
    }),
    defineField({
      type: "array",
      name: "teamMembers",
      title: "Team Members",
      of: [TeamMember()],
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
