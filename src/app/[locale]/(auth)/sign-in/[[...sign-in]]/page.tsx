import { type Locale } from "@/navigation"
import { SignIn } from "@clerk/nextjs"
import { unstable_setRequestLocale } from "next-intl/server"
import { metadataConfig } from "@/config"
import { ClerkWrapper } from "@/components/clerk-helpers"

export const metadata = { ...metadataConfig, title: "insync. | Sign in" }

export default function Page({
   params: { locale },
}: {
   params: { locale: Locale }
}) {
   // Enable static rendering
   unstable_setRequestLocale(locale)

   return (
      <ClerkWrapper>
         <SignIn
            afterSignInUrl={`/${locale}/dashboard`}
            afterSignUpUrl={`/${locale}/dashboard`}
            signUpUrl={`/${locale}/sign-up`}
         />
      </ClerkWrapper>
   )
}
