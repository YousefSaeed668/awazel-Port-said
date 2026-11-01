import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

const readToken = process.env.SANITY_API_READ_TOKEN?.trim();

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  useCdn: false,
  stega: false,
  ...(readToken ? { token: readToken } : {}),
});
