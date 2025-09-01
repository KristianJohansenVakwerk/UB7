import { CogIcon, DocumentTextIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { SSG_FALLBACK_EXPORT_ERROR } from "next/dist/lib/constants";
// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("UB7")
    .items([
      S.listItem()
        .title("Settings")
        .icon(CogIcon)
        .child(S.editor().id("settings").schemaType("settings")),

      S.listItem()
        .title("Sections")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Sections")
            .items([
              S.listItem()
                .title("Portfolio")
                .icon(DocumentTextIcon)
                .child(
                  S.editor()
                    .id("sectionPortfolio")
                    .schemaType("sectionPortfolio")
                ),
              S.listItem()
                .title("About")
                .icon(DocumentTextIcon)
                .child(
                  S.editor().id("sectionAbout").schemaType("sectionAbout")
                ),
              S.listItem()
                .title("Contact")
                .icon(DocumentTextIcon)
                .child(
                  S.editor().id("sectionContact").schemaType("sectionContact")
                ),
            ])
        ),
      S.divider(),
      S.listItem()
        .title("Portfolio")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Portfolio")
            .items([
              // Dynamic portfolio categories
              S.listItem()
                .title("All portfolio items")
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList("portfolio")
                    .title("All portfolio items")
                    .child((documentId) =>
                      S.document()
                        .documentId(documentId)
                        .schemaType("portfolio")
                    )
                ),
              S.listItem()
                .title("Portfolio by sector")
                .child(
                  S.documentTypeList("portfolioCategory")
                    .title("Select sector")
                    .child((categoryId) =>
                      S.documentTypeList("portfolio")
                        .title(`By sector`)
                        .filter("category._ref == $categoryId")
                        .params({ categoryId })
                        .child((documentId) =>
                          S.document()
                            .documentId(documentId)
                            .schemaType("portfolio")
                        )
                    )
                ),
            ])
        ),
      orderableDocumentListDeskItem({
        type: "portfolioCategory",
        title: "Portfolio Sectors",
        S,
        context,
      }),

      S.divider(),

      orderableDocumentListDeskItem({
        type: "teamMember",
        title: "Team Members",
        S,
        context,
      }),

      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            "settings",
            "sectionPortfolio",
            "sectionAbout",
            "sectionContact",
            "portfolio",
            "portfolioCategory",
            "section",
            "teamMember",
          ].includes(item.getId()!)
      ),
    ]);
