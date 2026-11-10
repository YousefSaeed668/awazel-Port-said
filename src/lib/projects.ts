import type { ResolvedDestination } from "./links";

export const PROJECTS_PATH = "/projects";

export const PROJECTS_LISTING_PAGE_SIZE = 6;


export const PROJECT_CATEGORIES = [
  "عزل الأسطح",
  "عزل الأساسات والقواعد",
  "عزل الخزانات الأرضية",
  "عزل الحمامات والمطابخ",
  "العزل الحراري وترشيد الطاقة",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUS_TONES = [
  "completed",
  "certified",
  "inProgress",
  "neutral",
] as const;

export type ProjectStatusTone = (typeof PROJECT_STATUS_TONES)[number];

export const PROJECT_ASSURANCE_ICONS = [
  "shield",
  "compliance",
  "test",
] as const;

export type ProjectAssuranceIcon =
  (typeof PROJECT_ASSURANCE_ICONS)[number];

export type ProjectImage = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export type ProjectFact = {
  label: string;
  value: string;
};

export type ProjectListingItem = {
  id: string;
  title: string;
  href: string;
  summary: string;
  image: ProjectImage;
  category: ProjectCategory;
  status: {
    label: string;
    tone: ProjectStatusTone;
  };
  location: string;
  completedAt: string;
  measurement: ProjectFact;
  system: ProjectFact;
  highlight?: string;
};

export type ProjectCategoryFacet = {
  category: ProjectCategory;
  count: number;
};

export type ProjectsPageContent = {
  intro: {
    eyebrow: string;
    title: string;
    description: string;
    context: string;
  };
  assurance: {
    items: readonly {
      id: string;
      title: string;
      description: string;
      icon: ProjectAssuranceIcon;
    }[];
  };
  closing: {
    eyebrow: string;
    title: string;
    description: string;
    whatsappAction: ResolvedDestination & { label: string };
  };
  seo: {
    title: string;
    description: string;
  };
};

export const PROJECT_SORT_OPTIONS = [
  { value: "newest", label: "الأحدث تنفيذاً" },
  { value: "oldest", label: "الأقدم تنفيذاً" },
] as const;

export type ProjectSort = (typeof PROJECT_SORT_OPTIONS)[number]["value"];

export function projectPath(slug: string) {
  return `${PROJECTS_PATH}/${encodeURIComponent(slug)}`;
}

export function filterProjectsByCategory(
  projects: readonly ProjectListingItem[],
  category: ProjectCategory | null,
) {
  if (!category) return [...projects];
  return projects.filter((project) => project.category === category);
}

const categoryOrder = new Map<ProjectCategory, number>(
  PROJECT_CATEGORIES.map((category, index) => [category, index]),
);

export function getProjectCategoryFacets(
  projects: readonly ProjectListingItem[],
): ProjectCategoryFacet[] {
  const facets = new Map<ProjectCategory, number>();

  for (const project of projects) {
    facets.set(project.category, (facets.get(project.category) ?? 0) + 1);
  }

  return [...facets.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort(
      (left, right) =>
        right.count - left.count ||
        (categoryOrder.get(left.category) ?? 0) -
          (categoryOrder.get(right.category) ?? 0),
    );
}

function completedTime(project: ProjectListingItem) {
  const time = Date.parse(project.completedAt);
  return Number.isFinite(time) ? time : 0;
}

export function sortProjects(
  projects: readonly ProjectListingItem[],
  sort: ProjectSort,
) {
  return [...projects].sort((left, right) => {
    const difference =
      sort === "oldest"
        ? completedTime(left) - completedTime(right)
        : completedTime(right) - completedTime(left);

    return difference || left.id.localeCompare(right.id);
  });
}

export function getProjectPageCount(
  totalItems: number,
  pageSize = PROJECTS_LISTING_PAGE_SIZE,
) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function getProjectPageItems<T>(
  items: readonly T[],
  page: number,
  pageSize = PROJECTS_LISTING_PAGE_SIZE,
) {
  const pageCount = getProjectPageCount(items.length, pageSize);
  const current = Math.min(Math.max(Math.trunc(page) || 1, 1), pageCount);
  const start = (current - 1) * pageSize;
  const end = Math.min(start + pageSize, items.length);

  return {
    current,
    pageCount,
    start,
    end,
    items: items.slice(start, end),
  };
}

export type ProjectPaginationItem = number | "ellipsis";

export function getProjectPaginationWindow(
  current: number,
  pageCount: number,
): ProjectPaginationItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const safeCurrent = Math.min(Math.max(current, 1), pageCount);
  const pages = new Set([
    1,
    pageCount,
    safeCurrent - 1,
    safeCurrent,
    safeCurrent + 1,
  ]);

  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((left, right) => left - right);

  const window: ProjectPaginationItem[] = [];
  let previous = 0;

  for (const page of sorted) {
    if (previous > 0 && page - previous > 1) {
      window.push("ellipsis");
    }
    window.push(page);
    previous = page;
  }

  return window;
}

const countForms = {
  documented: {
    one: "مشروع واحد موثق",
    two: "مشروعان موثقان",
    few: (count: number) => `${count} مشاريع موثقة`,
    many: (count: number) => `${count} مشروعاً موثقاً`,
  },
  executed: {
    one: "مشروع واحد منفذ",
    two: "مشروعان منفذان",
    few: (count: number) => `${count} مشاريع منفذة`,
    many: (count: number) => `${count} مشروعاً منفذاً`,
  },
} as const;

export function formatProjectCount(
  count: number,
  form: keyof typeof countForms = "documented",
) {
  if (count <= 0) return "لا توجد مشاريع";
  const forms = countForms[form];
  if (count === 1) return forms.one;
  if (count === 2) return forms.two;
  if (count <= 10) return forms.few(count);
  return forms.many(count);
}
