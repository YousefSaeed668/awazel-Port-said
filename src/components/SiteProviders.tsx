"use client";

import { DirectionProvider } from "@base-ui/react/direction-provider";
import type { ReactNode } from "react";

function SiteProviders({ children }: { children: ReactNode }) {
  return <DirectionProvider direction="rtl">{children}</DirectionProvider>;
}

export { SiteProviders };
