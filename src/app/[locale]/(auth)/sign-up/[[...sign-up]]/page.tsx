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
         signInUrl={`/${locale}/sign-in`}
         appearance={{
            variables: {
               colorPrimary: "hsl(221.2 83.2% 53.3%)",
            },
         }}
      />
   )
}
