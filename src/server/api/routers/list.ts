import {
   createListSchema,
   deleteListSchema,
   updateListSchema,
} from "@/lib/validations/list"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"

export const listRouter = createTRPCRouter({
   create: privateProcedure
      .input(createListSchema)
      .mutation(async ({ ctx, input: { name, boardId } }) => {
         const listsCount = await ctx.db.list.count({
            where: { boardId: boardId },
         })

         const createdList = await ctx.db.list.create({
            data: {
               name,
               boardId,
               order: listsCount + 1,
            },
         })

         return createdList.id
      }),
   update: privateProcedure
      .input(updateListSchema)
      .mutation(async ({ ctx, input: { listId, name } }) => {
         const deletedList = await ctx.db.list.update({
            where: {
               id: listId,
            },
            data: {
               name,
            },
         })

         return deletedList.name
      }),
   delete: privateProcedure
      .input(deleteListSchema)
      .mutation(async ({ ctx, input: { listId } }) => {
         const deletedList = await ctx.db.list.delete({
            where: {
               id: listId,
            },
         })

         return deletedList.name
      }),
})
