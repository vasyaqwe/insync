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
         const createdBoard = await ctx.db.$transaction(async (tx) => {
            const createdBoard = await tx.board.create({
               data: {
                  name,
                  organizationId,
               },
            })

            return createdBoard
         })

         return createdBoard.id
      }),
   update: privateProcedure
      .input(updateBoardSchema)
      .mutation(async ({ ctx, input: { boardId, name } }) => {
         const deletedBoard = await ctx.db.board.update({
            where: {
               id: boardId,
            },
            data: {
               name,
            },
         })

         return deletedBoard.name
      }),
   delete: privateProcedure
      .input(deleteBoardSchema)
      .mutation(async ({ ctx, input: { boardId } }) => {
         const deletedBoard = await ctx.db.board.delete({
            where: {
               id: boardId,
            },
         })

         return deletedBoard.name
      }),
})
