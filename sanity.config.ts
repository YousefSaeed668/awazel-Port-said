import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import {
  apiVersion,
  dataset,
  projectId,
  studioBasePath,
} from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const singletonType = "siteSettings";
const singletonActionsToRemove = new Set(["delete", "unpublish", "duplicate"]);

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
      templates.filter((template) => template.schemaType !== singletonType),
  },
  plugins: [structureTool({ structure })],
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === singletonType
        ? actions.filter(
            (action) =>
              !action.action ||
              !singletonActionsToRemove.has(action.action),
          )
        : actions,
  },
});
