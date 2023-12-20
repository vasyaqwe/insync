import { Board } from "@/components/board"
import { CreateBoard } from "@/components/forms/create-board"

import { pick } from "@/lib/utils"
import { db } from "@/server/db"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"

export default async function Page({
   params: { organizationId },
}: {
   params: { organizationId: string }
}) {
   const boards = await db.board.findMany({
      where: {
         organizationId,
      },
   })

   const t = await getTranslations("boards")
   const messages = (await getMessages()) as Messages

   return (
      <div>
         <h1 className="mt-3 text-2xl font-medium md:mt-4 md:text-3xl">
            {t("title")}
         </h1>
         <div className="mt-5 grid grid-cols-fluid gap-4">
            <NextIntlClientProvider
               messages={pick(messages, ["boards", "common"])}
            >
               {boards.map((board) => (
                  <Board
                     board={board}
                     key={board.id}
                  />
               ))}
               <CreateBoard
                  className={boards.length < 1 ? "w-[312px]" : ""}
                  organizationId={organizationId}
               />
            </NextIntlClientProvider>
         </div>
      </div>
   )
}
