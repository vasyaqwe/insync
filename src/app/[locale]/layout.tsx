import "@/styles/globals.css"

import { ClerkProvider } from "@clerk/nextjs"
import { GeistSans } from "geist/font/sans"

import { unstable_setRequestLocale } from "next-intl/server"
import { locales } from "@/navigation"
import { metadataConfig } from "@/config"
import { cn } from "@/lib/utils"
import { Inter } from "next/font/google"
import { TRPCReactProvider } from "@/trpc/react"
import { cookies } from "next/headers"
import { Toaster } from "sonner"
import { enUS, ukUA } from "@clerk/localizations"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter-latin" })

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
   // Enable static rendering
   unstable_setRequestLocale(locale)

   return (
      <html
         lang={locale}
         className={cn(
            locale === "uk" ? "font-primary-uk" : "font-primary-en",
            GeistSans.variable,
            inter.variable
         )}
      >
         <body className={`grainy-bg flex flex-col`}>
            <TRPCReactProvider cookies={cookies().toString()}>
               <ClerkProvider localization={locale === "uk" ? ukUA : enUS}>
                  {children}
                  <Toaster
                     richColors
                     position="top-center"
                     style={{ font: "inherit" }}
                  />
               </ClerkProvider>
            </TRPCReactProvider>
         </body>
      </html>
   )
}
