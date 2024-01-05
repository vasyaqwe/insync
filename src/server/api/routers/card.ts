import {
   createCardCommentSchema,
   createCardSchema,
   deleteCardSchema,
   getCardCommentsSchema,
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
   getComments: privateProcedure
      .input(getCardCommentsSchema)
      .query(async ({ ctx, input: { cardId } }) => {
         const comments = await ctx.db.cardComment.findMany({
            where: {
               cardId,
            },
            include: {
               author: true,
            },
            orderBy: {
               createdAt: "desc",
            },
         })

         return comments
      }),
   createComment: privateProcedure
      .input(createCardCommentSchema)
      .mutation(async ({ ctx, input: { content, cardId } }) => {
         const createdCard = await ctx.db.cardComment.create({
            data: {
               authorId: ctx.session.userId!,
               content,
               cardId,
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
      .mutation(async ({ ctx, input: { cardId, ...rest } }) => {
         const updatedCard = await ctx.db.card.update({
            where: {
               id: cardId,
            },
            data: {
               ...rest,
            },
         })

         return { name: updatedCard.name, description: updatedCard.description }
      }),
   delete: privateProcedure
      .input(deleteCardSchema)
      .mutation(async ({ ctx, input: { cardId } }) => {
         const deletedCard = await ctx.db.card.delete({
            where: {
               id: cardId,
            },
            select: {
               description: true,
               name: true,
            },
         })

         return { name: deletedCard.name, description: deletedCard.description }
      }),
})
