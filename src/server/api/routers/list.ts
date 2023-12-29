import {
   createListSchema,
   deleteListSchema,
   getAllListsSchema,
   updateListOrderSchema,
   updateListSchema,
} from "@/lib/validations/list"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"

export const listRouter = createTRPCRouter({
   getAll: privateProcedure
      .input(getAllListsSchema)
      .query(async ({ ctx, input: { boardId } }) => {
         const lists = await ctx.db.list.findMany({
            where: { boardId },
            orderBy: {
               order: "asc",
            },
            include: {
               cards: {
                  orderBy: {
                     order: "asc",
                  },
               },
            },
         })

         return lists
      }),
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
   updateOrder: privateProcedure
      .input(updateListOrderSchema)
      .mutation(async ({ ctx, input: { items } }) => {
         const transaction = items.map((item) =>
            ctx.db.list.update({
               where: {
                  id: item.id,
               },
               data: {
                  order: item.order,
               },
            })
         )

         await ctx.db.$transaction(transaction)

         return "OK"
      }),
   update: privateProcedure
      .input(updateListSchema)
      .mutation(async ({ ctx, input: { listId, name } }) => {
         const updatedList = await ctx.db.list.update({
            where: {
               id: listId,
            },
            data: {
               name,
            },
         })

         return updatedList.name
      }),
   delete: privateProcedure
      .input(deleteListSchema)
      .mutation(async ({ ctx, input: { listId } }) => {
         const deletedList = await ctx.db.list.delete({
            where: {
               id: listId,
            },
            select: {
               name: true,
               cards: {
                  select: {
                     description: true,
                  },
               },
            },
         })

         const deletedDescriptions = deletedList.cards.map(
            (card) => card.description ?? ""
         )

         return {
            name: deletedList.name,
            editorContents: deletedDescriptions,
         }
      }),
})
