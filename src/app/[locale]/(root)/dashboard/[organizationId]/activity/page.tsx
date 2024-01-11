import { Card } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"
import { db } from "@/server/db"
import { UserAvatar } from "@/components/ui/user-avatar"
import { type ACTION, type ENTITY_TYPE } from "@prisma/client"
import { DateDisplay } from "@/components/date-display"

export default async function Page({
   params: { organizationId },
}: {
   params: { organizationId: string }
}) {
   const auditLogs = await db.auditLog.findMany({
      where: {
         organizationId,
      },
      include: {
         user: true,
      },
      orderBy: {
         createdAt: "desc",
      },
   })

   const t = await getTranslations("activity")
   const tCommon = await getTranslations("common")

   const actionLookup: Record<ACTION, string> = {
      CREATE: t("created"),
      UPDATE: t("updated"),
      DELETE: t("deleted"),
   }

   const entityTypeLookup: Record<ENTITY_TYPE, string> = {
      BOARD: t("board"),
      LIST: t("list"),
      CARD: t("card"),
   }

   return (
      <div>
         <h1 className="mt-3 text-2xl font-medium md:mt-4 md:text-3xl">
            {t("title")}
         </h1>
         <Card className="mt-5 lg:p-6">
            {auditLogs.length < 1 ? (
               <p className="flex items-center gap-2">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth="1.5"
                     stroke="currentColor"
                     className="h-6 w-6 flex-shrink-0"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                     />
                  </svg>
                  {t("empty")}
               </p>
            ) : (
               auditLogs.map((log) => (
                  <div
                     className="flex items-start gap-2 border-t-2 border-dotted border-muted py-4 first-of-type:border-none first-of-type:pt-0 last-of-type:pb-0"
                     key={log.id}
                  >
                     <UserAvatar
                        className="mt-0.5"
                        user={log.user}
                     />
                     <div>
                        <p className="leading-snug text-foreground/80">
                           <strong className="font-medium">
                              {log.user.firstName} {log.user.lastName}
                           </strong>{" "}
                           {actionLookup[log.action]}{" "}
                           {entityTypeLookup[log.entityType]}{" "}
                           <strong className="font-medium">
                              "{log.entityName}"
                           </strong>
                        </p>
                        <DateDisplay
                           className="text-sm font-normal text-muted-foreground"
                           justNowText={tCommon("just-now")}
                        >
                           {log.createdAt}
                        </DateDisplay>
                     </div>
                  </div>
               ))
            )}
         </Card>
      </div>
   )
}
