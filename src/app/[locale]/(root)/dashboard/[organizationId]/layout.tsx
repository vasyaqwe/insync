import { Sidebar } from "@/components/layout/sidebar"
import { NextIntlClientProvider } from "next-intl"
import { cn, pick } from "@/lib/utils"
import { getMessages } from "next-intl/server"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import { CreateOrganizationDialog } from "@/components/dialogs/create-organization-dialog"

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
      <div
         className={cn(
            "container py-8 lg:py-16",
            organizations.length > 0
               ? "gap-10 lg:grid lg:grid-cols-[320px,1fr]"
               : ""
         )}
      >
         <NextIntlClientProvider
            messages={pick(messages, [
               "sidebar",
               "create-organization",
               "invite-command",
            ])}
         >
            <CreateOrganizationDialog />
            <Sidebar organizations={organizations} />
         </NextIntlClientProvider>
         {children}
      </div>
   )
}
