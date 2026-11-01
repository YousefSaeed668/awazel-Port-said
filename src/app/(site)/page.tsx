import type { Metadata } from "next";

import { homepageData } from "@/lib/data";
import { getHomePageContent } from "@/sanity/data/home-page";

import { ArticlesSection } from "./_home/blog-section";
import {
  CompanySection,
  QualitySection,
  WorkStagesSection,
} from "./_home/company-sections";
import { FaqSection } from "./_home/faq-section";
import {
  ApprovalsSection,
  HeroSection,
  ProjectsSection,
  ServicesSection,
} from "./_home/hero-sections";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const homePage = await getHomePageContent();

  return (
    <>
      <HeroSection content={homePage.hero} />
      <ApprovalsSection content={homepageData.approvals} />
      <ServicesSection content={homepageData.services} />
      <ProjectsSection content={homepageData.projects} />
      <CompanySection content={homePage.company} />
      <WorkStagesSection content={homePage.workStages} />
      <QualitySection content={homePage.quality} />
      <FaqSection content={homePage.faq} />
      <ArticlesSection content={homepageData.articles} />
    </>
  );
}
