import { type Prisma } from "@prisma/client"
import { db } from "@/server/db"

export const createAuditLog = async ({
   organizationId,
   userId,
   entityId,
   entityType,
   entityName,
   sourceEntityName,
   destinationEntityName,
   action,
}: Omit<Prisma.AuditLogCreateInput, "organization" | "user"> & {
   organizationId: string
   userId: string
}) => {
   const res = await db.auditLog.create({
      data: {
         userId,
         organizationId,
         entityId,
         entityType,
         entityName,
         destinationEntityName,
         sourceEntityName,
         action,
      },
   })

   return res
}
