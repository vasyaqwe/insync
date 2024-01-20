"use server"

import { type RouterInput } from "@/server/api/trpc"
import { api } from "@/trpc/server"
import { redirect } from "next/navigation"

export async function acceptInvitation(
   input: RouterInput["organization"]["join"]
) {
   const organizationId = await api.organization.join.mutate(input)

   redirect(`/dashboard/${organizationId}`)
}
