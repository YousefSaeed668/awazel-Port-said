import Link from "next/link";
import { FolderOpen, RotateCcw, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "cn";

type ProjectsEmptyStateProps =
  | { variant: "empty-archive" }
  | { variant: "no-results"; category: string; onReset: () => void };

export function ProjectsEmptyState(props: ProjectsEmptyStateProps) {
  if (props.variant === "empty-archive") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-6 py-12 text-center shadow-sm">
        <span className="flex size-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FolderOpen aria-hidden="true" className="size-8" />
        </span>
        <h2 className="text-2xl font-semibold text-brand-navy">
          لا توجد مشاريع موثقة بعد
        </h2>
        <p className="max-w-xl text-sm leading-7 text-muted-foreground">
          لم يُنشر أي مشروع في هذا القسم حتى الآن. يمكنك التعرف على أنظمة
          العزل التي ننفذها والاطلاع على خدماتنا في الوقت الحالي.
        </p>
        <Link href="/services" className={cn(buttonVariants(), "mt-2")}>
          تعرف على خدماتنا
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-6 py-12 text-center shadow-sm">
      <span className="flex size-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX aria-hidden="true" className="size-8" />
      </span>
      <h2 className="text-2xl font-semibold text-brand-navy">
        لا توجد مشاريع ضمن هذا التصنيف
      </h2>
      <p className="max-w-xl text-sm leading-7 text-muted-foreground">
        لم نجد أي مشروع موثق ضمن تصنيف{" "}
        <span className="inline-block rounded-lg bg-muted px-1.5 text-brand-navy">
          «{props.category}»
        </span>
        . يمكنك استعراض جميع المشاريع المنفذة بدلاً من ذلك.
      </p>
      <Button type="button" onClick={props.onReset} className="mt-2">
        عرض جميع المشاريع
        <RotateCcw aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}
