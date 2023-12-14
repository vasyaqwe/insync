import { createBoardSchema } from "@/lib/validations/board"
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
})
