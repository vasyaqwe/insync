import { CreateList } from "@/components/forms/create-list"
import { ListsWrapper } from "@/components/list"
import { metadataConfig } from "@/config"
import { pick } from "@/lib/utils"
import { db } from "@/server/db"
import { LayoutIcon } from "lucide-react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"

type Params = {
   params: { boardId: string }
}

export async function generateMetadata({ params: { boardId } }: Params) {
   const board = await db.board.findFirst({
      where: {
         id: boardId,
      },
      select: {
         name: true,
      },
   })
   if (!board) return { ...metadataConfig, title: `insync. | Board not found` }
   return { ...metadataConfig, title: `insync. | ${board.name}` }
}

export default async function Page({ params: { boardId } }: Params) {
   const board = await db.board.findFirst({
      where: {
         id: boardId,
      },
      select: {
         id: true,
         name: true,
         lists: {
            orderBy: {
               order: "asc",
            },
            include: {
               cards: {
                  orderBy: {
                     order: "asc",
                  },
               },
            },
         },
      },
   })

   if (!board) notFound()

   const messages = (await getMessages()) as Messages

   return (
      <div className="container py-6 lg:py-14">
         <h1 className="text-3xl font-medium">
            <LayoutIcon
               className="mr-2 inline"
               size={30}
            />
            {board.name}
         </h1>
         <div className="mt-6 flex items-start gap-4 overflow-x-auto">
            <NextIntlClientProvider
               messages={pick(messages, ["lists", "cards", "common"])}
            >
               <ListsWrapper board={board} />
               <CreateList boardId={boardId} />
            </NextIntlClientProvider>
         </div>
      </div>
   )
}