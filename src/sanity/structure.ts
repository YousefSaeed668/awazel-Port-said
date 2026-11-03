import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("إدارة المحتوى")
    .items([
      S.listItem().title("الصفحة الرئيسية").singleton("homePage"),
      S.listItem().title("من نحن").singleton("aboutPage"),
      S.listItem().title("الاعتمادات والشهادات").singleton("certificatesPage"),
      S.divider(),
      S.listItem()
        .title("المقالات")
        .child(S.documentTypeList("article").title("المقالات")),
      S.listItem()
        .title("كتّاب المقالات")
        .child(S.documentTypeList("author").title("كتّاب المقالات")),
      S.listItem()
        .title("وسوم المقالات")
        .child(S.documentTypeList("blogTag").title("وسوم المقالات")),
      S.listItem().title("إعدادات المدونة").singleton("blogSettings"),
      S.divider(),
      S.listItem().title("إعدادات الموقع").singleton("siteSettings"),
    ]);
