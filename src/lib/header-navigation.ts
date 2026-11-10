import { isSafeInternalPath } from "@/lib/links";

export const HEADER_PAGES = [
  { title: "الرئيسية", value: "/" },
  { title: "من نحن", value: "/about" },
  { title: "الخدمات", value: "/services" },
  { title: "المشاريع", value: "/projects" },
  { title: "الاعتمادات والشهادات", value: "/certificates" },
  { title: "المدونة", value: "/blog" },
  { title: "تواصل معنا", value: "/contact" },
] as const;

export const HEADER_PAGE_LIMIT = HEADER_PAGES.length;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getHeaderPagePath(value: unknown) {
  if (typeof value !== "string") return null;
  const href = value.trim();
  if (!isSafeInternalPath(href)) return null;

  // Match the existing page-availability policy for stored legacy links.
  const path = href.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
  return HEADER_PAGES.find((page) => page.value === path)?.value ?? null;
}

export function getAvailableHeaderPages(value: unknown, currentKey?: string) {
  const used = new Set<string>();
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!isRecord(item) || item._key === currentKey) continue;
      if (!isRecord(item.destination)) continue;
      const page = getHeaderPagePath(item.destination.href);
      if (page) used.add(page);
    }
  }

  return HEADER_PAGES.filter((page) => !used.has(page.value));
}

export function validateHeaderNavigation(value: unknown): true | string {
  if (value == null) return true;
  if (!Array.isArray(value)) return "قائمة صفحات شريط التنقل غير صالحة.";
  if (value.length > HEADER_PAGE_LIMIT) {
    return "يمكن إضافة الصفحات السبع المبرمجة فقط إلى شريط التنقل.";
  }

  const pages = new Set<string>();
  const keys = new Set<string>();
  for (const [index, item] of value.entries()) {
    const position = index + 1;
    if (!isRecord(item) || typeof item._key !== "string" || !item._key.trim()) {
      return `العنصر ${position} بلا معرّف صالح؛ احذفه وأعد إضافته.`;
    }
    if (keys.has(item._key)) {
      return `معرّف العنصر ${position} مكرر؛ احذفه وأعد إضافته.`;
    }
    keys.add(item._key);

    const destination = item.destination;
    if (
      !isRecord(destination) ||
      (destination.kind != null && destination.kind !== "internal")
    ) {
      return `اختر صفحة داخلية مبرمجة للعنصر ${position}. احذف الرابط القديم غير المدعوم وأعد إضافته.`;
    }
    const page = getHeaderPagePath(destination.href);
    if (!page) {
      return `اختر إحدى الصفحات السبع المبرمجة للعنصر ${position}؛ الروابط الأخرى غير مدعومة هنا.`;
    }
    if (pages.has(page)) {
      return `الصفحة في العنصر ${position} موجودة بالفعل، حتى إن كان رابطها الآخر غير ظاهر.`;
    }
    pages.add(page);
  }

  return true;
}
