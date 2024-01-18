import { BoardsList } from "@/components/boards-list"
import { pick } from "@/lib/utils"
import { api } from "@/trpc/server"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"

export default async function Page({
   params: { organizationId },
}: {
   params: { organizationId: string }
}) {
   const t = await getTranslations("boards")
   const messages = (await getMessages()) as Messages

   const boards = await api.board.getAll.query({ organizationId })

   return (
      <div>
         <h1 className="mt-3 text-2xl font-medium md:mt-4 md:text-3xl">
            {t("title")}
         </h1>
         <div className="mt-5 grid grid-cols-fluid gap-4">
            <NextIntlClientProvider
               messages={pick(messages, ["boards", "common"])}
            >
               <BoardsList
                  initialBoards={boards}
                  organizationId={organizationId}
               />
            </NextIntlClientProvider>
         </div>
      </div>
   )
}
