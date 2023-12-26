import { unstable_setRequestLocale } from "next-intl/server"
import { type Locale } from "@/navigation"
import { metadataConfig } from "@/config"
import { Footer } from "@/components/layout/footer"
import { type ReactNode } from "react"

export const metadata = metadataConfig

export default async function RootLayout({
   children,
   params: { locale },
}: {
   children: ReactNode
   params: { locale: Locale }
}) {
   // Enable static rendering
   unstable_setRequestLocale(locale)

   return (
      <>
         <main>{children}</main>
         <Footer />
      </>
   )
}
