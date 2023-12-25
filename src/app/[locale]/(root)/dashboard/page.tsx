import { OrganizationHeader } from "@/components/layout/organization-header"
import { OrganizationEmpty } from "@/components/organization-empty"
import { pick } from "@/lib/utils"
import { redirect } from "@/navigation"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

export default async function Page() {
   const user = await currentUser()

   const organizations = await db.organization.findMany({
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

   if (organizations.length > 0)
      return redirect(`/dashboard/${organizations[0]?.id}`)

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
            <OrganizationHeader organizationsCount={organizations.length} />
         </NextIntlClientProvider>
         <main className="container mt-12">
            <NextIntlClientProvider messages={pick(messages, ["sidebar"])}>
               <OrganizationEmpty className="w-fit" />
            </NextIntlClientProvider>
         </main>
      </>
   )
}
