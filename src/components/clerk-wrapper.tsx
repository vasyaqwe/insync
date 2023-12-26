"use client"

import { useIsClient } from "@/hooks/use-is-client"
import { useTheme } from "next-themes"
import { Slot } from "@radix-ui/react-slot"
import { type ReactNode, type ComponentProps } from "react"
import { type SignIn } from "@clerk/nextjs"
import { primaryColor } from "@/config"
import { inputVariants } from "@/components/ui/input"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { dark } from "@clerk/themes"

type ClerkWrapperProps = ComponentProps<typeof SignIn> & { children: ReactNode }

export function ClerkWrapper({ ...props }: ClerkWrapperProps) {
   const { resolvedTheme } = useTheme()
   const { isClient } = useIsClient()

   if (!isClient) return null

   const colorPrimary =
      resolvedTheme === "light" ? primaryColor : "hsl(0 0% 98%)"

   const appearance = {
      //in dark theme primary color is white
      variables: {
         colorPrimary,
         colorTextOnPrimaryBackground:
            resolvedTheme === "light" ? "white" : "black",
      },
      elements: {
         card: {
            border: "1px solid hsl(var(--border))",
         },
         formFieldInput: cn(inputVariants(), "!transition-none"),
         formButtonPrimary: cn(
            buttonVariants({ variant: "default" }),
            "text-xs focus:shadow-none"
         ),
      },
      baseTheme: resolvedTheme === "light" ? undefined : dark,
   }

   //hoping all clerk components can accept appearence prop..
   const Comp = Slot as typeof SignIn

   return (
      <Comp
         {...props}
         appearance={appearance}
      />
   )
}
