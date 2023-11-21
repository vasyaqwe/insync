import { cookies } from "next/headers"
import { Toaster } from "sonner"

import { TRPCReactProvider } from "@/trpc/react"
import { Sidebar } from "@/components/layout/sidebar"
import { NextIntlClientProvider } from "next-intl"
import { pick } from "@/lib/utils"
import { getMessages } from "next-intl/server"

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   const messages = (await getMessages()) as Messages

   return (
      <TRPCReactProvider cookies={cookies().toString()}>
         <div className="container py-16">
            <NextIntlClientProvider
               messages={pick(messages, [
                  "sidebar",
                  "create-community",
                  "error-messages",
               ])}
            >
               <Sidebar />
            </NextIntlClientProvider>
            {children}
         </div>
         <Toaster
            richColors
            style={{ font: "inherit" }}
         />
      </TRPCReactProvider>
   )
}
