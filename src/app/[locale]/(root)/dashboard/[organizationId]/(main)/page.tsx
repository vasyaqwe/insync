import { BoardsList } from "@/components/lists/boards-list"
import { pick } from "@/lib/utils"
import { createSSRHelper } from "@/server/api/ssr"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"

export default async function Page({
   params: { organizationId },
}: {
   params: { organizationId: string }
}) {
   const t = await getTranslations("boards")
   const messages = (await getMessages()) as Messages

   const helpers = await createSSRHelper()

   await helpers.board.getAll.prefetch({ organizationId })

   return (
      <div>
         <h1 className="mt-3 text-2xl font-medium md:mt-4 md:text-3xl">
            {t("title")}
         </h1>
         <div className="mt-5 grid grid-cols-fluid gap-4">
            <NextIntlClientProvider
               messages={pick(messages, ["boards", "common"])}
            >
               <HydrationBoundary state={dehydrate(helpers.queryClient)}>
                  <BoardsList organizationId={organizationId} />
               </HydrationBoundary>
            </NextIntlClientProvider>
         </div>
      </div>
   )
}
