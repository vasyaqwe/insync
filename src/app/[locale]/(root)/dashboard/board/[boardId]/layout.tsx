import { Sidebar } from "@/components/layout/sidebar"
import { NextIntlClientProvider } from "next-intl"
import { pick } from "@/lib/utils"
import { getMessages } from "next-intl/server"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import { BoardHeader } from "@/components/layout/board-header"
import { type ReactNode } from "react"

export default async function RootLayout({
   children,
}: {
   children: ReactNode
}) {
   const messages = (await getMessages()) as Messages
   const user = await currentUser()

   const organizations = await db.organization.findMany({
      where: {
         members: {
            some: {
               id: user?.id,
            },
         },
      },
   })

   return (
      <>
         <NextIntlClientProvider
            messages={pick(messages, [
               "header",
               "account-menu",
               "create-organization",
               "invite-command",
               "common",
            ])}
         >
            <BoardHeader />
         </NextIntlClientProvider>
         <main className="h-[calc(100%-var(--header-height))]">
            <NextIntlClientProvider
               messages={pick(messages, [
                  "sidebar",
                  "invite-command",
                  "common",
               ])}
            >
               <Sidebar
                  className="lg:hidden"
                  organizations={organizations}
               />
            </NextIntlClientProvider>
            {children}
         </main>
      </>
   )
}
