import "server-only";

import type { ComponentProps } from "react";

import type { CertificateCard, ServiceCard } from "@/components/company-cards";
import type { BlogCard, ProjectCard } from "@/components/content-cards";
import type { WorkStages } from "@/components/work-stages";

import { SectionHeading } from "@/components/ui/section-heading";

import { companyContent, projectsContent, workStagesContent } from "./homepage-data/company";
import { articlesContent, faqContent, qualityContent } from "./homepage-data/content";
import { approvalsContent, heroContent, servicesContent } from "./homepage-data/hero";

type SectionIntro = Pick<
  ComponentProps<typeof SectionHeading>,
  "title" | "eyebrow" | "description" | "action"
>;

type CertificateItem = { id: string } & Omit<
  ComponentProps<typeof CertificateCard>,
  "className" | "headingLevel"
>;

type ServiceItem = { id: string } & Omit<
  ComponentProps<typeof ServiceCard>,
  "className" | "headingLevel"
>;

type ProjectItem = { id: string } & Omit<
  ComponentProps<typeof ProjectCard>,
  "className" | "headingLevel" | "imageSizes" | "linkLabel"
>;

type BlogItem = { id: string } & Omit<
  ComponentProps<typeof BlogCard>,
  "className" | "headingLevel" | "imageSizes" | "publishedDate"
>;

type FeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: "target" | "badge" | "shield";
};

type WorkStageItem = ComponentProps<typeof WorkStages>["items"][number];

interface HomepageImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

type HomepageAction = {
  label: string;
  href: string;
  external?: boolean;
  openInNewTab?: boolean;
} | null;

interface HeroHighlight {
  id: string;
  label: string;
  icon: "compliance" | "quality" | "supervision";
}

interface QualityCheck {
  id: string;
  title: string;
  description: string;
  icon: "water" | "ruler" | "document";
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface HomepageData {
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    primaryAction: HomepageAction;
    secondaryAction: HomepageAction;
    highlights: readonly HeroHighlight[];
    image: HomepageImage;
    panel: {
      status: string;
      location: string;
      title: string;
    };
  };
  approvals: {
    heading: SectionIntro;
    items: readonly CertificateItem[];
  };
  services: {
    heading: SectionIntro;
    items: readonly ServiceItem[];
  };
  projects: {
    heading: SectionIntro;
    items: readonly ProjectItem[];
  };
  company: {
    eyebrow: string;
    title: string;
    description: string;
    image: HomepageImage;
    panel: {
      title: string;
      description: string;
    };
    features: readonly FeatureItem[];
    primaryAction: HomepageAction;
    secondaryAction: HomepageAction;
  };
  workStages: {
    heading: SectionIntro;
    label: string;
    items: readonly WorkStageItem[];
  };
  quality: {
    eyebrow: string;
    title: string;
    description: string;
    checks: readonly QualityCheck[];
    warranty: {
      badge?: string;
      title: string;
      description: string;
      items?: readonly string[];
      action: HomepageAction;
    };
  };
  faq: {
    heading: SectionIntro;
    items: readonly FaqItem[];
  };
  articles: {
    heading: SectionIntro;
    items: readonly BlogItem[];
  };
}

export type HomePageContent = Pick<
  HomepageData,
  "hero" | "company" | "workStages" | "quality" | "faq"
>;

export const homepageData: HomepageData = {
  hero: heroContent,
  approvals: approvalsContent,
  services: servicesContent,
  projects: projectsContent,
  company: companyContent,
  workStages: workStagesContent,
  quality: qualityContent,
  faq: faqContent,
  articles: articlesContent,
};
