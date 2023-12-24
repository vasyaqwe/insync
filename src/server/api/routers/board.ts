import {
   createBoardSchema,
   deleteBoardSchema,
   updateBoardSchema,
} from "@/lib/validations/board"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { UTApi } from "uploadthing/server"

const utapi = new UTApi()

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
                     cards: true,
                  },
               },
            },
         })

         const deletedCards = deletedBoard.lists.flatMap((list) => list.cards)

         const deletedImages = deletedCards.flatMap((card) => card.images)

         const deletedImageIds = deletedImages.map(
            (img) => img?.split("/f/")[1] ?? ""
         )

         if (deletedImageIds.length > 0) {
            await utapi.deleteFiles(deletedImageIds)
         }

         return deletedBoard.name
      }),
})
