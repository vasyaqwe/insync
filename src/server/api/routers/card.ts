import {
   createCardSchema,
   deleteCardSchema,
   updateCardOrderSchema,
   updateCardSchema,
} from "@/lib/validations/card"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { UTApi } from "uploadthing/server"

const utapi = new UTApi()

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
      .mutation(
         async ({
            ctx,
            input: { cardId, imagesToDeleteFromServer, ...rest },
         }) => {
            const card = await ctx.db.card.findFirst({
               where: {
                  id: cardId,
               },
               select: {
                  images: true,
               },
            })

            if (!card) {
               throw new TRPCError({
                  code: "BAD_REQUEST",
                  message: "Card not found",
               })
            }

            const updatedCard = await ctx.db.card.update({
               where: {
                  id: cardId,
               },
               data: {
                  ...rest,
               },
            })
            console.log(imagesToDeleteFromServer)
            if (card.images.length > 0) {
               const removedImages = card.images.filter(
                  (image) => !updatedCard.images.includes(image)
               )

               const removedImageIds = removedImages.map(
                  (img) => img?.split("/f/")[1] ?? ""
               )

               if (removedImageIds.length > 0) {
                  await utapi.deleteFiles(removedImageIds)
               }
            } else if (imagesToDeleteFromServer.length > 0) {
               const ids = imagesToDeleteFromServer.map(
                  (img) => img?.split("/f/")[1] ?? ""
               )
               await utapi.deleteFiles(ids)
            }

            return updatedCard.name
         }
      ),
   delete: privateProcedure
      .input(deleteCardSchema)
      .mutation(async ({ ctx, input: { cardId } }) => {
         const deletedCard = await ctx.db.card.delete({
            where: {
               id: cardId,
            },
         })

         const imageIds = deletedCard.images.map(
            (img) => img?.split("/f/")[1] ?? ""
         )

         if (imageIds.length > 0) {
            await utapi.deleteFiles(imageIds)
         }

         return deletedCard.name
      }),
})
