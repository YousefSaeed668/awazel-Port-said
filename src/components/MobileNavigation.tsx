"use client";

import { cn } from "cn";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { isActivePath } from "@/lib/utils";
import type { HeaderViewModel } from "@/lib/site-view-models";

import { MaxWidth } from "./MaxWidth";
import { Button, buttonVariants } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

type MobileNavigationProps = Pick<
  HeaderViewModel,
  "companyName" | "navigation" | "primaryAction"
>;

export function MobileNavigation({
  companyName,
  navigation,
  primaryAction,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    const media = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false);
    };

    closeOnDesktop();
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="فتح القائمة"
            className="xl:hidden"
          />
        }
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>

      <SheetContent
        side="top"
        dir="rtl"
        lang="ar"
        showCloseButton={false}
        className="max-h-[90dvh] gap-0 overflow-y-auto p-0"
      >
        <MaxWidth className="py-5">
          <SheetHeader className="flex-row items-center justify-between gap-4 border-b pb-5 text-start">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {companyName}
              </SheetTitle>
              <SheetDescription className="sr-only">
                تصفح صفحات الموقع أو تواصل معنا لطلب عرض سعر.
              </SheetDescription>
            </div>
            <SheetClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="إغلاق القائمة"
                />
              }
            >
              <X className="size-5" aria-hidden="true" />
            </SheetClose>
          </SheetHeader>

          <nav aria-label="قائمة التنقل" className="py-4">
            <ul className="space-y-1">
              {navigation.map(
                ({ key, href, label, external, openInNewTab }) => {
                  const active = !external && isActivePath(pathname, href);
                  return (
                    <li key={key}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        target={openInNewTab ? "_blank" : undefined}
                        rel={openInNewTab ? "noopener noreferrer" : undefined}
                        className={cn(
                          "block rounded-md px-4 py-3 text-start font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          active ? "bg-accent text-link" : "text-foreground",
                        )}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                },
              )}
            </ul>
          </nav>

          {primaryAction && (
            <div className="flex flex-wrap items-center gap-3 border-t pt-5">
              <Link
                href={primaryAction.href}
                onClick={() => setOpen(false)}
                target={primaryAction.openInNewTab ? "_blank" : undefined}
                rel={
                  primaryAction.openInNewTab
                    ? "noopener noreferrer"
                    : undefined
                }
                className={cn(buttonVariants(), "grow")}
              >
                {primaryAction.label}
              </Link>
            </div>
          )}
        </MaxWidth>
      </SheetContent>
    </Sheet>
  );
}
