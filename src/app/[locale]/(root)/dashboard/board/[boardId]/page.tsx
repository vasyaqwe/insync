import { CreateList } from "@/components/forms/create-list"
import { ListsWrapper } from "@/components/list"
import { Skeleton } from "@/components/ui/skeleton"
import { metadataConfig } from "@/config"
import { pick } from "@/lib/utils"
import { db } from "@/server/db"
import { api } from "@/trpc/server"
import { currentUser } from "@clerk/nextjs"
import { LayoutIcon } from "lucide-react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { Suspense } from "react"

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
   const user = await currentUser()

   const board = await db.board.findFirst({
      where: {
         id: boardId,
      },
      select: {
         id: true,
         name: true,
         organization: {
            select: {
               members: true,
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
               <LayoutIcon
                  className="mr-2 inline"
                  size={30}
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
                  <Suspense fallback={<ListsSkeleton />}>
                     <Lists boardId={boardId} />
                     <CreateList boardId={boardId} />
                  </Suspense>
               </NextIntlClientProvider>
            </div>
         </div>
      </div>
   )
}

async function Lists({ boardId }: { boardId: string }) {
   const lists = await api.list.getAll.query({ boardId })

   return (
      <ListsWrapper
         className="mt-6"
         lists={lists}
      />
   )
}

function ListsSkeleton() {
   return (
      <div className="mt-6 flex items-start gap-4">
         <Skeleton className="w-[18rem] space-y-2 border bg-card p-3">
            <div className="flex items-center justify-between">
               <Skeleton className="h-5 w-36 rounded-lg" />
               <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[150px] w-full rounded-lg" />
         </Skeleton>
         <Skeleton className="w-[18rem] space-y-2 border bg-card p-3">
            <div className="flex items-center justify-between">
               <Skeleton className="h-5 w-36 rounded-lg" />
               <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[150px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[150px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
         </Skeleton>
         <Skeleton className="w-[18rem] space-y-2 border bg-card p-3">
            <div className="flex items-center justify-between">
               <Skeleton className="h-5 w-36 rounded-lg" />
               <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[150px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
         </Skeleton>
         <Skeleton className="w-[18rem] space-y-2 border bg-card p-3">
            <div className="flex items-center justify-between">
               <Skeleton className="h-5 w-36 rounded-lg" />
               <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
            <Skeleton className="h-[46px] w-full rounded-lg" />
         </Skeleton>
      </div>
   )
}
