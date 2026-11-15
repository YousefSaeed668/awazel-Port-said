"use client";

import { cn } from "cn";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { isActivePath } from "@/lib/utils";
import type { HeaderViewModel } from "@/lib/site-view-models";

import { MaxWidth } from "./MaxWidth";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

type MobileNavigationProps = Pick<HeaderViewModel, "navigation">;

export function MobileNavigation({ navigation }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const currentPage = navigation.find(
    ({ href, external }) => !external && isActivePath(pathname, href),
  );

  useEffect(() => {
    if (!open) return;

    const media = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false);
    };

    closeOnDesktop();
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div
        data-mobile-header
        className="pointer-events-auto flex w-full min-w-0 items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/95 p-2 ps-4 shadow-sm backdrop-blur-xl lg:hidden"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-7 w-0.5 shrink-0 rounded-full bg-brand-gold" aria-hidden="true" />
          <p className="truncate text-sm font-semibold text-brand-navy">
            {currentPage?.label ?? "تصفح الموقع"}
          </p>
        </div>
        <SheetTrigger
          render={
            <Button
              type="button"
              size="icon-sm"
              aria-label="فتح القائمة"
              className="rounded-xl shadow-xs"
            />
          }
        >
          <Menu className="size-5" aria-hidden="true" />
        </SheetTrigger>
      </div>

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
                قائمة التنقل
              </SheetTitle>
              <SheetDescription className="sr-only">
                تصفح صفحات الموقع.
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
                          "block rounded-lg px-4 py-3 text-start font-medium transition-colors duration-200 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none",
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
        </MaxWidth>
      </SheetContent>
    </Sheet>
  );
}
