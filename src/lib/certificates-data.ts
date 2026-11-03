import "server-only";

import type { ComponentProps } from "react";

import type { CertificateCard } from "@/components/company-cards";
import type { SectionHeading } from "@/components/ui/section-heading";

type SectionIntro = Pick<
  ComponentProps<typeof SectionHeading>,
  "title" | "eyebrow" | "description"
>;

type CertificateItem = { id: string } & Omit<
  ComponentProps<typeof CertificateCard>,
  "className" | "headingLevel" | "allowPreview"
>;

export interface CertificatesPageContent {
  intro: {
    eyebrow: string;
    title: string;
    description: string;
  };
  certificates: {
    heading: SectionIntro;
    items: readonly CertificateItem[];
  };
  seo: {
    title: string;
    description: string;
  };
}

export interface CompanyProfileFile {
  href: string;
  fileName: string;
  sizeLabel?: string;
}
