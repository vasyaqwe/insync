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
import { enUS, ukUA } from "@clerk/localizations"
import { ClerkProvider } from "@clerk/nextjs"
import { type Viewport } from "next"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "@/app/api/uploadthing/core"

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
            <TRPCReactProvider cookies={cookies().toString()}>
               <ClerkProvider localization={locale === "uk" ? ukUA : enUS}>
                  <ThemeProvider
                     attribute="class"
                     defaultTheme="system"
                     enableSystem
                     disableTransitionOnChange
                  >
                     <NextIntlClientProvider
                        messages={pick(messages, ["common"])}
                     >
                        <NextSSRPlugin
                           routerConfig={extractRouterConfig(ourFileRouter)}
                        />
                        {children}
                     </NextIntlClientProvider>
                     <Toaster />
                  </ThemeProvider>
               </ClerkProvider>
            </TRPCReactProvider>
         </body>
      </html>
   )
}
