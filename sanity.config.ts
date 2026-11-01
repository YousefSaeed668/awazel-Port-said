import { defineConfig, defineSingleton } from "sanity";
import { structureTool } from "sanity/structure";

import {
  apiVersion,
  dataset,
  projectId,
  studioBasePath,
} from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const singletonTypes = new Set(["siteSettings", "homePage"]);
const singletonActionsToRemove = new Set(["delete", "unpublish", "duplicate"]);

const singletons = [
  defineSingleton({
    id: "homePage",
    documentId: "homePage",
    schemaType: "homePage",
    title: "الصفحة الرئيسية",
  }),
  defineSingleton({
    id: "siteSettings",
    documentId: "siteSettings",
    schemaType: "siteSettings",
    title: "إعدادات الموقع",
  }),
];

export default defineConfig({
  name: "default",
  title: "عوازل بورسعيد — إدارة المحتوى",
  basePath: studioBasePath,
  projectId,
  dataset,
  apiVersion,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !singletonTypes.has(template.schemaType)),
  },
  plugins: [structureTool({ structure })],
  document: {
    singletons,
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(
            (action) =>
              !action.action ||
              !singletonActionsToRemove.has(action.action),
          )
        : actions,
  },
});
