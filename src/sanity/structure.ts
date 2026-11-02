import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("إدارة المحتوى")
    .items([
      S.listItem().title("الصفحة الرئيسية").singleton("homePage"),
      S.listItem().title("من نحن").singleton("aboutPage"),
      S.listItem().title("إعدادات الموقع").singleton("siteSettings"),
    ]);
