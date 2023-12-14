import { redirect } from "@/navigation"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"

export default async function Page() {
   const user = await currentUser()

   const organizations = await db.organization.findMany({
      where: {
         members: {
            some: {
               id: user?.id,
            },
         },
      },
   })

   if (organizations.length > 0)
      return redirect(`/dashboard/${organizations[0]?.id}`)

   return null
}
