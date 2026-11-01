import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";

import type { HeaderViewModel } from "@/lib/site-view-models";

import { HeaderNavigation } from "./HeaderNavigation";
import { MaxWidth } from "./MaxWidth";
import { MobileNavigation } from "./MobileNavigation";
import { buttonVariants } from "./ui/button-variants";

type HeaderProps = HeaderViewModel;

function Header({
  companyName,
  logo,
  navigation,
  primaryAction,
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-white text-foreground">
      <MaxWidth className="flex min-h-24 items-center justify-between gap-4 py-3">
        <Link
          href="/"
          aria-label={companyName}
          className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            sizes="(min-width: 640px) 144px, 112px"
            className="h-auto w-28 sm:w-36"
          />
        </Link>

        <HeaderNavigation items={navigation} ariaLabel="التنقل الرئيسي" />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              target={primaryAction.openInNewTab ? "_blank" : undefined}
              rel={
                primaryAction.openInNewTab ? "noopener noreferrer" : undefined
              }
              className={cn(
                buttonVariants(),
                "hidden whitespace-nowrap sm:inline-flex",
              )}
            >
              {primaryAction.label}
            </Link>
          )}
          <MobileNavigation
            companyName={companyName}
            navigation={navigation}
            primaryAction={primaryAction}
          />
        </div>
      </MaxWidth>
    </header>
  );
}

export { Header };
