import "server-only";

import type { ComponentProps } from "react";

import type { SectionHeading } from "@/components/ui/section-heading";
import type { CertificateCard, ServiceCard } from "@/components/company-cards";
import type { WorkStages } from "@/components/work-stages";

type SectionIntro = Pick<
  ComponentProps<typeof SectionHeading>,
  "title" | "eyebrow" | "description" | "action"
>;

type CertificateItem = { id: string } & Omit<
  ComponentProps<typeof CertificateCard>,
  "className" | "headingLevel"
>;

type CapabilityItem = { id: string } & Omit<
  ComponentProps<typeof ServiceCard>,
  "className" | "headingLevel"
>;

type WorkStageItem = ComponentProps<typeof WorkStages>["items"][number];

interface AboutImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

interface AboutFact {
  id: string;
  label: string;
  value: string;
  icon: "verified" | "distance" | "security" | "engineering";
}

interface AboutValue {
  id: string;
  title: string;
  description: string;
  icon: "quality" | "safety" | "environment";
  checks: readonly { id: string; label: string }[];
}

interface AboutProfileFile {
  href: string;
  fileName: string;
  sizeLabel?: string;
}

interface AboutProfile {
  badge: string;
  version: string;
  title: string;
  description: string;
  downloadLabel: string;
  file: AboutProfileFile | null;
  unavailableLabel: string;
  unavailableHint: string;
}

export interface AboutPageData {
  breadcrumbs: readonly { id: string; label: string; href?: string }[];
  intro: SectionIntro;
  company: {
    eyebrow: string;
    title: string;
    paragraphs: readonly { id: string; text: string }[];
    facts: readonly AboutFact[];
    image: AboutImage;
    panel: {
      title: string;
      description: string;
      metric: { value: string; label: string };
    };
  };
  capabilities: {
    heading: SectionIntro;
    items: readonly CapabilityItem[];
  };
  methodology: {
    heading: SectionIntro;
    label: string;
    items: readonly WorkStageItem[];
  };
  values: {
    heading: SectionIntro;
    items: readonly AboutValue[];
  };
  approvals: {
    heading: SectionIntro;
    items: readonly CertificateItem[];
  };
  profile: AboutProfile;
  seo: {
    title: string;
    description: string;
  };
}

export type AboutPageContent = Omit<AboutPageData, "approvals">;

export const aboutData: Pick<AboutPageData, "approvals"> = {
  approvals: {
    heading: {
      eyebrow: "شراكات التميز الصناعي",
      title: "اعتمادات التركيب من كبرى الشركات المصنعة",
      action: {
        label: "استعرض كافة الاعتمادات والشهادات الرسمية",
        href: "/certificates",
      },
    },
    items: [
      {
        id: "bitumat",
        issuer: "بيتومات (BITUMAT)",
        issuerSecondaryName: "شركة تصنيع مواد العزل المائي العالمية",
        description:
          "اعتماد رسمي كجهة تطبيق وتركيب معتمدة لأنظمة الأغشية البيتومينية والمستحلبات الإسفلتية المقواة للأقبية والأسطح.",
        badge: "BITUMAT",
        icon: "badge",
        status: { label: "سارٍ لعام 2026/2027", tone: "valid" },
      },
      {
        id: "izomaks",
        issuer: "إيزوماكس (IZOMAKS)",
        issuerSecondaryName: "أنظمة العزل وحلول الحماية الخرسانية",
        description:
          "معتمد للأعمال المائية وعزل الأسطح واستخدام لفائف البوليمر عالية المرونة لمقاومة التشققات والتمدد الحراري.",
        badge: "IZOMAKS",
        icon: "badge",
        status: { label: "اعتماد فني سارٍ", tone: "valid" },
      },
      {
        id: "anqa",
        issuer: "عنقاء (ANQA)",
        issuerSecondaryName: "تقنيات العزل المائي والحراري المتقدمة",
        description:
          "اعتماد تركيب احترافي لأنظمة العزل المزدوج الفوم والبولي يوريثان لحماية المباني والمنشآت ضد الإجهادات المناخية.",
        badge: "ANQA",
        icon: "badge",
        status: { label: "اعتماد سنوي مجدد", tone: "valid" },
      },
    ],
  },
};
