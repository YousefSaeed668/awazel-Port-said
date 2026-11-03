import Link from "next/link";
import { FileText, RotateCcw, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "cn";

type BlogEmptyStateProps =
  | {
      variant: "no-results";
      query: string;
      onReset: () => void;
      secondaryAction?: { label: string; onClick: () => void };
    }
  | { variant: "empty-archive" };

export function BlogEmptyState(props: BlogEmptyStateProps) {
  if (props.variant === "empty-archive") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-6 py-12 text-center shadow-sm">
        <span className="flex size-20 items-center justify-center rounded-full bg-[#f1f4f6] text-muted-foreground">
          <FileText aria-hidden="true" className="size-8" />
        </span>
        <h2 className="text-2xl font-semibold text-brand-navy">
          لا توجد مقالات منشورة بعد
        </h2>
        <p className="max-w-xl text-sm leading-7 text-muted-foreground">
          لم يُنشر أي مقال في المدونة حتى الآن. يمكنك التعرف على الشركة
          وخدماتها في الوقت الحالي والعودة إلى المدونة لاحقاً.
        </p>
        <Link href="/about" className={cn(buttonVariants(), "mt-2")}>
          تعرف على الشركة
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-6 py-12 text-center shadow-sm">
      <span className="relative flex size-20 items-center justify-center rounded-full bg-[#f1f4f6] text-muted-foreground">
        <SearchX aria-hidden="true" className="size-8" />
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -inset-s-0.5 flex size-6 items-center justify-center rounded-full bg-[#ffdad6] text-sm font-bold text-[#b42318]"
        >
          !
        </span>
      </span>

      <h2 className="text-2xl font-semibold text-brand-navy">
        لم يتم العثور على مقالات مطابقة لبحثك
      </h2>

      <p className="max-w-xl text-sm leading-7 text-muted-foreground">
        {props.query ? (
          <>
            لم نجد أي نتائج متطابقة مع عبارة البحث{" "}
            <span className="inline-block rounded-lg bg-[#ebeef0] px-1.5 text-brand-navy">
              «{props.query}»
            </span>
            . يرجى التأكد من صحة الكلمات المفتاحية أو استعراض المقالات وفق
            التصنيفات الإنشائية المعتمدة.
          </>
        ) : (
          <>
            لم نجد أي مقالات ضمن التصنيف المحدد. يرجى استعراض المقالات وفق
            التصنيفات الإنشائية المعتمدة أو مسح التصفية.
          </>
        )}
      </p>

      <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
        <Button type="button" onClick={props.onReset}>
          مسح التصفية والبحث
          <RotateCcw aria-hidden="true" className="size-4" />
        </Button>
        {props.secondaryAction ? (
          <Button
            type="button"
            variant="outline"
            onClick={props.secondaryAction.onClick}
          >
            {props.secondaryAction.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
