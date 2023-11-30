import "@/styles/globals.css"

import { ClerkProvider } from "@clerk/nextjs"
import { GeistSans } from "geist/font/sans"

import { Header } from "@/components/layout/header"
import { getMessages, unstable_setRequestLocale } from "next-intl/server"
import { locales } from "@/navigation"
import { metadataConfig } from "@/config"
import { NextIntlClientProvider } from "next-intl"
import { cn, pick } from "@/lib/utils"
import { Inter } from "next/font/google"
import { TRPCReactProvider } from "@/trpc/react"
import { cookies } from "next/headers"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

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
            <TRPCReactProvider cookies={cookies().toString()}>
               <ClerkProvider>
                  <NextIntlClientProvider
                     messages={pick(messages, ["account-menu", "header"])}
                  >
                     <Header />
                  </NextIntlClientProvider>
                  <main>
                     {children}
                     <Toaster
                        richColors
                        position="top-center"
                        style={{ font: "inherit" }}
                     />
                  </main>
               </ClerkProvider>
            </TRPCReactProvider>
         </body>
      </html>
   )
}
