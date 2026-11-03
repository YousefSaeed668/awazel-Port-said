"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle, Printer, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "cn";

function legacyCopy(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("Copy command failed");
  } finally {
    document.body.removeChild(textarea);
  }
}

function useCopyLink(url: string) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(url);
          setCopyStatus("success");
          return;
        } catch {
        }
      }

      legacyCopy(url);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  };

  return { copyStatus, handleCopy };
}

export function ArticleShare({ title, url }: { title: string; url: string }) {
  const { copyStatus, handleCopy } = useCopyLink(url);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return (
    <div className="relative flex shrink-0 flex-wrap items-center gap-0.5 self-start text-muted-foreground sm:gap-1 xl:self-auto print:hidden [&_a]:border-border [&_a]:bg-card [&_a]:px-2 [&_a]:text-xs">
      <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
        {copyStatus === "success" ? (
          <Check aria-hidden="true" />
        ) : (
          <Link2 aria-hidden="true" />
        )}
        {copyStatus === "success" ? "تم النسخ" : "نسخ الرابط"}
      </Button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "text-whatsapp",
        )}
      >
        <MessageCircle aria-hidden="true" />
        واتساب
      </a>
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        title="مشاركة عبر فيسبوك"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <Share2 aria-hidden="true" />
        <span>فيسبوك</span>
      </a>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => window.print()}
      >
        <Printer aria-hidden="true" />
        طباعة
      </Button>
      <p
        aria-live="polite"
        className={cn(
          "text-xs",
          copyStatus === "error"
            ? "absolute top-full mt-1 text-destructive"
            : "sr-only",
        )}
      >
        {copyStatus === "success"
          ? "تم نسخ الرابط."
          : copyStatus === "error"
            ? "تعذّر نسخ الرابط. انسخه يدويًا من شريط العنوان."
            : null}
      </p>
    </div>
  );
}

export function ArticleShareLink({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const { copyStatus, handleCopy } = useCopyLink(url);

  return (
    <div className="shrink-0 sm:max-w-44 print:hidden">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`نسخ رابط المقال: ${title}`}
        className="inline-flex items-center gap-1 rounded-sm text-start text-xs leading-6 text-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        {copyStatus === "success" ? (
          <Check aria-hidden="true" className="size-4 shrink-0" />
        ) : (
          <Share2 aria-hidden="true" className="size-4 shrink-0" />
        )}
        {copyStatus === "success"
          ? "تم نسخ رابط الدليل"
          : "شارك هذا الدليل مع المالك أو استشاري المشروع"}
      </button>
      <p
        aria-live="polite"
        className={
          copyStatus === "error" ? "text-xs text-destructive" : "sr-only"
        }
      >
        {copyStatus === "success"
          ? "تم نسخ الرابط."
          : copyStatus === "error"
            ? "تعذّر نسخ الرابط. انسخه من شريط العنوان."
            : null}
      </p>
    </div>
  );
}
