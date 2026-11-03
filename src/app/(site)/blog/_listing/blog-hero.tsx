import { BookOpen, FileText } from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const breadcrumbs = [
  { id: "home", label: "الرئيسية", href: "/" },
  { id: "blog", label: "المدونة والمقالات الفنية" },
] as const;

const TITLE = "المدونة والإرشادات الفنية لحماية المباني";
const DESCRIPTION =
  "مقالات ودلائل فنية متخصصة في العزل الحراري والمائي تساعدك على حماية المباني من التسربات والرطوبة والحرارة، من اختيار النظام المناسب إلى خطوات التنفيذ والفحص.";


export function BlogHero({ articleCount }: { articleCount: number }) {
  return (
    <section
      aria-labelledby="blog-page-title"
      className="border-b border-border/60 bg-background pt-8 pb-8 lg:pb-8.25"
    >
      <MaxWidth>
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-3xl min-w-0 flex-col gap-3">
            <p className="inline-flex w-fit items-center gap-2 rounded-lg bg-surface-blue px-3 py-1 text-xs font-medium text-link">
              <BookOpen aria-hidden="true" className="size-3.5" />
              مركز المعرفة الهندسية والتوعية الفنية
            </p>

            <h1
              id="blog-page-title"
              className="text-3xl font-semibold leading-[1.45] tracking-[-0.5px] text-brand-navy sm:text-4xl lg:text-[40px] lg:leading-14.5 lg:tracking-[-1px]"
            >
              {TITLE}
            </h1>

            <p className="text-base leading-6.5 text-muted-foreground">
              {DESCRIPTION}
            </p>
          </div>

          {articleCount > 0 ? (
            <div className="flex w-full shrink-0 items-center gap-4 rounded-xl border border-border bg-card p-4.25 lg:max-w-63.75">
              <div className="min-w-0">
                <p className="text-base font-bold leading-6 text-brand-navy">
                  {articleCount} {articleCount === 1 ? "مقال فني" : "مقالات فنية"}
                </p>
                <p className="mt-1 text-xs leading-4.5 text-muted-foreground">
                  حسب التصنيفات الإنشائية
                </p>
              </div>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface-blue text-link">
                <FileText aria-hidden="true" className="size-5" />
              </span>
            </div>
          ) : null}
        </div>
      </MaxWidth>
    </section>
  );
}
