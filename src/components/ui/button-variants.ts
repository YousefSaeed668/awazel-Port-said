import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-center text-sm font-medium leading-normal whitespace-normal outline-none select-none transition-[color,background-color,border-color,box-shadow] duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent aria-expanded:bg-accent",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
        link: "text-link underline-offset-4 hover:underline focus-visible:underline",
        inverse:
          "bg-white text-brand-navy hover:bg-surface-blue focus-visible:ring-focus-on-dark focus-visible:ring-offset-brand-navy",
        whatsapp:
          "bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 focus-visible:ring-focus-on-dark focus-visible:ring-offset-brand-navy",
      },
      size: {
        default:
          "min-h-12 gap-2 px-5 py-3 has-data-[icon=inline-end]:pe-4 has-data-[icon=inline-start]:ps-4",
        xs: "min-h-8 gap-1.5 px-2.5 py-1 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "min-h-10 gap-2 px-4 py-2",
        lg: "min-h-14 gap-2.5 px-6 py-3.5 text-base",
        icon: "size-12 p-0",
        "icon-xs": "size-8 p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-11 p-0",
        "icon-lg": "size-14 p-0 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export { buttonVariants };
