import { Toaster } from "sonner"

import { Sidebar } from "@/components/layout/sidebar"
import { NextIntlClientProvider } from "next-intl"
import { pick } from "@/lib/utils"
import { getMessages } from "next-intl/server"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   const messages = (await getMessages()) as Messages
   const user = await currentUser()

   const organizations = await db.organization.findMany({
      where: {
         members: {
            some: {
               externalId: user?.id,
            },
         },
      },
   })

   return (
      <>
         <div className="container grid grid-cols-[320px,1fr] gap-10 py-16">
            <NextIntlClientProvider
               messages={pick(messages, [
                  "sidebar",
                  "create-community",
                  "error-messages",
               ])}
            >
               <Sidebar organizations={organizations} />
            </NextIntlClientProvider>
            {children}
         </div>
         <Toaster
            richColors
            style={{ font: "inherit" }}
         />
      </>
   )
}
