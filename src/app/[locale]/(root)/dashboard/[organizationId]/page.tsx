import { Members } from "@/components/members"
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
      },
   })

   if (!organization) notFound()

   const messages = (await getMessages()) as Messages

   return (
      <div>
         <NextIntlClientProvider messages={pick(messages, ["members"])}>
            <Members
               members={organization.members}
               name={organization.name}
            />
         </NextIntlClientProvider>
      </div>
   )
}
