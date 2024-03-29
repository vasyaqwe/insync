import { Sidebar } from "@/components/layout/sidebar"
import { NextIntlClientProvider } from "next-intl"
import { convertClerkUserToDbUser, pick } from "@/lib/utils"
import { getMessages } from "next-intl/server"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import { BoardHeader } from "@/components/layout/board-header"
import { type ReactNode } from "react"
import { type User } from "@clerk/nextjs/server"

export default async function RootLayout({
   children,
}: {
   children: ReactNode
}) {
   const messages = (await getMessages()) as Messages
   // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
   const user = (await currentUser()) as User

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
               "user-settings",
               "invite-command",
               "common",
            ])}
         >
            <BoardHeader user={convertClerkUserToDbUser(user)} />
         </NextIntlClientProvider>
         <main className="h-[calc(100svh-var(--header-height))]">
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
