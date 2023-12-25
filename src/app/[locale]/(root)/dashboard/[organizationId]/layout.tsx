import { Sidebar } from "@/components/layout/sidebar"
import { NextIntlClientProvider } from "next-intl"
import { cn, pick } from "@/lib/utils"
import { getMessages, getTranslations } from "next-intl/server"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import { OrganizationHeader } from "@/components/layout/organization-header"
import { OrganizationMembersDialog } from "@/components/dialogs/organization-members-dialog"
import { ColorAvatar } from "@/components/ui/color-avatar"
import { CreditCard } from "lucide-react"
import { notFound } from "next/navigation"
import { type ReactNode } from "react"

export default async function RootLayout({
   children,
   params: { organizationId },
}: {
   children: ReactNode
   params: { organizationId: string }
}) {
   const messages = (await getMessages()) as Messages
   const user = await currentUser()
   const tCommon = await getTranslations("common")

   const organizations = await db.organization.findMany({
      where: {
         members: {
            some: {
               id: user?.id,
            },
         },
      },
   })

   const organization = await db.organization.findFirst({
      where: {
         id: organizationId,
      },
      select: {
         id: true,
         name: true,
         members: true,
         ownerId: true,
         color: true,
      },
   })

   if (!organization || !organization.members.some((m) => m.id === user?.id))
      notFound()

   return (
      <>
         <NextIntlClientProvider
            messages={pick(messages, [
               "account-menu",
               "create-organization",
               "invite-command",
               "common",
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
            <div>
               <NextIntlClientProvider
                  messages={pick(messages, ["members", "invite-command"])}
               >
                  <div className="flex items-center justify-between border-b-2 border-dotted pb-4">
                     <div className="flex items-center gap-3">
                        <ColorAvatar
                           className="[--color-avatar-size:45px] lg:[--color-avatar-size:55px]"
                           color={organization.color}
                        />
                        <div>
                           <h1 className="text-xl font-medium lg:text-2xl">
                              {organization.name}
                           </h1>
                           <p className="mt-0.5 rounded-[.4rem] border border-primary/70 bg-primary/10 px-1 text-xs leading-5 text-primary shadow-sm lg:mt-1 lg:rounded-sm lg:px-1.5 lg:py-0.5 lg:text-sm">
                              <CreditCard
                                 className="mb-[1px] mr-1.5 inline align-bottom"
                                 size={18}
                              />
                              {tCommon("free-plan")}
                           </p>
                        </div>
                     </div>
                     <OrganizationMembersDialog
                        members={organization.members}
                        organization={organization}
                     />
                  </div>
               </NextIntlClientProvider>
               {children}
            </div>
         </main>
      </>
   )
}
