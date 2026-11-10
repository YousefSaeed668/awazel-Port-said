import "server-only";

import type { ComponentProps } from "react";

import type { SectionHeading } from "@/components/ui/section-heading";
import type { WorkStages } from "@/components/work-stages";

type SectionIntro = Pick<
  ComponentProps<typeof SectionHeading>,
  "title" | "eyebrow" | "description" | "action"
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
  },
};
