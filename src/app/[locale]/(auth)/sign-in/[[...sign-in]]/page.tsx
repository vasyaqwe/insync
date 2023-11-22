import { type locales } from "@/navigation"
import { SignIn } from "@clerk/nextjs"
import { unstable_setRequestLocale } from "next-intl/server"

export default function Page({
   params: { locale },
}: {
   params: { locale: (typeof locales)[number] }
}) {
   unstable_setRequestLocale(locale)

   return (
      <SignIn
         appearance={{
            variables: {
               colorPrimary: "hsl(221.2 83.2% 53.3%)",
            },
         }}
      />
   )
}
