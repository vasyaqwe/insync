import {
   createCardCommentSchema,
   createCardSchema,
   deleteCardCommentSchema,
   deleteCardSchema,
   getCardItemsSchema,
   updateCardOrderSchema,
   updateCardSchema,
} from "@/lib/validations/card"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { createAuditLog } from "@/server/api/utils"
import { TRPCError } from "@trpc/server"

export const cardRouter = createTRPCRouter({
   create: privateProcedure
      .input(createCardSchema)
      .mutation(async ({ ctx, input: { name, listId } }) => {
         const cardsCount = await ctx.db.card.count({
            where: { listId: listId },
         })

         const organization = await ctx.db.organization.findFirst({
            where: {
               boards: {
                  some: {
                     lists: {
                        some: {
                           id: listId,
                        },
                     },
                  },
               },
            },
            select: {
               id: true,
            },
         })

         if (!organization) {
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: "Organization not found",
            })
         }

         const createdCard = await ctx.db.card.create({
            data: {
               name,
               listId,
               order: cardsCount + 1,
               organizationId: organization.id,
            },
         })

         await createAuditLog({
            action: "CREATE",
            entityId: createdCard.id,
            entityName: createdCard.name,
            entityType: "CARD",
            organizationId: createdCard.organizationId,
            userId: ctx.session.userId!,
         })

         return createdCard.id
      }),
   getComments: privateProcedure
      .input(getCardItemsSchema)
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
   getAuditLogs: privateProcedure
      .input(getCardItemsSchema)
      .query(async ({ ctx, input: { cardId } }) => {
         const auditLogs = await ctx.db.auditLog.findMany({
            where: {
               entityId: cardId,
               entityType: "CARD",
            },
            include: {
               user: true,
            },
            orderBy: {
               createdAt: "desc",
            },
         })

         return auditLogs
      }),
   createComment: privateProcedure
      .input(createCardCommentSchema)
      .mutation(async ({ ctx, input: { content, cardId } }) => {
         const createdComment = await ctx.db.cardComment.create({
            data: {
               authorId: ctx.session.userId!,
               content,
               cardId,
            },
            select: {
               card: {
                  select: {
                     id: true,
                     name: true,
                     organizationId: true,
                  },
               },
            },
         })

         await createAuditLog({
            action: "UPDATE",
            entityId: createdComment.card.id,
            entityName: createdComment.card.name,
            entityType: "CARD",
            organizationId: createdComment.card.organizationId,
            userId: ctx.session.userId!,
         })

         return "OK"
      }),
   deleteComment: privateProcedure
      .input(deleteCardCommentSchema)
      .mutation(async ({ ctx, input: { commentId } }) => {
         const deletedComment = await ctx.db.cardComment.delete({
            where: {
               id: commentId,
               authorId: ctx.session.userId,
            },
            select: {
               content: true,
               card: {
                  select: {
                     id: true,
                     name: true,
                     organizationId: true,
                  },
               },
            },
         })

         await createAuditLog({
            action: "UPDATE",
            entityId: deletedComment.card.id,
            entityName: deletedComment.card.name,
            entityType: "CARD",
            organizationId: deletedComment.card.organizationId,
            userId: ctx.session.userId!,
         })

         return { content: deletedComment.content }
      }),
   updateOrder: privateProcedure
      .input(updateCardOrderSchema)
      .mutation(
         async ({
            ctx,
            input: { items, destinationListName, sourceListName, movedCard },
         }) => {
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

            if (destinationListName && movedCard) {
               await createAuditLog({
                  action: "MOVE",
                  entityId: movedCard.id,
                  entityName: movedCard.name,
                  destinationEntityName: destinationListName,
                  sourceEntityName: sourceListName,
                  entityType: "CARD",
                  organizationId: movedCard.organizationId,
                  userId: ctx.session.userId!,
               })
            }

            return "OK"
         }
      ),
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

         await createAuditLog({
            action: "UPDATE",
            entityId: updatedCard.id,
            entityName: updatedCard.name,
            entityType: "CARD",
            organizationId: updatedCard.organizationId,
            userId: ctx.session.userId!,
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
               id: true,
               organizationId: true,
               description: true,
               name: true,
            },
         })

         await createAuditLog({
            action: "DELETE",
            entityId: deletedCard.id,
            entityName: deletedCard.name,
            entityType: "CARD",
            organizationId: deletedCard.organizationId,
            userId: ctx.session.userId!,
         })

         return { name: deletedCard.name, description: deletedCard.description }
      }),
})
