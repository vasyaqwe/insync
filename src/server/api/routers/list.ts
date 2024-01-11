import {
   createListSchema,
   deleteListSchema,
   getAllListsSchema,
   updateListOrderSchema,
   updateListSchema,
} from "@/lib/validations/list"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { createAuditLog } from "@/server/api/utils"
import { TRPCError } from "@trpc/server"

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

         const organization = await ctx.db.organization.findFirst({
            where: {
               boards: {
                  some: {
                     id: boardId,
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

         const createdList = await ctx.db.list.create({
            data: {
               name,
               boardId,
               order: listsCount + 1,
               organizationId: organization.id,
            },
         })

         await createAuditLog({
            action: "CREATE",
            entityId: createdList.id,
            entityName: createdList.name,
            entityType: "LIST",
            organizationId: createdList.organizationId,
            userId: ctx.session.userId!,
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

         await createAuditLog({
            action: "UPDATE",
            entityId: updatedList.id,
            entityName: updatedList.name,
            entityType: "LIST",
            organizationId: updatedList.organizationId,
            userId: ctx.session.userId!,
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
               id: true,
               organizationId: true,
               cards: {
                  select: {
                     description: true,
                  },
               },
            },
         })

         await createAuditLog({
            action: "DELETE",
            entityId: deletedList.id,
            entityName: deletedList.name,
            entityType: "LIST",
            organizationId: deletedList.organizationId,
            userId: ctx.session.userId!,
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
