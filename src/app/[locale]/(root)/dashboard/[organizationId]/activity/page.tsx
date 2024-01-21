import { getMessages, getTranslations } from "next-intl/server"
import { createSSRHelper } from "@/server/api/ssr"
import { NextIntlClientProvider } from "next-intl"
import { pick } from "@/lib/utils"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { ActivityList } from "@/components/lists/activity-list"

export default async function Page({
   params: { organizationId },
}: {
   params: { organizationId: string }
}) {
   const t = await getTranslations("activity")
   const messages = (await getMessages()) as Messages

   const helpers = await createSSRHelper()

   await helpers.auditLog.getAll.prefetchInfinite({ organizationId, limit: 25 })

   return (
      <div>
         <h1 className="mt-3 text-2xl font-medium md:mt-4 md:text-3xl">
            {t("title")}
         </h1>
         <NextIntlClientProvider
            messages={pick(messages, ["activity", "common"])}
         >
            <HydrationBoundary state={dehydrate(helpers.queryClient)}>
               <ActivityList organizationId={organizationId} />
            </HydrationBoundary>
         </NextIntlClientProvider>
      </div>
   )
}
