import { z } from "zod"

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { clerkClient } from "@clerk/nextjs/server"

export const userRouter = createTRPCRouter({
   search: privateProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
         const res =
            (await clerkClient.users.getUserList({
               query: input.query,
            })) ?? []

         return res
      }),
   // create: publicProcedure
   //    .input(z.object({ name: z.string().min(1) }))
   //    .mutation(async ({ ctx, input }) => {

   //       return ctx.db.user.create({
   //          data: {
   //             name: input.name,
   //          },
   //       })
   //    }),
})
