"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Download, Eye, FileText, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "cn";

interface CertificatePreviewProps {
  title: string;
  issuer: string;
  reference?: string;
  previewUrl: string;
  downloadHref: string;
  fileName: string;
  className?: string;
}

export function CertificatePreview({
  title,
  issuer,
  reference,
  previewUrl,
  downloadHref,
  fileName,
  className,
}: CertificatePreviewProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label={`عرض ومعاينة ${title}`}
        className={cn(buttonVariants(), "flex-1", className)}
      >
        <Eye aria-hidden="true" className="size-4" />
        عرض ومعاينة
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-brand-navy/70 backdrop-blur-sm transition-opacity duration-150 data-ending-style:opacity-0" />
        <Dialog.Popup className="fixed inset-x-2 inset-y-2 z-50 mx-auto flex max-w-6xl flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-2xl ring-1 ring-border/70 transition duration-150 data-starting-style:opacity-0 sm:inset-x-4 sm:inset-y-4 lg:inset-x-8 lg:inset-y-6">
          <div className="flex items-start justify-between gap-3 border-b border-border p-4 sm:p-5">
            <div className="flex min-w-0 items-start gap-3">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-blue text-link">
                <FileText aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <Dialog.Title className="text-base font-bold leading-7 wrap-break-word text-brand-navy sm:text-lg">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-xs leading-6 text-muted-foreground">
                  {issuer}
                  {reference ? ` · مرجع: ${reference}` : null}
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0"
                />
              }
            >
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">إغلاق المعاينة</span>
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 bg-muted">
            <object
              data={previewUrl}
              type="application/pdf"
              title={`معاينة ${title} بصيغة PDF`}
              className="size-full"
            >
              <div className="flex size-full flex-col items-center justify-center gap-4 overflow-y-auto p-6 text-center">
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-card text-link shadow-sm">
                  <FileText aria-hidden="true" className="size-7" />
                </span>
                <div className="max-w-md">
                  <p className="text-base font-bold leading-7 text-brand-navy">
                    تعذّر عرض الملف داخل المتصفح
                  </p>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    قد لا يدعم متصفحك معاينة ملفات PDF المدمجة. يمكنك فتح
                    المستند في تبويب جديد أو تنزيله مباشرة.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    فتح المستند في تبويب جديد
                  </a>
                  <a
                    href={downloadHref}
                    download={fileName}
                    className={buttonVariants()}
                  >
                    <Download aria-hidden="true" className="size-4" />
                    تحميل PDF
                  </a>
                </div>
              </div>
            </object>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card p-3 sm:px-5">
            <p className="text-xs leading-6 text-muted-foreground">
              {fileName}
            </p>
            <a
              href={downloadHref}
              download={fileName}
              title={fileName}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Download aria-hidden="true" className="size-4" />
              تحميل PDF
            </a>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export type { CertificatePreviewProps };
