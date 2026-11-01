"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

function StudioDirectionScope({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;
    const previousDir = root.dir;

    root.lang = "en";
    root.dir = "ltr";

    return () => {
      root.lang = previousLang;
      root.dir = previousDir;
    };
  }, []);

  return (
    <div lang="en" dir="ltr" className="min-h-dvh">
      {children}
    </div>
  );
}

export { StudioDirectionScope };
