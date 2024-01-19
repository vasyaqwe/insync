"use client"

import { useIsClient } from "@/hooks/use-is-client"
import { useTheme } from "next-themes"
import { Slot } from "@radix-ui/react-slot"
import { type ReactNode, type ComponentProps } from "react"
import { type SignIn as SignInType, SignIn as ClerkSignIn } from "@clerk/nextjs"
import { SignUp as ClerkSignUp } from "@clerk/nextjs"
import { primaryColor } from "@/config"
import { inputVariants } from "@/components/ui/input"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ClerkProvider as Clerk_ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { type Locale } from "@/navigation"
import { enUS, ukUA } from "@clerk/localizations"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"

type ClerkWrapperProps = ComponentProps<typeof SignInType> & {
   children: ReactNode
}

function ClerkWrapper({ ...props }: ClerkWrapperProps) {
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
      baseTheme: resolvedTheme === "dark" ? dark : undefined,
   }

   //hoping all clerk components can accept appearence prop..
   const Comp = Slot as typeof SignInType

   return (
      <Comp
         {...props}
         appearance={appearance}
      />
   )
}

function SignIn({ locale }: { locale: Locale }) {
   const { lastVisitedOrganizationId } = useOrganizationHelpersStore()
   return (
      <ClerkWrapper>
         <ClerkSignIn
            afterSignInUrl={`/${locale}/dashboard/${lastVisitedOrganizationId}`}
            afterSignUpUrl={`/${locale}/dashboard`}
            signUpUrl={`/${locale}/sign-up`}
         />
      </ClerkWrapper>
   )
}
function SignUp({ locale }: { locale: Locale }) {
   const { lastVisitedOrganizationId } = useOrganizationHelpersStore()
   return (
      <ClerkWrapper>
         <ClerkSignUp
            afterSignInUrl={`/${locale}/dashboard/${lastVisitedOrganizationId}`}
            afterSignUpUrl={`/${locale}/dashboard`}
            signInUrl={`/${locale}/sign-in`}
         />
      </ClerkWrapper>
   )
}

function ClerkProvider({
   children,
   locale,
}: {
   children: ReactNode
   locale: Locale
}) {
   return (
      <Clerk_ClerkProvider localization={locale === "uk" ? ukUA : enUS}>
         {children}
      </Clerk_ClerkProvider>
   )
}

export { ClerkWrapper, ClerkProvider, SignIn, SignUp }
