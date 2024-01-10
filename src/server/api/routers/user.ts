import { z } from "zod"

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { updateUserSchema } from "@/lib/validations/user"
import { clerkClient } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"

export const userRouter = createTRPCRouter({
   search: privateProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ ctx, input: { query } }) => {
         const results = await ctx.db.user.findMany({
            where: {
               OR: [
                  {
                     firstName: {
                        startsWith: query,
                     },
                  },
                  {
                     lastName: {
                        startsWith: query,
                     },
                  },
                  {
                     email: {
                        startsWith: query,
                     },
                  },
               ],
            },
         })

         return results
      }),
   update: privateProcedure
      .input(updateUserSchema)
      .mutation(async ({ ctx, input }) => {
         const updatedUser = await clerkClient.users.updateUser(
            ctx.session.userId!,
            input
         )

         if (updatedUser) {
            const updatedUserDb = await ctx.db.user.update({
               where: {
                  id: ctx.session.userId!,
               },
               data: input,
            })

            return updatedUserDb.imageUrl
         }

         throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Organization not found",
         })
      }),
})
