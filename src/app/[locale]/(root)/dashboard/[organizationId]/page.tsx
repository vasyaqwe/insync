import { db } from "@/server/db"
import { notFound } from "next/navigation"

export default async function Page({
   params: { organizationId },
}: {
   params: { organizationId: string }
}) {
   const organization = await db.organization.findFirst({
      where: {
         id: organizationId,
      },
      select: {
         id: true,
         name: true,
      },
   })

   if (!organization) notFound()

   return <></>
}
