import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", getSiteUrl()).toString(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/about", getSiteUrl()).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
