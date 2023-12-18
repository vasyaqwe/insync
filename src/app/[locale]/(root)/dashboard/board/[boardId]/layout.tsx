import { Sidebar } from "@/components/layout/sidebar"
import { NextIntlClientProvider } from "next-intl"
import { pick } from "@/lib/utils"
import { getMessages } from "next-intl/server"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import { BoardHeader } from "@/components/layout/board-header"

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
               id: user?.id,
            },
         },
      },
   })

   return (
      <>
         <NextIntlClientProvider
            messages={pick(messages, ["header", "account-menu"])}
         >
            <BoardHeader />
         </NextIntlClientProvider>
         <main>
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