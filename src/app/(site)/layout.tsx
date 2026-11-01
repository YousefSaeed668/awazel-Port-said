import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteProviders } from "@/components/SiteProviders";
import { buildDefaultMetadata } from "@/lib/metadata";
import { getSiteShell } from "@/sanity/data/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const { defaultSeo } = await getSiteShell();
  return buildDefaultMetadata(defaultSeo);
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const shell = await getSiteShell();

  return (
    <SiteProviders>
      <Header {...shell.header} />
      <main>{children}</main>
      <Footer {...shell.footer} />
    </SiteProviders>
  );
}
