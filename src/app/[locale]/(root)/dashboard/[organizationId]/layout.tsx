import { Sidebar } from "@/components/layout/sidebar"
import { NextIntlClientProvider } from "next-intl"
import { cn, pick } from "@/lib/utils"
import { getMessages } from "next-intl/server"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import { OrganizationHeader } from "@/components/layout/organization-header"

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
            messages={pick(messages, [
               "account-menu",
               "create-organization",
               "invite-command",
            ])}
         >
            <OrganizationHeader />
         </NextIntlClientProvider>
         <main
            className={cn(
               "container py-6 lg:py-14",
               organizations.length > 0
                  ? "gap-10 lg:grid lg:grid-cols-[320px,1fr]"
                  : ""
            )}
         >
            <NextIntlClientProvider
               messages={pick(messages, [
                  "sidebar",
                  "invite-command",
                  "common",
               ])}
            >
               <Sidebar organizations={organizations} />
            </NextIntlClientProvider>
            {children}
         </main>
      </>
   )
}
