import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
   `inline-flex items-center relative before:shadow-[0_0_0_1px] justify-center whitespace-nowrap gap-2 rounded-[.65rem] before:rounded-[.7rem]
    text-sm font-medium before:z-[-1] before:bg-gradient-to-b before:from-background/20 before:inset-0 before:absolute isolate ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-ring focus-visible:ring-offset-2 ml-[1px] disabled:pointer-events-none disabled:opacity-60 active:pt-[9px] active:pb-[7px]`,
   {
      variants: {
         variant: {
            default: `bg-primary text-primary-foreground shadow-button-primary active:shadow-inner-primary py-[8px] 
                active:text-primary-foreground/95 before:to-background/10 hover:bg-primary/90 before:shadow-primary`,
            destructive: `bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-button-primary 
                active:text-destructive-foreground/95 active:shadow-inner-primary before:to-background/20 before:shadow-destructive`,
            outline: `shadow-button-secondary bg-background hover:bg-accent/50 hover:text-accent-foreground 
                active:text-accent-foreground/90 active:shadow-inner-secondary 
                before:to-border/25 before:shadow-border`,
            secondary: `bg-secondary text-secondary-foreground hover:bg-accent shadow-button-secondary
                active:shadow-inner-secondary before:to-border/50 before:shadow-border`,
            ghost: "hover:bg-accent hover:text-accent-foreground before:hidden active:py-2",
            link: "text-primary underline-offset-4 hover:underline before:hidden",
         },
         size: {
            default: "h-[38px] px-4 py-2",
            sm: "h-9 rounded-[.55rem] before:rounded-[.6rem] px-3",
            lg: "h-11 rounded-md px-8 text-base",
            icon: "h-9 w-9 rounded-[.5rem] before:rounded-[.6rem] ",
         },
      },
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   }
)

export interface ButtonProps
   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariants> {
   asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
   ({ className, variant, size, asChild = false, ...props }, ref) => {
      const Comp = asChild ? Slot : "button"
      return (
         <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
         />
      )
   }
)
Button.displayName = "Button"

export { Button, buttonVariants }
