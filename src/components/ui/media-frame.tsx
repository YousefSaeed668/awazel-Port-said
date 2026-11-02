import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "cn";

interface MediaFrameImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

interface MediaFrameProps {
  image: MediaFrameImage;
  sizes: string;
  preload?: boolean;
  className?: string;
  mediaClassName?: string;
  overlay?: ReactNode;
  overlayClassName?: string;
}

export function MediaFrame({
  image,
  sizes,
  preload,
  className,
  mediaClassName,
  overlay,
  overlayClassName,
}: MediaFrameProps) {
  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden rounded-xl",
        className,
      )}
    >
      <div className={cn("relative aspect-4/3", mediaClassName)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
          style={
            image.objectPosition
              ? { objectPosition: image.objectPosition }
              : undefined
          }
        />
      </div>

      {overlay ? (
        <div className={cn("absolute", overlayClassName)}>{overlay}</div>
      ) : null}
    </div>
  );
}
