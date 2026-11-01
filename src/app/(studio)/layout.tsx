import type { Metadata, Viewport } from "next";
import {
  metadata as studioMetadata,
  viewport as studioViewport,
} from "next-sanity/studio";
import type { ReactNode } from "react";

import { StudioDirectionScope } from "@/components/StudioDirectionScope";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Sanity Studio",
};

export const viewport: Viewport = studioViewport;

export default function StudioLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <StudioDirectionScope>{children}</StudioDirectionScope>;
}
