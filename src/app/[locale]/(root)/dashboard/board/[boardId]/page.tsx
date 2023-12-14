import { db } from "@/server/db"
import { LayoutIcon } from "lucide-react"
import { notFound } from "next/navigation"

export default async function Page({
   params: { boardId },
}: {
   params: { boardId: string }
}) {
   const board = await db.board.findFirst({
      where: {
         id: boardId,
      },
      select: {
         id: true,
         name: true,
      },
   })

   if (!board) notFound()

   return (
      <div className="container py-8 lg:py-16">
         <h2 className="mt-4 text-3xl font-medium">
            <LayoutIcon
               className="mr-2 inline"
               size={30}
            />
            {board.name}
         </h2>
         <div className="mt-4 grid grid-cols-fluid gap-4">
            {/* <NextIntlClientProvider
               messages={pick(messages, ["boards", "common"])}
            >
               {board.boards.map((board) => (
                  <Board
                     board={board}
                     boardId={board.id}
                     key={board.id}
                  />
               ))}
               <CreateBoard boardId={boardId} />
            </NextIntlClientProvider> */}
         </div>
      </div>
   )
}
