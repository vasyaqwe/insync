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
      <div className="grid h-screen place-content-center">
         <SignIn />
      </div>
   )
}
