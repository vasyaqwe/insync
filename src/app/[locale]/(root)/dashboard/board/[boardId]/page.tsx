import { CreateList } from "@/components/forms/create-list"
import { ListsWrapper } from "@/components/list"
import { pick } from "@/lib/utils"
import { db } from "@/server/db"
import { metadataConfig } from "@/config"
import { currentUser } from "@clerk/nextjs"
import { KanbanSquare } from "lucide-react"
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

export const dynamic = "force-dynamic"

export default async function Page({ params: { boardId } }: Params) {
   const user = await currentUser()

   const board = await db.board.findFirst({
      where: {
         id: boardId,
      },
      select: {
         id: true,
         name: true,
         organizationId: true,
         lists: {
            include: {
               cards: {
                  orderBy: {
                     order: "asc",
                  },
               },
            },
            orderBy: {
               order: "asc",
            },
         },
         organization: {
            select: {
               members: {
                  select: { id: true },
               },
            },
         },
      },
   })

   if (!board || !board.organization.members.some((m) => m.id === user?.id))
      notFound()

   const messages = (await getMessages()) as Messages

   return (
      <div className="grid h-full grid-cols-full-width-split-screen py-10 lg:py-12">
         <div className="col-start-2 col-end-5 md:pl-[var(--container-padding-inline)]">
            <h1 className="text-3xl font-medium">
               <KanbanSquare
                  className="mr-2 inline"
                  size={26}
               />
               {board.name}
            </h1>
            <div className="flex h-full items-start gap-4 overflow-x-auto pr-4">
               <NextIntlClientProvider
                  messages={pick(messages, [
                     "lists",
                     "cards",
                     "common",
                     "editor",
                  ])}
               >
                  <ListsWrapper
                     className="mt-6"
                     initialLists={board.lists}
                     boardId={board.id}
                  />
                  <CreateList
                     boardId={boardId}
                     organizationId={board.organizationId}
                  />
               </NextIntlClientProvider>
            </div>
         </div>
      </div>
   )
}
