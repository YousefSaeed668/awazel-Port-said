import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are required. Add them to .env.local.",
  );
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  typegen: {
    path: "./src/sanity/queries/**/*.ts",
    schema: "./sanity.schema.json",
    generates: "./src/sanity/sanity.types.ts",
    overloadClientMethods: true,
  },
});
