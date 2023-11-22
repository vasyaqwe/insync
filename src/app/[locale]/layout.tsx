import "@/styles/globals.css"

import { ClerkProvider, currentUser } from "@clerk/nextjs"
import { GeistSans } from "geist/font/sans"
import { headers } from "next/headers"

import { Header } from "@/components/layout/header"
import { getMessages, unstable_setRequestLocale } from "next-intl/server"
import { defaultLocale, locales } from "@/navigation"
import { redirect } from "next/navigation"
import { metadataConfig } from "@/config"
import { NextIntlClientProvider } from "next-intl"
import { cn, pick } from "@/lib/utils"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata = metadataConfig

export function generateStaticParams() {
   return locales.map((locale) => ({ locale }))
}

export const dynamic = "force-dynami"

export default async function RootLayout({
   children,
   params: { locale },
}: {
   children: React.ReactNode
   params: { locale: (typeof locales)[number] }
}) {
   const isValidLocale = locales.some((cur) => cur === locale)

   if (!isValidLocale) {
      const headersList = headers()
      const language = headersList.get("Accept-Language")?.slice(0, 2)

      const prevUrl = locale
      //if locale is invalid, it becomes the url

      if (locales.some((l) => l === language)) {
         return redirect(`/${language}/${prevUrl}`)
      }

      return redirect(`/${defaultLocale}/${prevUrl}`)
   }

   const user = await currentUser()
   const messages = (await getMessages()) as Messages

   // Enable static rendering
   unstable_setRequestLocale(locale)

   return (
      <html lang={locale}>
         <body
            className={cn(
               `grainy-bg`,
               locale === "uk" ? "font-primary-uk" : "font-primary-en",
               GeistSans.variable,
               inter.variable
            )}
         >
            <ClerkProvider>
               <NextIntlClientProvider
                  messages={pick(messages, ["account-menu", "header"])}
               >
                  <Header user={structuredClone(user)} />
               </NextIntlClientProvider>
               <main>{children}</main>
            </ClerkProvider>
         </body>
      </html>
   )
}
