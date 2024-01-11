import {
   createBoardSchema,
   deleteBoardSchema,
   updateBoardSchema,
} from "@/lib/validations/board"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { createAuditLog } from "@/server/api/utils"

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

         await createAuditLog({
            action: "CREATE",
            entityId: createdBoard.id,
            entityName: createdBoard.name,
            entityType: "BOARD",
            organizationId,
            userId: ctx.session.userId!,
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

         await createAuditLog({
            action: "UPDATE",
            entityId: updatedBoard.id,
            entityName: updatedBoard.name,
            entityType: "BOARD",
            organizationId: updatedBoard.organizationId,
            userId: ctx.session.userId!,
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
               id: true,
               name: true,
               organizationId: true,
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

         await createAuditLog({
            action: "DELETE",
            entityId: deletedBoard.id,
            entityName: deletedBoard.name,
            entityType: "BOARD",
            organizationId: deletedBoard.organizationId,
            userId: ctx.session.userId!,
         })

         return {
            name: deletedBoard.name,
            editorContents: deletedDescriptions,
         }
      }),
})
