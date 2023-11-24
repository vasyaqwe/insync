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
                        mode: "insensitive",
                     },
                  },
                  {
                     lastName: {
                        startsWith: query,
                        mode: "insensitive",
                     },
                  },
                  {
                     email: {
                        startsWith: query,
                        mode: "insensitive",
                     },
                  },
               ],
            },
         })

         return results
      }),
})
