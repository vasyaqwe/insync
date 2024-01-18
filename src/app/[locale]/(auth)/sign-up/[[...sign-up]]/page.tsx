import { type Locale } from "@/navigation"
import { unstable_setRequestLocale } from "next-intl/server"
import { metadataConfig } from "@/config"
import { SignUp } from "@/components/clerk-helpers"

export const metadata = { ...metadataConfig, title: "insync. | Sign up" }

export default function Page({
   params: { locale },
}: {
   params: { locale: Locale }
}) {
   // Enable static rendering
   unstable_setRequestLocale(locale)

   return <SignUp locale={locale} />
}
