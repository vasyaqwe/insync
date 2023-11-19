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
import { pick } from "@/lib/utils"

export const metadata = metadataConfig

export function generateStaticParams() {
   return locales.map((locale) => ({ locale }))
}

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
         <body className={`grainy-bg font-primary ${GeistSans.variable}`}>
            <ClerkProvider
               afterSignInUrl={`/${locale}/dashboard`}
               afterSignUpUrl={`/${locale}/dashboard`}
               signUpUrl={`${locale}/sign-up`}
               signInUrl={`${locale}/sign-in`}
            >
               <NextIntlClientProvider
                  messages={pick(messages, ["account-menu", "header"])}
               >
                  <Header user={JSON.parse(JSON.stringify(user))} />
               </NextIntlClientProvider>
               <main>{children}</main>
            </ClerkProvider>
         </body>
      </html>
   )
}
