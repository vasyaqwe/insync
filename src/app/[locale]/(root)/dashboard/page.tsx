import { OrganizationHeader } from "@/components/layout/organization-header"
import { OrganizationEmpty } from "@/components/organization-empty"
import { convertClerkUserToDbUser, pick } from "@/lib/utils"
import { redirect } from "@/navigation"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import { type User } from "@clerk/nextjs/server"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

export default async function Page() {
   // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
   const user = (await currentUser()) as User

   const organization = await db.organization.findFirst({
      where: {
         members: {
            some: {
               id: user?.id,
            },
         },
      },
      select: {
         id: true,
      },
   })

   if (organization) return redirect(`/dashboard/${organization.id}`)

   const messages = (await getMessages()) as Messages

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
            <OrganizationHeader user={convertClerkUserToDbUser(user)} />
         </NextIntlClientProvider>
         <main className="container mt-12">
            <NextIntlClientProvider messages={pick(messages, ["sidebar"])}>
               <OrganizationEmpty className="w-fit" />
            </NextIntlClientProvider>
         </main>
      </>
   )
}
