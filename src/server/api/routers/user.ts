import { z } from "zod"

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"

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
})
