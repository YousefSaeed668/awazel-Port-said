export type SiteImageViewModel = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type SiteLinkViewModel = {
  key: string;
  label: string;
  href: string;
  external: boolean;
  openInNewTab: boolean;
};

export type SiteActionViewModel = Omit<SiteLinkViewModel, "key">;

export type ContactRowViewModel = {
  key: "phone" | "email" | "address" | "hours";
  label: string;
  value: string;
  href?: string;
  ltr: boolean;
};

export type HeaderViewModel = {
  companyName: string;
  logo: SiteImageViewModel;
  navigation: SiteLinkViewModel[];
  primaryAction: SiteActionViewModel | null;
};

export type FooterViewModel = {
  description: string;
  logo: SiteImageViewModel;
  badges: string[];
  quickLinks: {
    heading: string;
    links: SiteLinkViewModel[];
  };
  services: {
    heading: string;
    links: SiteLinkViewModel[];
  };
  contact: {
    heading: string;
    rows: ContactRowViewModel[];
    action: SiteActionViewModel | null;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primary: SiteActionViewModel;
    secondary: SiteActionViewModel;
    supporting: {
      label: string;
      href?: string;
      external: boolean;
    } | null;
  } | null;
  legal: {
    links: SiteLinkViewModel[];
    copyright: string;
  };
};

export type DefaultSeoViewModel = {
  title: string;
  description: string;
  siteName: string;
  image: SiteImageViewModel | null;
};

export type SiteShellViewModel = {
  header: HeaderViewModel;
  footer: FooterViewModel;
  defaultSeo: DefaultSeoViewModel;
};
