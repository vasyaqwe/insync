"use client"

import { Board } from "@/components/board"
import { CreateBoard } from "@/components/forms/create-board"
import { api } from "@/trpc/react"
import { type Board as BoardType } from "@prisma/client"

type BoardsListProps = {
   initialBoards: BoardType[]
   organizationId: string
}

export function BoardsList({ initialBoards, organizationId }: BoardsListProps) {
   const { data: boards } = api.board.getAll.useQuery(
      { organizationId },
      {
         initialData: initialBoards,
         refetchOnMount: false,
      }
   )

   return (
      <>
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
      </>
   )
}
