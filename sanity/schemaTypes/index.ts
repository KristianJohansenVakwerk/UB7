import { type SchemaTypeDefinition } from "sanity";
import { settingsType } from "./settingsType";
import { sectionType } from "./sectionType";
import { sectionPortfolioType } from "./sectionPortfolio";
import { sectionAboutType } from "./sectionAbout";
import { sectionContactType } from "./sectionContact";
import { portfolioType } from "./portfolio";
import { portfolioCategoryType } from "./portfolioCategories";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    settingsType,
    sectionType,
    sectionPortfolioType,
    sectionAboutType,
    sectionContactType,
    portfolioType,
    portfolioCategoryType,
  ],
};
