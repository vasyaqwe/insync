import { userRouter } from "@/server/api/routers/user"
import { organizationRouter } from "@/server/api/routers/organization"
import { createTRPCRouter } from "@/server/api/trpc"
import { boardRouter } from "@/server/api/routers/board"
import { listRouter } from "@/server/api/routers/list"
import { cardRouter } from "@/server/api/routers/card"
import { auditLogRouter } from "@/server/api/routers/audit-log"
import { uploadthingRouter } from "@/server/api/routers/uploadthing"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
   user: userRouter,
   organization: organizationRouter,
   board: boardRouter,
   list: listRouter,
   card: cardRouter,
   auditLog: auditLogRouter,
   uploadthing: uploadthingRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
