import type { Metadata } from "next";

import { homepageData } from "@/lib/data";
import { getArticleIndex } from "@/sanity/data/article-index";
import {
  getCertificatesPageContent,
  getCompanyProfileFile,
} from "@/sanity/data/certificates-page";
import { getHomePageContent } from "@/sanity/data/home-page";
import { requireNavigationPage } from "@/sanity/data/page-availability";
import { getProjectIndex } from "@/sanity/data/project-index";
import { getServicesPageContent } from "@/sanity/data/services-page";

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
  await requireNavigationPage("/");
  const [homePage, certificatesPage, servicesPage, projects, articles] =
    await Promise.all([
      getHomePageContent(),
      getCertificatesPageContent(),
      getServicesPageContent(),
      getProjectIndex(),
      getArticleIndex(),
    ]);
  const profileFile =
    homePage.company.secondaryAction?.kind === "companyProfile"
      ? await getCompanyProfileFile()
      : null;

  return (
    <>
      <HeroSection content={homePage.hero} />
      <ApprovalsSection
        content={homepageData.approvals}
        items={certificatesPage.certificates.items}
      />
      <ServicesSection
        content={homepageData.services}
        items={servicesPage.applications.items}
      />
      <ProjectsSection
        content={homepageData.projects}
        items={projects.slice(0, 3)}
      />
      <CompanySection content={homePage.company} profileFile={profileFile} />
      <WorkStagesSection content={homePage.workStages} />
      <QualitySection content={homePage.quality} />
      <FaqSection content={homePage.faq} />
      <ArticlesSection
        content={homepageData.articles}
        items={articles.slice(0, 3)}
      />
    </>
  );
}
