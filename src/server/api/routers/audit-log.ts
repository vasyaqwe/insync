import { z } from "zod"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"

export const auditLogRouter = createTRPCRouter({
   getAll: privateProcedure
      .input(
         z.object({
            organizationId: z.string(),
            limit: z.number(),
            cursor: z.string().nullish(),
         })
      )
      .query(async ({ ctx, input: { organizationId, limit, cursor } }) => {
         const auditLogs = await ctx.db.auditLog.findMany({
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            where: {
               organizationId,
            },
            include: {
               user: true,
            },
            orderBy: {
               createdAt: "desc",
            },
         })

         let nextCursor: typeof cursor | undefined = undefined

         if (auditLogs.length > limit) {
            const nextItem = auditLogs.pop()
            nextCursor = nextItem!.id
         }

         return {
            auditLogs,
            nextCursor,
         }
      }),
})
