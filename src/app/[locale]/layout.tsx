import "@/styles/globals.css"

import { GeistSans } from "geist/font/sans"

import { getMessages, unstable_setRequestLocale } from "next-intl/server"
import { type Locale, locales } from "@/navigation"
import { metadataConfig } from "@/config"
import { cn, pick } from "@/lib/utils"
import { Inter } from "next/font/google"
import { TRPCReactProvider } from "@/trpc/react"
import { cookies } from "next/headers"
import { NextIntlClientProvider } from "next-intl"
import { ThemeProvider } from "@/components/theme-provider"
import { type ReactNode } from "react"
import { Toaster } from "@/components/ui/toaster"
import { type Viewport } from "next"
import { ClerkProvider } from "@/components/clerk-helpers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter-latin" })

export const metadata = metadataConfig

export const viewport: Viewport = {
   initialScale: 1,
   maximumScale: 1,
}

export function generateStaticParams() {
   return locales.map((locale) => ({ locale }))
}

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
      <ClerkProvider locale={locale}>
         <html
            suppressHydrationWarning
            lang={locale}
            className={cn(
               locale === "uk" ? "font-primary-uk" : "font-primary-en",
               GeistSans.variable,
               inter.variable
            )}
         >
            <body
               className={`grainy-bg flex flex-col bg-background text-foreground`}
            >
               <NextIntlClientProvider messages={pick(messages, ["common"])}>
                  <ThemeProvider
                     attribute="class"
                     defaultTheme="system"
                     enableSystem
                     disableTransitionOnChange
                  >
                     <TRPCReactProvider cookies={cookies().toString()}>
                        {children}
                        <Toaster />
                     </TRPCReactProvider>
                  </ThemeProvider>
               </NextIntlClientProvider>
            </body>
         </html>
      </ClerkProvider>
   )
}
