import { OrganizationMembers } from "@/components/organization-members"
import { pick } from "@/lib/utils"
import { db } from "@/server/db"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"

export default async function Page({
   params: { organizationId },
}: {
   params: { organizationId: string }
}) {
   const organization = await db.organization.findFirst({
      where: {
         id: organizationId,
      },
      select: {
         id: true,
         name: true,
         members: true,
         ownerId: true,
      },
   })

   if (!organization) notFound()

   const messages = (await getMessages()) as Messages

   return (
      <div>
         <NextIntlClientProvider
            messages={pick(messages, ["members", "invite-command"])}
         >
            <OrganizationMembers
               members={organization.members}
               organization={organization}
            />
         </NextIntlClientProvider>
      </div>
   )
}