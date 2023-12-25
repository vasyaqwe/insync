import { Header } from "@/components/layout/header"
import { getMessages, unstable_setRequestLocale } from "next-intl/server"
import { type Locale } from "@/navigation"
import { metadataConfig } from "@/config"
import { NextIntlClientProvider } from "next-intl"
import { pick } from "@/lib/utils"
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

   const messages = (await getMessages()) as Messages

   return (
      <>
         <NextIntlClientProvider messages={pick(messages, ["header"])}>
            <Header />
         </NextIntlClientProvider>
         <main>{children}</main>
         <Footer />
      </>
   )
}
