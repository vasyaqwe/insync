import {
   createBoardSchema,
   deleteBoardSchema,
   updateBoardSchema,
} from "@/lib/validations/board"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"

export const boardRouter = createTRPCRouter({
   create: privateProcedure
      .input(createBoardSchema)
      .mutation(async ({ ctx, input: { name, organizationId } }) => {
         const createdBoard = await ctx.db.board.create({
            data: {
               name,
               organizationId,
            },
         })

         return createdBoard.id
      }),
   update: privateProcedure
      .input(updateBoardSchema)
      .mutation(async ({ ctx, input: { boardId, name } }) => {
         const updatedBoard = await ctx.db.board.update({
            where: {
               id: boardId,
            },
            data: {
               name,
            },
         })

         return updatedBoard.name
      }),
   delete: privateProcedure
      .input(deleteBoardSchema)
      .mutation(async ({ ctx, input: { boardId } }) => {
         const deletedBoard = await ctx.db.board.delete({
            where: {
               id: boardId,
            },
            select: {
               name: true,
               lists: {
                  select: {
                     cards: {
                        select: {
                           description: true,
                        },
                     },
                  },
               },
            },
         })

         const deletedCards = deletedBoard.lists.flatMap((list) => list.cards)

         const deletedDescriptions = deletedCards.map(
            (card) => card.description ?? ""
         )

         return {
            name: deletedBoard.name,
            editorContents: deletedDescriptions,
         }
      }),
})
