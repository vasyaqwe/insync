import { Card } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { getMessages, getTranslations } from "next-intl/server"

import { db } from "@/server/db"
import { NextIntlClientProvider } from "next-intl"
import { pick } from "@/lib/utils"
import { notFound } from "next/navigation"
import { DeleteOrganizationDialog } from "@/components/dialogs/delete-organization-dialog"
import { LeaveOrganizationDialog } from "@/components/dialogs/leave-organization-dialog"
import { currentUser } from "@clerk/nextjs"

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
         ownerId: true,
      },
   })

   if (!organization) notFound()

   const t = await getTranslations("organization-settings")
   const messages = (await getMessages()) as Messages
   const user = await currentUser()

   return (
      <div>
         <h1 className="mt-3 text-2xl font-medium md:mt-4 md:text-3xl">
            {t("title")}
         </h1>
         {user?.id === organization.ownerId && (
            <Card className="mt-5 flex flex-col gap-4 lg:flex-row lg:justify-between lg:p-6">
               <div>
                  <p className="text-xl font-semibold">{t("delete-title")}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                     {t("delete-subtitle")}
                  </p>
                  <p className="mt-3 text-sm text-destructive">
                     <AlertTriangle
                        size={16}
                        className="inline align-text-top"
                     />{" "}
                     {t("delete-subtitle-2")}
                  </p>
               </div>
               <NextIntlClientProvider
                  messages={pick(messages, ["organization-settings", "common"])}
               >
                  <DeleteOrganizationDialog organization={organization} />
               </NextIntlClientProvider>
            </Card>
         )}
         {user?.id !== organization.ownerId && (
            <Card className="mt-5 flex flex-col gap-4 lg:flex-row lg:justify-between lg:p-6">
               <div>
                  <p className="text-xl font-semibold">{t("leave-title")}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                     {t("leave-subtitle")}
                  </p>
               </div>
               <NextIntlClientProvider
                  messages={pick(messages, ["organization-settings", "common"])}
               >
                  <LeaveOrganizationDialog organization={organization} />
               </NextIntlClientProvider>
            </Card>
         )}
      </div>
   )
}
