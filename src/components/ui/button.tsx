import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { buttonVariants } from "./button-variants";

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={
        typeof className === "function"
          ? (state) => cn(buttonVariants({ variant, size }), className(state))
          : cn(buttonVariants({ variant, size }), className)
      }
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
