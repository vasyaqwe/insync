"use client"

import { Board } from "@/components/board"
import { CreateBoard } from "@/components/forms/create-board"
import { api } from "@/trpc/react"

type BoardsListProps = {
   organizationId: string
}

export function BoardsList({ organizationId }: BoardsListProps) {
   const { data: boards } = api.board.getAll.useQuery({ organizationId })

   return (
      <>
         {boards?.map((board) => (
            <Board
               board={board}
               key={board.id}
            />
         ))}
         <CreateBoard
            className={(boards?.length ?? 0) < 1 ? "w-[312px]" : ""}
            organizationId={organizationId}
         />
      </>
   )
}
