import "server-only";

import type { ComponentProps } from "react";

import type { WorkStages } from "@/components/work-stages";

import type { SectionHeading } from "@/components/ui/section-heading";

type SectionIntro = Pick<
  ComponentProps<typeof SectionHeading>,
  "title" | "eyebrow" | "description" | "action"
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

type CompanySecondaryAction =
  | ({ kind: "link" } & NonNullable<HomepageAction>)
  | { kind: "companyProfile"; label: string }
  | null;

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
  };
  services: {
    heading: SectionIntro;
  };
  projects: {
    heading: SectionIntro;
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
    secondaryAction: CompanySecondaryAction;
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
  };
}

export type HomePageContent = Pick<
  HomepageData,
  "hero" | "company" | "workStages" | "quality" | "faq"
>;

export const homepageData: Pick<
  HomepageData,
  "approvals" | "services" | "projects" | "articles"
> = {
  approvals: {
    heading: {
      eyebrow: "اعتمادات موثوقة",
      title: "اعتمادات وشهادات موثوقة",
      description:
        "نعمل وفق معايير ومواصفات معتمدة، ونوثّق كل مرحلة لضمان جودة التنفيذ وسلامة المنشأة.",
      action: { label: "عرض الاعتمادات", href: "/certificates" },
    },
  },
  services: {
    heading: {
      eyebrow: "خدماتنا",
      title: "حلول العزل المناسبة حسب طبيعة المنشأة والتطبيق",
      description:
        "نختار النظام الأنسب بعد فحص الموقع، مع مواد معتمدة وتنفيذ دقيق واختبارات تسليم موثقة.",
      action: { label: "عرض جميع الخدمات", href: "/services" },
    },
  },
  projects: {
    heading: {
      eyebrow: "مشاريعنا",
      title: "نماذج من أعمال العزل المنفذة في الميدان",
      description:
        "مشاريع مختارة توضح طريقة التعامل مع اختلاف طبيعة المنشأة ومتطلبات كل موقع.",
      action: { label: "عرض جميع المشاريع", href: "/projects" },
    },
  },
  articles: {
    heading: {
      eyebrow: "المدونة",
      title: "مقالات وإرشادات فنية لحماية المبنى",
      description:
        "محتوى عملي يساعدك على فهم أنظمة العزل واتخاذ قرارات صيانة مدروسة.",
      action: { label: "عرض جميع المقالات", href: "/blog" },
    },
  },
};
