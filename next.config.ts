import type { NextConfig } from "next";

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

const nextConfig: NextConfig = {
  images: {
    remotePatterns:
      sanityProjectId && sanityDataset
        ? [
            {
              protocol: "https",
              hostname: "cdn.sanity.io",
              pathname: `/images/${sanityProjectId}/${sanityDataset}/**`,
            },
          ]
        : [],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
