import { z } from "zod"

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { updateUserSchema } from "@/lib/validations/user"
import { clerkClient } from "@clerk/nextjs/server"

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
         await clerkClient.users.updateUser(ctx.session.userId!, input)

         return "OK"
      }),
})
