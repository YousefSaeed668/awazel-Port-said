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
import {
  createArticleDuplicateAction,
  createArticlePublishAction,
} from "./src/sanity/document-actions/article";

const singletonTypes = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "certificatesPage",
  "servicesPage",
  "blogSettings",
  "privacyPage",
]);
const singletonActionsToRemove = new Set(["delete", "unpublish", "duplicate"]);

const singletons = [
  defineSingleton({
    id: "privacyPage",
    documentId: "privacyPage",
    schemaType: "privacyPage",
    title: "سياسة الخصوصية",
  }),
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
  defineSingleton({
    id: "aboutPage",
    documentId: "aboutPage",
    schemaType: "aboutPage",
    title: "من نحن",
  }),
  defineSingleton({
    id: "certificatesPage",
    documentId: "certificatesPage",
    schemaType: "certificatesPage",
    title: "الاعتمادات والشهادات",
  }),
  defineSingleton({
    id: "blogSettings",
    documentId: "blogSettings",
    schemaType: "blogSettings",
    title: "إعدادات المدونة",
  }),
  defineSingleton({
    id: "servicesPage",
    documentId: "servicesPage",
    schemaType: "servicesPage",
    title: "جميع الخدمات",
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
    actions: (actions, { schemaType }) => {
      if (singletonTypes.has(schemaType)) {
        return actions.filter(
          (action) =>
            !action.action || !singletonActionsToRemove.has(action.action),
        );
      }

      if (schemaType === "article") {
        return actions.map((action) => {
          if (action.action === "publish") {
            return createArticlePublishAction(action);
          }
          if (action.action === "duplicate") {
            return createArticleDuplicateAction(action);
          }
          return action;
        });
      }

      return actions;
    },
  },
});
