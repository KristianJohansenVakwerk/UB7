import { CogIcon, DocumentTextIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
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
      S.listItem()
        .title("Portfolio Sectors")
        .icon(DocumentTextIcon)
        .child(
          S.documentList()
            .title("Portfolio sectors")
            .filter("_type == 'portfolioCategory'")
        ),
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
          ].includes(item.getId()!)
      ),
    ]);
