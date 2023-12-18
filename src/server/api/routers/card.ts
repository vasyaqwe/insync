import {
   createCardSchema,
   deleteCardSchema,
   updateCardOrderSchema,
   updateCardSchema,
} from "@/lib/validations/card"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"

export const cardRouter = createTRPCRouter({
   create: privateProcedure
      .input(createCardSchema)
      .mutation(async ({ ctx, input: { name, listId } }) => {
         const cardsCount = await ctx.db.card.count({
            where: { listId: listId },
         })

         const createdCard = await ctx.db.card.create({
            data: {
               name,
               listId,
               order: cardsCount + 1,
            },
         })

         return createdCard.id
      }),
   updateOrder: privateProcedure
      .input(updateCardOrderSchema)
      .mutation(async ({ ctx, input: { items } }) => {
         const transaction = items.map((item) =>
            ctx.db.card.update({
               where: {
                  id: item.id,
               },
               data: {
                  order: item.order,
                  listId: item.listId,
               },
            })
         )

         await ctx.db.$transaction(transaction)

         return "OK"
      }),
   update: privateProcedure
      .input(updateCardSchema)
      .mutation(async ({ ctx, input: { cardId, name } }) => {
         const deletedCard = await ctx.db.card.update({
            where: {
               id: cardId,
            },
            data: {
               name,
            },
         })

         return deletedCard.name
      }),
   delete: privateProcedure
      .input(deleteCardSchema)
      .mutation(async ({ ctx, input: { cardId } }) => {
         const deletedCard = await ctx.db.card.delete({
            where: {
               id: cardId,
            },
         })

         return deletedCard.name
      }),
})