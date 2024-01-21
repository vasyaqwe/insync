"use client"

import { Card } from "@/components/ui/card"
import { api } from "@/trpc/react"
import { UserAvatar } from "@/components/ui/user-avatar"
import { DateDisplay } from "@/components/date-display"
import { actionLookup, entityTypeLookup } from "@/config"
import { useTranslations } from "next-intl"
import { useIntersection } from "@/hooks/use-intersection"
import { useEffect } from "react"
import { Loading } from "@/components/ui/loading"

type ActivityListProps = {
   organizationId: string
}

export function ActivityList({ organizationId }: ActivityListProps) {
   const t = useTranslations("activity")
   const tCommon = useTranslations("common")

   const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
      api.auditLog.getAll.useInfiniteQuery(
         {
            organizationId,
            limit: 25,
         },
         {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
         }
      )

   const { ref, entry } = useIntersection({
      threshold: 0,
   })

   useEffect(() => {
      if (entry?.isIntersecting && hasNextPage) {
         void fetchNextPage()
      }
   }, [entry, hasNextPage, fetchNextPage])

   const auditLogs = data?.pages?.flatMap((item) => item.auditLogs)

   return (
      <Card className="relative mt-5 pb-8 lg:p-6 lg:pb-10">
         {error ? (
            <p className={"mt-2 text-destructive"}>{error.message}</p>
         ) : (auditLogs?.length ?? 0) < 1 ? (
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
            auditLogs?.map((log) => (
               <div
                  className="flex items-start gap-2 border-t border-dotted border-muted py-3 first-of-type:border-none first-of-type:pt-0 last-of-type:pb-0"
                  key={log.id}
               >
                  <UserAvatar
                     className="mt-0.5"
                     user={log.user}
                  />
                  <div>
                     <p className="leading-snug text-foreground/75">
                        <strong className="font-medium">
                           {log.user.firstName} {log.user.lastName}
                        </strong>{" "}
                        {tCommon(actionLookup[log.action])}{" "}
                        {tCommon(entityTypeLookup[log.entityType])}{" "}
                        <strong className="font-medium">
                           "{log.entityName}"
                        </strong>{" "}
                        {log.action === "MOVE" && (
                           <>
                              {tCommon("from")}{" "}
                              <strong className="font-medium">
                                 "{log.sourceEntityName}"
                              </strong>{" "}
                              {tCommon("to")}{" "}
                              <strong className="font-medium">
                                 "{log.destinationEntityName}"
                              </strong>
                           </>
                        )}
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
         <div
            ref={ref}
            aria-hidden={true}
         />
         {isFetchingNextPage && (
            <Loading className="absolute bottom-6 left-1/2 -translate-x-1/2" />
         )}
      </Card>
   )
}
