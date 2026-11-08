"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { ProjectGalleryImage } from "@/lib/project-detail";
import { cn } from "cn";

export function ProjectGallery({
  projectTitle,
  images,
}: {
  projectTitle: string;
  images: ProjectGalleryImage[];
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [api, setApi] = useState<CarouselApi>(undefined);

  useEffect(() => {
    if (!api) return;

    const sync = () => setActive(api.selectedScrollSnap());
    api.on("select", sync);
    api.on("reInit", sync);

    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  const current = images[active] ?? images[0];

  const handleKeyDownCapture = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      api?.scrollNext();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      api?.scrollPrev();
    }
  };

  return (
    <section
      aria-labelledby="project-gallery-title"
      className="border-t border-border bg-background py-14"
    >
      <MaxWidth className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-130 flex-col gap-2">
            <p className="flex items-center gap-2 text-xs font-medium uppercase leading-[18px] text-muted-foreground">
              معرض التوثيق الميداني
              <span
                aria-hidden="true"
                className="h-4 w-1.5 rounded-full bg-brand-gold"
              />
            </p>
            <h2
              id="project-gallery-title"
              className="text-2xl font-semibold leading-[48px] text-brand-navy sm:text-[32px]"
            >
              سجل صور تنفيذ وتأهيل المشروع
            </h2>
          </div>
          <p className="max-w-115 text-sm leading-[24.5px] text-muted-foreground">
            انقر فوق أي صورة لاستعراض التفاصيل الهندسية بالحجم الكامل وفحص دقة
            تنفيذ الطبقات الفنية.
          </p>
        </div>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {images.map((image, index) => (
              <li key={image.id}>
                <Dialog.Trigger
                  onClick={() => setActive(index)}
                  aria-label={`عرض الصورة ${index + 1} من ${images.length}: ${image.alt}`}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-start shadow-sm transition-colors hover:border-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="relative block h-[212px] w-full overflow-hidden bg-muted">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <span className="absolute start-2.5 top-2.5 rounded-[4px] bg-brand-navy/80 px-2 py-0.5 text-xs font-medium leading-[18px] text-primary-foreground">
                      صورة {index + 1} من {images.length}
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center bg-brand-blue/20 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand-blue text-primary-foreground shadow-md">
                        <Maximize2 aria-hidden="true" className="size-4" />
                      </span>
                    </span>
                  </span>
                  <span className="flex flex-1 flex-col gap-1 p-4">
                    <span className="line-clamp-2 text-base font-semibold leading-6 text-brand-navy">
                      {image.alt}
                    </span>
                    <span className="text-xs leading-[18px] text-muted-foreground">
                      عرض بالحجم الكامل
                    </span>
                  </span>
                </Dialog.Trigger>
              </li>
            ))}
          </ul>

          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-brand-navy/70 backdrop-blur-sm transition-opacity duration-150 data-ending-style:opacity-0" />
            <Dialog.Popup
              onKeyDownCapture={handleKeyDownCapture}
              className="fixed inset-x-2 inset-y-2 z-50 mx-auto flex max-w-6xl flex-col overflow-hidden rounded-2xl bg-card text-card-foreground shadow-2xl ring-1 ring-border/70 transition duration-150 data-starting-style:opacity-0 sm:inset-x-4 sm:inset-y-4 lg:inset-x-8 lg:inset-y-6"
            >
              <div className="flex h-16 shrink-0 items-center justify-between gap-4 bg-brand-navy px-4 sm:px-6">
                <div className="flex min-w-0 flex-col">
                  <Dialog.Title className="truncate text-sm font-semibold leading-6 text-primary-foreground sm:text-base">
                    {current?.alt ?? projectTitle}
                  </Dialog.Title>
                  <Dialog.Description className="truncate text-xs font-medium leading-[18px] text-focus-on-dark">
                    صورة {active + 1} من {images.length} • {projectTitle}
                  </Dialog.Description>
                </div>

                <Dialog.Close
                  aria-label="إغلاق عارض الصور"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark"
                >
                  <X aria-hidden="true" className="size-5" />
                </Dialog.Close>
              </div>

              <div className="relative min-h-0 flex-1 bg-brand-navy">
                <Carousel
                  setApi={setApi}
                  opts={{ direction: "rtl", startIndex: active }}
                  className="size-full [&_[data-slot=carousel-content]]:h-full"
                >
                  <CarouselContent className="ms-0 h-full">
                    {images.map((image) => (
                      <CarouselItem
                        key={image.id}
                        className="relative h-full ps-0"
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="100vw"
                          className="object-contain"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => api?.scrollPrev()}
                      aria-label="الصورة السابقة"
                      className="absolute start-4 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand-navy/70 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark"
                    >
                      <ChevronRight aria-hidden="true" className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => api?.scrollNext()}
                      aria-label="الصورة التالية"
                      className="absolute end-4 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand-navy/70 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark"
                    >
                      <ChevronLeft aria-hidden="true" className="size-5" />
                    </button>
                  </>
                ) : null}
              </div>

              <div className="flex shrink-0 flex-col gap-4 border-t border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-6 text-brand-navy">
                    {current?.alt}
                  </p>
                  <p className="text-xs leading-[18px] text-muted-foreground">
                    انقر على صورة مصغرة للتنقل بين صور المشروع.
                  </p>
                </div>

                <ul className="flex list-none gap-2 overflow-x-auto p-0">
                  {images.map((image, index) => (
                    <li key={image.id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => api?.scrollTo(index)}
                        aria-label={`عرض الصورة ${index + 1}`}
                        aria-current={index === active ? "true" : undefined}
                        className={cn(
                          "relative block h-12 w-16 overflow-hidden rounded-md border bg-muted transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          index === active
                            ? "border-2 border-brand-blue opacity-100"
                            : "border-border opacity-60 hover:opacity-100",
                        )}
                      >
                        <Image
                          src={image.src}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </MaxWidth>
    </section>
  );
}
