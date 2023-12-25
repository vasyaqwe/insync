import { type Locale } from "@/navigation"
import { SignUp } from "@clerk/nextjs"
import { unstable_setRequestLocale } from "next-intl/server"
import { metadataConfig } from "@/config"
import { ClerkWrapper } from "@/components/clerk-wrapper"

export const metadata = { ...metadataConfig, title: "insync. | Sign up" }

export default function Page({
   params: { locale },
}: {
   params: { locale: Locale }
}) {
   // Enable static rendering
   unstable_setRequestLocale(locale)

   return (
      <ClerkWrapper>
         <SignUp
            afterSignInUrl={`/${locale}/dashboard`}
            afterSignUpUrl={`/${locale}/dashboard`}
            signInUrl={`/${locale}/sign-in`}
         />
      </ClerkWrapper>
   )
}
