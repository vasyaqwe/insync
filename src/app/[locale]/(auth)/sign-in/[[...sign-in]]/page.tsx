import { type Locale } from "@/navigation"
import { unstable_setRequestLocale } from "next-intl/server"
import { metadataConfig } from "@/config"
import { SignIn } from "@/components/clerk-helpers"

export const metadata = { ...metadataConfig, title: "insync. | Sign in" }

export default function Page({
   params: { locale },
}: {
   params: { locale: Locale }
}) {
   // Enable static rendering
   unstable_setRequestLocale(locale)

   return <SignIn locale={locale} />
}
