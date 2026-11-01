import { cn } from "cn";
import type { ComponentProps } from "react";

function MaxWidth({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-336 px-5 sm:px-8 lg:px-12",
        className,
      )}
      {...props}
    />
  );
}

export { MaxWidth };
