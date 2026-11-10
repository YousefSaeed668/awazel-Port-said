export interface ServicesHeading {
  eyebrow: string;
  title: string;
  description: string;
}

export interface ServiceApplication {
  id: string;
  title: string;
  description: string;
  tags: readonly { id: string; label: string }[];
  image: { src: string; alt: string };
  imageBadge?: string;
  systemsLabel?: string;
  systems: readonly { id: string; label: string }[];
  metrics: readonly {
    id: string;
    label: string;
    value: string;
    unit?: string;
  }[];
}

export const SERVICE_TECHNOLOGY_ICONS = [
  "foam",
  "spray",
  "layers",
  "slope",
] as const;
export type ServiceTechnologyIcon = (typeof SERVICE_TECHNOLOGY_ICONS)[number];

export interface ServicesPageContent {
  intro: ServicesHeading;
  applications: {
    heading: ServicesHeading;
    items: readonly ServiceApplication[];
  };
  technologies: {
    heading: ServicesHeading;
    note: string;
    items: readonly {
      id: string;
      title: string;
      englishTitle: string;
      description: string;
      icon: ServiceTechnologyIcon;
      noteLabel: string;
      note: string;
    }[];
  };
  assessment: {
    heading: ServicesHeading;
    factors: readonly { id: string; title: string; description: string }[];
  };
  faq: {
    heading: ServicesHeading;
    items: readonly { id: string; question: string; answer: string }[];
  };
  seo: { title: string; description: string };
}
