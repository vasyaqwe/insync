import { clerkAppearence } from "@/config"
import { type locales } from "@/navigation"
import { SignUp } from "@clerk/nextjs"
import { unstable_setRequestLocale } from "next-intl/server"

export default function Page({
   params: { locale },
}: {
   params: { locale: (typeof locales)[number] }
}) {
   unstable_setRequestLocale(locale)

   return (
      <SignUp
         afterSignInUrl={`/${locale}/dashboard`}
         afterSignUpUrl={`/${locale}/dashboard`}
         signInUrl={`/${locale}/sign-in`}
         appearance={clerkAppearence}
      />
   )
}
