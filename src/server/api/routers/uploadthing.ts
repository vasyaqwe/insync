import { z } from "zod"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { UTApi } from "uploadthing/server"
import "@total-typescript/ts-reset"

const utapi = new UTApi()

const deleteFilesSchema = z.object({
   fileIds: z.array(z.string()),
})

export const uploadthingRouter = createTRPCRouter({
   deleteFiles: privateProcedure
      .input(deleteFilesSchema)
      .mutation(async ({ input: { fileIds } }) => {
         await utapi.deleteFiles(fileIds)

         return "OK"
      }),
})
