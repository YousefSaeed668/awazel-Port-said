import "server-only";

import type { ComponentProps } from "react";

import type { CertificateCard } from "@/components/company-cards";
import type { SectionHeading } from "@/components/ui/section-heading";

/**
 * `/certificates` UI contract. All values are normalized at the Sanity server
 * boundary; cards only render serializable presentation props.
 */

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
    /** An empty array is a valid, intentionally empty published state. */
    items: readonly CertificateItem[];
  };
  seo: {
    title: string;
    description: string;
  };
}

/**
 * The company profile PDF is owned by the `aboutPage` singleton. Only the
 * fields needed by the certificates download action are loaded here.
 */
export interface CompanyProfileFile {
  href: string;
  fileName: string;
  sizeLabel?: string;
}
