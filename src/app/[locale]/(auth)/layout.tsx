import { Header } from "@/components/layout/header"
import { getMessages, unstable_setRequestLocale } from "next-intl/server"
import { NextIntlClientProvider } from "next-intl"
import { pick } from "@/lib/utils"
import { Footer } from "@/components/layout/footer"
import { type Locale } from "@/navigation"
import { type ReactNode } from "react"

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
         <main className="grid h-[calc(100svh-var(--header-height))] place-content-center">
            {children}
         </main>
         <Footer />
      </>
   )
}
